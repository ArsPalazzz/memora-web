export interface ReviewSummaryDesk {
  deskSub: string;
  title: string;
  dueCount: number;
}

export interface GetReviewSummaryResponse {
  totalDueCount: number;
  desks: ReviewSummaryDesk[];
}

export interface StartReviewResponse {
  batchId: string;
  cardCount: number;
  dueCount: number;
  inboxCount: number;
}

export interface GetInboxSummaryResponse {
  count: number;
  deskSub: string;
}
