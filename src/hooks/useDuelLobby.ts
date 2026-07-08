import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useProtectedRequest } from "@/utils/protected";
import { getDuelRequest } from "@/services/games/duel";
import type {
  DuelConfig,
  DuelPlayerResponse,
  DuelResponse,
} from "@/services/games/duel.types";
import {
  connectDuelSocket,
  joinDuelLobby,
  leaveDuelLobbyRoom,
  setDuelReady,
  startDuelLobby,
  subscribeDuelLobbyError,
  subscribeDuelLobbyState,
  subscribeDuelSocketConnection,
  subscribeRaceFinished,
  subscribeRaceStarted,
  updateDuelConfig,
} from "@/lib/duelSocket";
import { saveRacePayload } from "@/lib/duelRaceCache";
import { leaveDuelRequest } from "@/services/games/duel";
import { useNotification } from "@/context/NotificationContext";
import { ROUTES } from "@/routes/paths";
import { useAuth } from "@/utils/auth";
import { getMyProfileRequest } from "@/services/user/user";
import { MY_PROFILE } from "@/routes/react-query";

export type DuelLobbyBanner =
  | { type: "reconnect" }
  | { type: "opponent_disconnected"; nickname: string }
  | { type: "opponent_left" }
  | { type: "cancelled" };

function getOpponent(
  lobby: DuelResponse,
  mySub: string | undefined
): DuelPlayerResponse | null {
  if (!mySub) {
    return null;
  }

  return lobby.players.find((player) => player.sub !== mySub) ?? null;
}

function deriveBanner(
  lobby: DuelResponse | null,
  mySub: string | undefined,
  socketConnected: boolean,
  opponentLeft: boolean
): DuelLobbyBanner | null {
  if (!lobby) {
    return null;
  }

  if (!socketConnected) {
    return { type: "reconnect" };
  }

  if (lobby.status === "cancelled") {
    return { type: "cancelled" };
  }

  if (opponentLeft && lobby.status === "waiting") {
    return { type: "opponent_left" };
  }

  const opponent = getOpponent(lobby, mySub);
  if (opponent?.disconnectedAt && lobby.status !== "racing") {
    return { type: "opponent_disconnected", nickname: opponent.nickname };
  }

  return null;
}

export function useDuelLobby(duelId: string) {
  const navigate = useNavigate();
  const { call } = useProtectedRequest();
  const { notifyError } = useNotification();
  const { authenticated, loading: authLoading } = useAuth();

  const [lobby, setLobby] = useState<DuelResponse | null>(null);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [socketConnected, setSocketConnected] = useState(true);
  const [opponentLeft, setOpponentLeft] = useState(false);
  const prevPlayerCountRef = useRef<number | null>(null);
  const lobbyStatusRef = useRef<DuelResponse["status"] | undefined>(undefined);

  const { data: profileData } = useQuery({
    queryKey: [MY_PROFILE],
    queryFn: async () => call((token) => getMyProfileRequest(token)),
    enabled: authenticated,
  });

  const {
    data,
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ["duel", duelId],
    queryFn: async () => call((token) => getDuelRequest(duelId, token)),
    enabled: Boolean(duelId) && authenticated,
  });

  const mySub = profileData?.profile.sub;

  const applyLobbyState = useCallback(
    (state: DuelResponse) => {
      const prevCount = prevPlayerCountRef.current;
      if (
        prevCount === 2 &&
        state.players.length < 2 &&
        state.status === "waiting"
      ) {
        setOpponentLeft(true);
      }

      prevPlayerCountRef.current = state.players.length;
      lobbyStatusRef.current = state.status;
      setLobby(state);
    },
    []
  );

  useEffect(() => {
    if (data?.duel) {
      applyLobbyState(data.duel);
      setInitialLoaded(true);
    }
  }, [applyLobbyState, data?.duel]);

  useEffect(() => {
    if (!duelId || !authenticated) {
      return;
    }

    joinDuelLobby(duelId).catch((joinError: Error) => {
      notifyError(joinError.message);
    });

    connectDuelSocket().catch(() => {});

    const unsubscribeState = subscribeDuelLobbyState((state) => {
      applyLobbyState(state);
      setInitialLoaded(true);
    });

    const unsubscribeError = subscribeDuelLobbyError((message) => {
      notifyError(message);
    });

    const unsubscribeConnection = subscribeDuelSocketConnection(setSocketConnected);

    const unsubscribeRaceStarted = subscribeRaceStarted((racePayload) => {
      saveRacePayload(racePayload.duelId, racePayload);
      navigate(ROUTES.duelRace(duelId), { replace: true });
    });

    const unsubscribeRaceFinished = subscribeRaceFinished(() => {
      navigate(ROUTES.duelResults(duelId), { replace: true });
    });

    return () => {
      unsubscribeState();
      unsubscribeError();
      unsubscribeConnection();
      unsubscribeRaceStarted();
      unsubscribeRaceFinished();
    };
  }, [applyLobbyState, authenticated, duelId, navigate, notifyError]);

  useEffect(() => {
    if (!lobby) {
      return;
    }

    if (lobby.status === "racing") {
      navigate(ROUTES.duelRace(duelId), { replace: true });
      return;
    }

    if (lobby.status === "finished") {
      navigate(ROUTES.duelResults(duelId), { replace: true });
    }
  }, [duelId, lobby, navigate]);

  const me = useMemo(() => {
    if (!lobby || !mySub) {
      return null;
    }

    return lobby.players.find((player) => player.sub === mySub) ?? null;
  }, [lobby, mySub]);

  const isHost = Boolean(lobby && mySub && lobby.hostSub === mySub);

  const allReady =
    Boolean(lobby) &&
    lobby!.players.length >= 2 &&
    lobby!.players.every((player) => player.ready);

  const canStart =
    isHost && lobby?.status === "waiting" && allReady && lobby.players.length >= 2;

  const countdownEndsAt = useMemo(() => {
    if (!lobby?.startedAt || lobby.status !== "countdown") {
      return null;
    }

    return (
      new Date(lobby.startedAt).getTime() + lobby.config.countdownSec * 1000
    );
  }, [lobby]);

  const banner = useMemo(
    () => deriveBanner(lobby, mySub, socketConnected, opponentLeft),
    [lobby, mySub, opponentLeft, socketConnected]
  );

  const toggleReady = useCallback(() => {
    if (!lobby || !me || lobby.status !== "waiting") {
      return;
    }

    const nextReady = !me.ready;

    setLobby((prev) => {
      if (!prev || !mySub) {
        return prev;
      }

      return {
        ...prev,
        players: prev.players.map((player) =>
          player.sub === mySub ? { ...player, ready: nextReady } : player
        ),
      };
    });

    setDuelReady({ duelId, ready: nextReady });
  }, [duelId, lobby, me, mySub]);

  const updateConfig = useCallback(
    (partial: Partial<DuelConfig>) => {
      if (!lobby || !isHost || lobby.status !== "waiting") {
        return;
      }

      setLobby((prev) => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          config: { ...prev.config, ...partial },
        };
      });

      updateDuelConfig({ duelId, config: partial });
    },
    [duelId, isHost, lobby]
  );

  const startDuel = useCallback(() => {
    if (!canStart) {
      return;
    }

    startDuelLobby({ duelId });
  }, [canStart, duelId]);

  const leaveLobby = useCallback(async () => {
    if (!duelId || !authenticated) {
      return;
    }

    try {
      await call((token) => leaveDuelRequest(duelId, token));
    } catch {
      leaveDuelLobbyRoom(duelId);
    }
  }, [authenticated, call, duelId]);

  // Leave the socket room only when navigating away while still in the waiting
  // phase. Do not depend on lobby.status — when the host starts the duel the
  // status flips to "countdown" and a status-based cleanup would incorrectly
  // emit lobby:leave for every connected player.
  useEffect(() => {
    return () => {
      if (duelId && authenticated && lobbyStatusRef.current === "waiting") {
        leaveDuelLobbyRoom(duelId);
      }
    };
  }, [authenticated, duelId]);

  const playerSlots = useMemo(() => {
    const slots: Array<DuelPlayerResponse | null> = [null, null];

    if (!lobby) {
      return slots;
    }

    lobby.players.forEach((player) => {
      const index = Math.min(Math.max(player.slot - 1, 0), 1);
      slots[index] = player;
    });

    return slots;
  }, [lobby]);

  return {
    lobby,
    me,
    mySub,
    isHost,
    allReady,
    canStart,
    playerSlots,
    countdownEndsAt,
    banner,
    authLoading,
    isInitialLoading: authLoading || (isLoading && !initialLoaded),
    fetchError,
    toggleReady,
    updateConfig,
    startDuel,
    leaveLobby,
  };
}
