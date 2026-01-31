import { api, handleApiRequest } from "@/lib/axios";
import {
  AnswerResult,
  GetFeedNextCardResult,
  NextCardResponse,
  StartReviewSessionResult,
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

export async function answerCardFeedRequest(
  payload: { sessionId: string; answer: string; cardSub: string },
  token: string
): Promise<AnswerResult> {
  const { cardSub, ...rest } = payload;

  return handleApiRequest(
    api.post(`/games/answer-feed/${cardSub}`, rest, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function answerInGameSessionRequest(
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

export async function gradeCardFeedRequest(
  payload: { sessionId: string; quality: number; cardSub: string },
  token: string
): Promise<AnswerResult> {
  const { cardSub, ...rest } = payload;

  return handleApiRequest(
    api.post(`/games/grade-feed/${cardSub}`, rest, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function startReviewSessionRequest(
  payload: { batchId: string },
  token: string
): Promise<StartReviewSessionResult> {
  return handleApiRequest(
    api.post("/games/start-review-session", payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function startFeedSessionRequest(
  token: string
): Promise<StartReviewSessionResult> {
  return handleApiRequest(
    api.post(
      "/games/start-feed-session",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
  );
}

export async function getFeedNextCardRequest(
  payload: { sessionId: string },
  token: string
): Promise<GetFeedNextCardResult> {
  return handleApiRequest(
    api.get(`/games/feed-next?sessionId=${payload.sessionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function swipeCardRequest(
  payload: {
    sessionId: string;
    cardSub: string;
    action: "like" | "skip" | "answer";
  },
  token: string
): Promise<StartReviewSessionResult> {
  return handleApiRequest(
    api.post(`/games/swipe`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function shownCardRequest(
  payload: {
    sessionId: string;
    cardSub: string;
  },
  token: string
): Promise<StartReviewSessionResult> {
  return handleApiRequest(
    api.post(`/games/card-shown`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}
