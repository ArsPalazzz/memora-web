import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProtectedRequest } from "@/utils/protected";
import { useMatchBoard, useSubmitMatch } from "@/services/games/games.queries";
import { gradeCardRequest } from "@/services/games/games";
import {
  MatchBoardResponse,
  MatchCardResult,
} from "@/services/games/games.types";
import { FINISH_GAME_API } from "@/routes/api";
import {
  invalidateUserDaily,
  shouldInvalidateDailyAfterGrade,
} from "@/utils/invalidateUserDaily";

export type MatchPhase = "matching" | "results" | "grading";

interface UseMatchModeSessionOptions {
  sessionId: string | null;
  onFinished: () => void;
  initialBoard?: MatchBoardResponse | null;
}

export function useMatchModeSession({
  sessionId,
  onFinished,
  initialBoard = null,
}: UseMatchModeSessionOptions) {
  const { call } = useProtectedRequest();
  const queryClient = useQueryClient();

  const [board, setBoard] = useState<MatchBoardResponse | null>(initialBoard);
  const [boardLoading, setBoardLoading] = useState(!initialBoard);
  const [boardError, setBoardError] = useState(false);
  const [boardEmpty, setBoardEmpty] = useState(false);
  const [phase, setPhase] = useState<MatchPhase>(
    initialBoard?.submitted ? "results" : "matching"
  );
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [pairs, setPairs] = useState<Record<string, number>>({});
  const [submitResults, setSubmitResults] = useState<MatchCardResult[] | null>(
    initialBoard?.submitted ? initialBoard.results ?? null : null
  );
  const [gradingIndex, setGradingIndex] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const [recentMatch, setRecentMatch] = useState<string | null>(null);

  const boardMutation = useMatchBoard();
  const submitMutation = useSubmitMatch();

  const gradeMutation = useMutation({
    mutationFn: ({
      sessionId,
      quality,
      cardSub,
    }: {
      sessionId: string;
      quality: number;
      cardSub: string;
    }) => call((token) => gradeCardRequest({ sessionId, quality, cardSub }, token)),
  });

  const loadBoard = (activeSessionId: string) => {
    setBoardLoading(true);
    setBoardError(false);
    setBoardEmpty(false);
    boardMutation.mutate(activeSessionId, {
      onSuccess: (res) => {
        if (res.progress.total === 0 || res.cards.length === 0) {
          setBoardEmpty(true);
          setBoard(null);
          setBoardLoading(false);
          return;
        }

        setBoard(res);
        setBoardLoading(false);
        if (res.submitted) {
          setSubmitResults(res.results ?? null);
          setPhase("results");
        }
      },
      onError: () => {
        setBoardLoading(false);
        setBoardError(true);
      },
    });
  };

  useEffect(() => {
    if (!initialBoard) return;
    if (initialBoard.progress.total === 0 || initialBoard.cards.length === 0) {
      setBoardEmpty(true);
      setBoard(null);
      setBoardLoading(false);
    }
  }, [initialBoard]);

  useEffect(() => {
    if (!sessionId || initialBoard) return;
    loadBoard(sessionId);
  }, [sessionId, initialBoard]);

  useEffect(() => {
    call((accessToken) => {
      setToken(accessToken);
      return Promise.resolve();
    });
  }, [call]);

  const finishCleanupRef = useRef({ sessionId, phase, token });
  finishCleanupRef.current = { sessionId, phase, token };

  useEffect(() => {
    return () => {
      const { sessionId: activeSessionId, phase: activePhase, token: accessToken } =
        finishCleanupRef.current;

      if (!activeSessionId || activePhase === "grading" || !accessToken) return;

      invalidateUserDaily(queryClient);

      fetch(`/api${FINISH_GAME_API}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ sessionId: activeSessionId }),
        credentials: "include",
        keepalive: true,
      });
    };
  }, [queryClient]);

  const matchedLeftSubs = new Set(Object.keys(pairs));
  const matchedSlotIds = new Set(Object.values(pairs));
  const totalCards = board?.progress.total ?? 0;
  const allPaired = totalCards > 0 && matchedLeftSubs.size === totalCards;

  const selectLeft = (cardSub: string) => {
    if (matchedLeftSubs.has(cardSub)) {
      unmatchPair(cardSub);
      return;
    }
    setSelectedLeft((prev) => (prev === cardSub ? null : cardSub));
  };

  const selectRight = (slotId: number) => {
    if (matchedSlotIds.has(slotId)) {
      unmatchBySlot(slotId);
      return;
    }
    if (!selectedLeft) return;

    const leftSub = selectedLeft;
    setPairs((prev) => ({ ...prev, [leftSub]: slotId }));
    setSelectedLeft(null);
    setRecentMatch(leftSub);
    window.setTimeout(() => setRecentMatch(null), 400);
  };

  const unmatchPair = (leftCardSub: string) => {
    setPairs((prev) => {
      if (!(leftCardSub in prev)) return prev;
      const next = { ...prev };
      delete next[leftCardSub];
      return next;
    });
    setSelectedLeft((prev) => (prev === leftCardSub ? null : prev));
  };

  const unmatchBySlot = (slotId: number) => {
    const leftSub = Object.entries(pairs).find(([, id]) => id === slotId)?.[0];
    if (leftSub) unmatchPair(leftSub);
  };

  const submitPairs = () => {
    if (!sessionId || !allPaired) return;

    const payload = {
      sessionId,
      pairs: Object.entries(pairs).map(([leftCardSub, rightSlotId]) => ({
        leftCardSub,
        rightSlotId,
      })),
    };

    submitMutation.mutate(payload, {
      onSuccess: (res) => {
        setSubmitResults(res.results);
        setPhase("results");
      },
    });
  };

  const startGrading = () => {
    setGradingIndex(0);
    setPhase("grading");
  };

  const submitGrade = (quality: number) => {
    if (!sessionId || !board) return;

    const card = board.cards[gradingIndex];
    if (!card) return;

    gradeMutation.mutate(
      { sessionId, quality, cardSub: card.sub },
      {
        onSuccess: () => {
          if (shouldInvalidateDailyAfterGrade(quality, "match")) {
            invalidateUserDaily(queryClient);
          }

          const nextIndex = gradingIndex + 1;
          if (nextIndex >= board.cards.length) {
            onFinished();
            return;
          }
          setGradingIndex(nextIndex);
        },
      }
    );
  };

  const resultByCard = new Map(submitResults?.map((r) => [r.cardSub, r.isCorrect]) ?? []);
  const correctCount =
    submitResults?.filter((r) => r.isCorrect).length ?? 0;

  const reloadBoard = () => {
    if (!sessionId) return;
    loadBoard(sessionId);
  };

  return {
    board,
    boardLoading,
    boardError,
    boardEmpty,
    phase,
    selectedLeft,
    pairs,
    matchedLeftSubs,
    matchedSlotIds,
    allPaired,
    recentMatch,
    submitResults,
    resultByCard,
    correctCount,
    gradingIndex,
    selectLeft,
    selectRight,
    unmatchPair,
    submitPairs,
    startGrading,
    submitGrade,
    reloadBoard,
    isSubmitting: submitMutation.isPending,
    isGrading: gradeMutation.isPending,
  };
}
