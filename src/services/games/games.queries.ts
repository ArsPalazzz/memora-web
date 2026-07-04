import { useProtectedRequest } from "@/utils/protected";
import { useMutation } from "@tanstack/react-query";
import { answerCardRequest, getMatchBoardRequest, getNextCardRequest, revealCardRequest, submitMatchRequest } from "./games";

export function useNextCard() {
  const { call } = useProtectedRequest();

  return useMutation({
    mutationFn: (sessionId: string) =>
      call((token) => getNextCardRequest(sessionId, token)),
  });
}

export function useRevealCard() {
  const { call } = useProtectedRequest();

  return useMutation({
    mutationFn: (sessionId: string) =>
      call((token) => revealCardRequest(sessionId, token)),
  });
}

export function useMatchBoard() {
  const { call } = useProtectedRequest();

  return useMutation({
    mutationFn: (sessionId: string) =>
      call((token) => getMatchBoardRequest(sessionId, token)),
  });
}

export function useSubmitMatch() {
  const { call } = useProtectedRequest();

  return useMutation({
    mutationFn: (payload: {
      sessionId: string;
      pairs: { leftCardSub: string; rightSlotId: number }[];
    }) => call((token) => submitMatchRequest(payload, token)),
  });
}

export function useAnswerCard() {
  const { call } = useProtectedRequest();

  return useMutation({
    mutationFn: (payload: { sessionId: string; answer: string }) =>
      call((token) => answerCardRequest(payload, token)),
  });
}
