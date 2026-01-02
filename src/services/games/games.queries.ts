import { useProtectedRequest } from "@/utils/protected";
import { useMutation } from "@tanstack/react-query";
import { answerCardRequest, getNextCardRequest } from "./games";

export function useNextCard() {
  const { call } = useProtectedRequest();

  return useMutation({
    mutationFn: (sessionId: string) =>
      call((token) => getNextCardRequest(sessionId, token)),
  });
}

export function useAnswerCard() {
  const { call } = useProtectedRequest();

  return useMutation({
    mutationFn: (payload: { sessionId: string; answer: string }) =>
      call((token) => answerCardRequest(payload, token)),
  });
}
