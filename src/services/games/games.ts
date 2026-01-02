import { api, handleApiRequest } from "@/lib/axios";
import {
  AnswerResult,
  NextCardResponse,
  StartSessionResponse,
} from "./games.types";

export async function startDeskSessionRequest(
  deskSub: string,
  token: string
): Promise<StartSessionResponse> {
  return handleApiRequest(
    api.post(
      "/games/start-desk-session",
      { deskSub },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
  );
}

export async function getNextCardRequest(
  sessionId: string,
  token: string
): Promise<NextCardResponse> {
  return handleApiRequest(
    api.get("/games/next-card", {
      params: { sessionId },
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function answerCardRequest(
  payload: { sessionId: string; answer: string },
  token: string
): Promise<AnswerResult> {
  return handleApiRequest(
    api.post("/games/answer", payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function gradeCardRequest(
  payload: { sessionId: string; quality: number },
  token: string
): Promise<AnswerResult> {
  return handleApiRequest(
    api.post("/games/grade", payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}
