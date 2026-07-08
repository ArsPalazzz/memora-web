import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useProtectedRequest } from "@/utils/protected";
import { getDuelRacePayloadRequest } from "@/services/games/duel";
import type {
  DuelRacePayload,
  DuelRaceProgress,
  DuelRaceRejoinState,
} from "@/services/games/duel.types";
import {
  advanceDuelRace,
  connectDuelSocket,
  forfeitDuelRace,
  joinDuelLobby,
  rejoinDuelRace,
  subscribeDuelLobbyState,
  subscribeDuelSocketConnection,
  subscribeRaceError,
  subscribeRaceFinished,
  subscribeRaceGraded,
  subscribeRaceProgress,
  subscribeRaceRejoinState,
  subscribeRaceStarted,
} from "@/lib/duelSocket";
import {
  loadRacePayload,
  saveRacePayload,
  saveRaceResults,
} from "@/lib/duelRaceCache";
import { useNotification } from "@/context/NotificationContext";
import { ROUTES } from "@/routes/paths";
import { useAuth } from "@/utils/auth";
import { getMyProfileRequest } from "@/services/user/user";
import { MY_PROFILE } from "@/routes/react-query";
import {
  createInitialScoreState,
  DUEL_MIN_ANSWER_DURATION_MS,
  type DuelScoreState,
} from "@/utils/duelScoring";
import type { OpponentTrackPlayer } from "@/components/duel/OpponentTrack";
import {
  DUEL_DISCONNECT_GRACE_MS,
} from "@/components/duel/DuelRaceDisconnectBanner";

export interface OpponentRaceState {
  sub: string;
  nickname: string;
  avatar_url: string | null;
  completedCards: number;
  score: number;
  streak: number;
  pulseKey: number;
  disconnectedAt: string | null;
}

function progressToCompletedCards(cardIndex: number): number {
  return cardIndex + 1;
}

function applyRejoinProgress(
  myProgress: DuelRaceRejoinState["myProgress"]
): DuelScoreState {
  return {
    score: myProgress.score,
    correctCount: myProgress.correctCount,
    wrongCount: myProgress.wrongCount,
    totalTimeMs: myProgress.totalTimeMs,
    currentStreak: myProgress.streak,
    maxStreak: myProgress.streak,
  };
}

export function useDuelRace(duelId: string) {
  const navigate = useNavigate();
  const { call } = useProtectedRequest();
  const { notifyError } = useNotification();
  const { authenticated, loading: authLoading } = useAuth();

  const [payload, setPayload] = useState<DuelRacePayload | null>(() =>
    loadRacePayload(duelId)
  );
  const [isLoading, setIsLoading] = useState(() => !loadRacePayload(duelId));
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [scoreState, setScoreState] = useState(createInitialScoreState);
  const [answer, setAnswer] = useState("");
  const [inputLockedUntil, setInputLockedUntil] = useState(0);
  const [shake, setShake] = useState(false);
  const [cardTimerMs, setCardTimerMs] = useState(0);
  const [opponents, setOpponents] = useState<OpponentRaceState[]>([]);
  const [opponentDisconnect, setOpponentDisconnect] = useState<{
    disconnectedAt: string;
    nickname: string;
  } | null>(null);
  const [socketConnected, setSocketConnected] = useState(true);
  const [forfeitDialogOpen, setForfeitDialogOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const cardStartedAtRef = useRef(Date.now());
  const fetchAttemptedRef = useRef(false);
  const mySubRef = useRef<string | undefined>(undefined);

  const { data: profileData } = useQuery({
    queryKey: [MY_PROFILE],
    queryFn: async () => call((token) => getMyProfileRequest(token)),
    enabled: authenticated,
  });

  const mySub = profileData?.profile.sub;
  mySubRef.current = mySub;

  useEffect(() => {
    if (!payload) {
      return;
    }

    setOpponents((prev) => {
      if (prev.length > 0) {
        return prev;
      }

      return payload.opponents.map((opponent) => ({
        sub: opponent.sub,
        nickname: opponent.nickname,
        avatar_url: opponent.avatar_url,
        completedCards: 0,
        score: 0,
        streak: 0,
        pulseKey: 0,
        disconnectedAt: null,
      }));
    });
  }, [payload]);

  const applyProgressUpdate = useCallback((progress: DuelRaceProgress) => {
    const currentMySub = mySubRef.current;
    if (!currentMySub) {
      return;
    }

    if (progress.userSub === currentMySub) {
      setScoreState((prev) => ({
        score: progress.score,
        correctCount: progress.correctCount,
        wrongCount: prev.wrongCount,
        totalTimeMs: progress.totalTimeMs,
        currentStreak: progress.streak,
        maxStreak: Math.max(prev.maxStreak, progress.streak),
      }));
      return;
    }

    setOpponents((prev) =>
      prev.map((opponent) => {
        if (opponent.sub !== progress.userSub) {
          return opponent;
        }

        return {
          ...opponent,
          completedCards: progressToCompletedCards(progress.cardIndex),
          score: progress.score,
          streak: progress.streak,
          pulseKey: opponent.pulseKey + 1,
        };
      })
    );
  }, []);

  const handleRejoinState = useCallback(
    (state: DuelRaceRejoinState) => {
      if (state.phase === "finished" && state.results) {
        saveRaceResults(duelId, state.results);
        navigate(ROUTES.duelResults(duelId), { replace: true });
        return;
      }

      if (state.phase === "countdown") {
        navigate(ROUTES.duelLobby(duelId), { replace: true });
        return;
      }

      if (state.phase !== "racing") {
        return;
      }

      setCardIndex(state.myIndex);
      setScoreState(applyRejoinProgress(state.myProgress));

      if (state.payload) {
        saveRacePayload(duelId, state.payload);
        setPayload(state.payload);
      }

      setOpponents(
        state.opponents.map((opponent) => ({
          sub: opponent.sub,
          nickname: opponent.nickname,
          avatar_url: opponent.avatar_url,
          completedCards: opponent.cardIndex,
          score: opponent.score,
          streak: opponent.streak,
          pulseKey: 0,
          disconnectedAt: opponent.disconnectedAt,
        }))
      );

      const disconnected = state.opponents.find((o) => o.disconnectedAt);
      if (disconnected?.disconnectedAt) {
        setOpponentDisconnect({
          disconnectedAt: disconnected.disconnectedAt,
          nickname: disconnected.nickname,
        });
      }

      cardStartedAtRef.current = Date.now();
      setIsLoading(false);
    },
    [duelId, navigate]
  );

  useEffect(() => {
    if (!duelId || !authenticated) {
      return;
    }

    joinDuelLobby(duelId).catch((error: Error) => {
      notifyError(error.message);
    });

    connectDuelSocket().then(() => {
      rejoinDuelRace({ duelId });
    }).catch(() => {});

    const unsubscribeGraded = subscribeRaceGraded((graded) => {
      if (!payload) {
        return;
      }

      if (!graded.correct) {
        setShake(true);
        setInputLockedUntil(Date.now() + payload.config.wrongAnswerLockMs);
        window.setTimeout(() => setShake(false), 400);
      }
    });

    const unsubscribeProgress = subscribeRaceProgress(applyProgressUpdate);
    const unsubscribeStarted = subscribeRaceStarted((racePayload) => {
      saveRacePayload(duelId, racePayload);
      setPayload(racePayload);
      setIsLoading(false);
    });
    const unsubscribeRejoin = subscribeRaceRejoinState(handleRejoinState);
    const unsubscribeFinished = subscribeRaceFinished((results) => {
      saveRaceResults(duelId, results);
      navigate(ROUTES.duelResults(duelId), { replace: true });
    });
    const unsubscribeLobby = subscribeDuelLobbyState((lobby) => {
      const currentMySub = mySubRef.current;
      if (!currentMySub) {
        return;
      }

      const opponent = lobby.players.find((player) => player.sub !== currentMySub);
      if (opponent?.disconnectedAt) {
        setOpponentDisconnect({
          disconnectedAt: opponent.disconnectedAt,
          nickname: opponent.nickname,
        });
        setOpponents((prev) =>
          prev.map((entry) =>
            entry.sub === opponent.sub
              ? { ...entry, disconnectedAt: opponent.disconnectedAt }
              : entry
          )
        );
      } else if (opponent) {
        setOpponentDisconnect(null);
        setOpponents((prev) =>
          prev.map((entry) =>
            entry.sub === opponent.sub ? { ...entry, disconnectedAt: null } : entry
          )
        );
      }
    });
    const unsubscribeConnection = subscribeDuelSocketConnection(setSocketConnected);
    const unsubscribeError = subscribeRaceError((message) => {
      notifyError(message);
    });

    return () => {
      unsubscribeProgress();
      unsubscribeGraded();
      unsubscribeStarted();
      unsubscribeRejoin();
      unsubscribeFinished();
      unsubscribeLobby();
      unsubscribeConnection();
      unsubscribeError();
    };
  }, [
    applyProgressUpdate,
    authenticated,
    duelId,
    handleRejoinState,
    navigate,
    notifyError,
  ]);

  useEffect(() => {
    if (payload || !authenticated || !duelId || fetchAttemptedRef.current) {
      return;
    }

    fetchAttemptedRef.current = true;

    call((token) => getDuelRacePayloadRequest(duelId, token))
      .then(({ payload: racePayload }) => {
        saveRacePayload(duelId, racePayload);
        setPayload(racePayload);
        setIsLoading(false);
      })
      .catch((error: Error) => {
        setLoadError(error);
        setIsLoading(false);
      });
  }, [authenticated, call, duelId, payload]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
      setCardTimerMs(Date.now() - cardStartedAtRef.current);
    }, 100);

    return () => window.clearInterval(interval);
  }, [cardIndex]);

  const cardCount = payload?.config.cardCount ?? 0;
  const isComplete = Boolean(payload && cardIndex >= cardCount);
  const inputLocked = now < inputLockedUntil;
  const currentCard = payload?.cards[cardIndex] ?? null;

  const submitAnswer = useCallback(() => {
    if (!payload || !answer.trim() || inputLocked || isComplete || !currentCard) {
      return;
    }

    const durationMs = Math.max(
      DUEL_MIN_ANSWER_DURATION_MS,
      Date.now() - cardStartedAtRef.current
    );

    advanceDuelRace({
      duelId,
      cardIndex,
      answer: answer.trim(),
      durationMs,
      clientTimestamp: Date.now(),
    });

    setCardIndex((index) => index + 1);
    setAnswer("");
    cardStartedAtRef.current = Date.now();
  }, [
    answer,
    cardIndex,
    currentCard,
    duelId,
    inputLocked,
    isComplete,
    payload,
  ]);

  const confirmForfeit = useCallback(() => {
    forfeitDuelRace({ duelId });
    setForfeitDialogOpen(false);
  }, [duelId]);

  const opponent = opponents[0] ?? null;

  const meTrack: OpponentTrackPlayer = useMemo(
    () => ({
      sub: mySub ?? "me",
      nickname: profileData?.profile.nickname ?? "You",
      avatar_url: profileData?.profile.avatar_url ?? null,
      progressPercent: cardCount > 0 ? (cardIndex / cardCount) * 100 : 0,
      label: "You",
    }),
    [cardCount, cardIndex, mySub, profileData?.profile]
  );

  const opponentTrack: OpponentTrackPlayer | null = useMemo(() => {
    if (!opponent) {
      return null;
    }

    return {
      sub: opponent.sub,
      nickname: opponent.nickname,
      avatar_url: opponent.avatar_url,
      progressPercent:
        cardCount > 0 ? (opponent.completedCards / cardCount) * 100 : 0,
      pulseKey: opponent.pulseKey,
    };
  }, [cardCount, opponent]);

  const disconnectBanner = useMemo(() => {
    if (!socketConnected) {
      return { selfReconnecting: true, graceRemainingMs: 0, nickname: "" };
    }

    if (opponentDisconnect) {
      const graceEndsAt =
        new Date(opponentDisconnect.disconnectedAt).getTime() +
        DUEL_DISCONNECT_GRACE_MS;
      return {
        selfReconnecting: false,
        nickname: opponentDisconnect.nickname,
        graceRemainingMs: graceEndsAt - now,
      };
    }

    return null;
  }, [now, opponentDisconnect, socketConnected]);

  return {
    payload,
    currentCard,
    cardIndex,
    cardCount,
    cardTimerMs,
    scoreState,
    answer,
    setAnswer,
    submitAnswer,
    inputLocked,
    shake,
    isComplete,
    isLoading: authLoading || isLoading,
    loadError,
    meTrack,
    opponentTrack,
    disconnectBanner,
    forfeitDialogOpen,
    setForfeitDialogOpen,
    confirmForfeit,
  };
}
