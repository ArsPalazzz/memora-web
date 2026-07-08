import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useProtectedRequest } from "@/utils/protected";
import {
  addDuelWrongCardsToInboxRequest,
  createDuelRequest,
  getDuelHeadToHeadStatsRequest,
  getDuelRequest,
  getDuelResultsRequest,
} from "@/services/games/duel";
import type {
  DuelRaceFinishedResults,
  DuelRaceScoreboardEntry,
  DuelResponse,
} from "@/services/games/duel.types";
import { loadRaceResults, saveRaceResults } from "@/lib/duelRaceCache";
import { ROUTES } from "@/routes/paths";
import { useAuth } from "@/utils/auth";
import { getMyProfileRequest } from "@/services/user/user";
import { DUEL_HISTORY, MY_PROFILE } from "@/routes/react-query";
import { useNotification } from "@/context/NotificationContext";
import {
  deriveResultsOutcome,
  type DuelResultsOutcome,
} from "@/utils/duelResults.utils";

export function useDuelResults(duelId: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { call } = useProtectedRequest();
  const { notifyError, notifySuccess } = useNotification();
  const { authenticated, loading: authLoading } = useAuth();

  const [results, setResults] = useState<DuelRaceFinishedResults | null>(() =>
    loadRaceResults(duelId)
  );

  const { data: profileData } = useQuery({
    queryKey: [MY_PROFILE],
    queryFn: async () => call((token) => getMyProfileRequest(token)),
    enabled: authenticated,
  });

  const mySub = profileData?.profile.sub;

  const {
    data: duelData,
    isLoading: isDuelLoading,
    error: duelError,
  } = useQuery({
    queryKey: ["duel", duelId],
    queryFn: async () => call((token) => getDuelRequest(duelId, token)),
    enabled: Boolean(duelId) && authenticated,
  });

  const {
    isLoading: isResultsLoading,
    error: resultsError,
  } = useQuery({
    queryKey: ["duel-results", duelId],
    queryFn: async () => {
      const response = await call((token) => getDuelResultsRequest(duelId, token));
      saveRaceResults(duelId, response.results);
      setResults(response.results);
      return response.results;
    },
    enabled: Boolean(duelId) && authenticated && !results,
  });

  const duel = duelData?.duel ?? null;
  const opponent = useMemo(() => {
    if (!duel || !mySub) {
      return null;
    }

    return duel.players.find((player) => player.sub !== mySub) ?? null;
  }, [duel, mySub]);

  const { data: headToHeadData } = useQuery({
    queryKey: ["duel-h2h", opponent?.sub],
    queryFn: async () =>
      call((token) => getDuelHeadToHeadStatsRequest(opponent!.sub, token)),
    enabled: Boolean(opponent?.sub) && authenticated,
  });

  const me = useMemo(
    () => results?.scoreboard.find((entry) => entry.sub === mySub) ?? null,
    [mySub, results]
  );

  const opponentEntry = useMemo(
    () => results?.scoreboard.find((entry) => entry.sub !== mySub) ?? null,
    [mySub, results]
  );

  const cardCount = duel?.config.cardCount ?? results?.cardByCard.length ?? 0;

  const outcome: DuelResultsOutcome | null = useMemo(() => {
    if (!results || !mySub) {
      return null;
    }

    return deriveResultsOutcome(results, mySub, cardCount);
  }, [cardCount, mySub, results]);

  const rematchMutation = useMutation({
    mutationFn: async () => {
      if (!duel || !opponent) {
        throw new Error("Cannot rematch without opponent");
      }

      return call((token) =>
        createDuelRequest(
          {
            deskSub: duel.deskSub,
            inviteFriendSub: opponent.sub,
            config: {
              cardCount: duel.config.cardCount,
              cardPick: duel.config.cardPick,
              mode: duel.config.mode,
              cardSet: duel.config.cardSet,
              countdownSec: duel.config.countdownSec,
              wrongAnswerLockMs: duel.config.wrongAnswerLockMs,
              showLiveProgress: duel.config.showLiveProgress,
            },
          },
          token
        )
      );
    },
    onSuccess: ({ duel: nextDuel }) => {
      queryClient.invalidateQueries({ queryKey: [DUEL_HISTORY] });
      notifySuccess("Rematch lobby created");
      navigate(ROUTES.duelLobby(nextDuel.id));
    },
    onError: (error: Error) => notifyError(error.message),
  });

  const addWrongCardsMutation = useMutation({
    mutationFn: async () =>
      call((token) => addDuelWrongCardsToInboxRequest(duelId, token)),
    onSuccess: ({ added, skipped }) => {
      if (added === 0) {
        notifySuccess(
          skipped > 0 ? "Wrong cards are already in your inbox" : "No wrong cards to add"
        );
        return;
      }

      notifySuccess(
        added === 1
          ? "1 card added to inbox for review"
          : `${added} cards added to inbox for review`
      );
    },
    onError: (error: Error) => notifyError(error.message),
  });

  const rematch = useCallback(() => {
    rematchMutation.mutate();
  }, [rematchMutation]);

  const addWrongCards = useCallback(() => {
    addWrongCardsMutation.mutate();
  }, [addWrongCardsMutation]);

  const isLoading =
    authLoading || isDuelLoading || (isResultsLoading && !results);

  const hasWrongCards = Boolean(me && me.wrongCount > 0);

  return {
    results,
    duel,
    me,
    opponentEntry,
    opponent,
    outcome,
    headToHead: headToHeadData?.stats ?? null,
    isLoading,
    error: (duelError ?? resultsError) as Error | null,
    hasWrongCards,
    isRematching: rematchMutation.isPending,
    isAddingWrongCards: addWrongCardsMutation.isPending,
    rematch,
    addWrongCards,
    mySub,
  };
}

export type { DuelRaceScoreboardEntry, DuelResponse };
