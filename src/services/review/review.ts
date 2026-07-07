import { api, handleApiRequest } from "@/lib/axios";
import {
  ADD_TO_INBOX_API,
  GET_INBOX_SUMMARY_API,
  GET_REVIEW_SUMMARY_API,
  START_REVIEW_API,
} from "@/routes/api";
import {
  GetInboxSummaryResponse,
  GetReviewSummaryResponse,
  StartReviewResponse,
} from "./review.types";

export async function getReviewSummaryRequest(
  token: string
): Promise<GetReviewSummaryResponse> {
  return handleApiRequest(
    api.get(GET_REVIEW_SUMMARY_API, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function startReviewRequest(
  token: string
): Promise<StartReviewResponse> {
  return handleApiRequest(
    api.post(START_REVIEW_API, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function getInboxSummaryRequest(
  token: string
): Promise<GetInboxSummaryResponse> {
  return handleApiRequest(
    api.get(GET_INBOX_SUMMARY_API, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function addCardToInboxRequest(
  token: string,
  cardSub: string
): Promise<void> {
  await handleApiRequest(
    api.post(
      ADD_TO_INBOX_API,
      { cardSub },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
  );
}
