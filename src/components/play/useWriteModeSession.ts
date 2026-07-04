import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProtectedRequest } from "@/utils/protected";
import { useAnswerCard, useNextCard } from "@/services/games/games.queries";
import { gradeCardRequest } from "@/services/games/games";
import { NextCardResponse } from "@/services/games/games.types";
import { FINISH_GAME_API } from "@/routes/api";
import { AnswerResult } from "./play.constants";
import {
  invalidateUserDaily,
  shouldInvalidateDailyAfterWriteAnswer,
} from "@/utils/invalidateUserDaily";

interface UseWriteModeSessionOptions {
  sessionId: string | null;
  onFinished: () => void;
  initialCard?: NextCardResponse | null;
}

export function useWriteModeSession({
  sessionId,
  onFinished,
  initialCard = null,
}: UseWriteModeSessionOptions) {
  const { call } = useProtectedRequest();
  const queryClient = useQueryClient();

  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [currentCard, setCurrentCard] = useState<NextCardResponse | null>(initialCard);
  const [cardLoading, setCardLoading] = useState(!initialCard);
  const [token, setToken] = useState<string | null>(null);

  const nextCardMutation = useNextCard();
  const answerMutation = useAnswerCard();

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

  const submitAnswer = () => {
    if (!sessionId || !answer.trim()) return;

    answerMutation.mutate(
      { sessionId, answer },
      {
        onSuccess: (res) => {
          setResult(res);
          if (shouldInvalidateDailyAfterWriteAnswer(res.isCorrect)) {
            invalidateUserDaily(queryClient);
          }
        },
      }
    );
  };

  const goToNextCard = () => {
    if (!sessionId) return;

    if (result?.finished) {
      onFinished();
      return;
    }

    setAnswer("");
    setResult(null);
    loadNextCard(sessionId);
  };

  const submitGrade = (quality: number) => {
    if (!sessionId) return;

    gradeMutation.mutate(
      { sessionId, quality },
      {
        onSuccess: () => {
          goToNextCard();
        },
      }
    );
  };

  return {
    answer,
    setAnswer,
    result,
    currentCard,
    cardLoading,
    submitAnswer,
    submitGrade,
    isAnswering: answerMutation.isPending,
    isGrading: gradeMutation.isPending,
  };
}
