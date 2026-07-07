import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProtectedRequest } from "@/utils/protected";
import { useNextCard, useRevealCard } from "@/services/games/games.queries";
import { gradeCardRequest } from "@/services/games/games";
import { NextCardResponse, RevealResult } from "@/services/games/games.types";
import { FINISH_GAME_API } from "@/routes/api";
import {
  invalidateAfterStudySession,
  shouldInvalidateDailyAfterGrade,
} from "@/utils/invalidateUserDaily";

interface UseRevealModeSessionOptions {
  sessionId: string | null;
  onFinished: () => void;
  initialCard?: NextCardResponse | null;
}

export function useRevealModeSession({
  sessionId,
  onFinished,
  initialCard = null,
}: UseRevealModeSessionOptions) {
  const { call } = useProtectedRequest();
  const queryClient = useQueryClient();

  const [result, setResult] = useState<RevealResult | null>(null);
  const [currentCard, setCurrentCard] = useState<NextCardResponse | null>(initialCard);
  const [cardLoading, setCardLoading] = useState(!initialCard);
  const [token, setToken] = useState<string | null>(null);

  const nextCardMutation = useNextCard();
  const revealMutation = useRevealCard();

  const gradeMutation = useMutation({
    mutationFn: ({ sessionId, quality }: { sessionId: string; quality: number }) =>
      call((token) => gradeCardRequest({ sessionId, quality }, token)),
  });

  const loadNextCard = (activeSessionId: string) => {
    setCardLoading(true);
    nextCardMutation.mutate(activeSessionId, {
      onSuccess: (res) => {
        setCurrentCard(res);
        setCardLoading(false);
      },
      onError: () => {
        setCardLoading(false);
      },
    });
  };

  useEffect(() => {
    if (!sessionId || initialCard) return;
    loadNextCard(sessionId);
  }, [sessionId, initialCard]);

  useEffect(() => {
    call((accessToken) => {
      setToken(accessToken);
      return Promise.resolve();
    });
  }, [call]);

  const finishCleanupRef = useRef({ sessionId, result, token });
  finishCleanupRef.current = { sessionId, result, token };

  useEffect(() => {
    return () => {
      const { sessionId: activeSessionId, result: activeResult, token: accessToken } =
        finishCleanupRef.current;

      if (!activeSessionId || activeResult?.finished || !accessToken) return;

      invalidateAfterStudySession(queryClient);

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

  const revealAnswer = () => {
    if (!sessionId) return;

    revealMutation.mutate(sessionId, {
      onSuccess: (res) => {
        setResult(res);
      },
    });
  };

  const goToNextCard = () => {
    if (!sessionId) return;

    if (result?.finished) {
      onFinished();
      return;
    }

    setCardLoading(true);
    setResult(null);
    nextCardMutation.mutate(sessionId, {
      onSuccess: (res) => {
        setCurrentCard(res);
        setCardLoading(false);
      },
      onError: () => {
        setCardLoading(false);
      },
    });
  };

  const submitGrade = (quality: number) => {
    if (!sessionId) return;

    gradeMutation.mutate(
      { sessionId, quality },
      {
        onSuccess: () => {
          if (shouldInvalidateDailyAfterGrade(quality, "reveal")) {
            invalidateAfterStudySession(queryClient);
          }
          goToNextCard();
        },
      }
    );
  };

  return {
    result,
    currentCard,
    cardLoading,
    revealAnswer,
    submitGrade,
    isRevealing: revealMutation.isPending,
    isGrading: gradeMutation.isPending,
  };
}
