import { QueryClient } from "@tanstack/react-query";
import { USER_DAILY, USER_DESKS, USER_INBOX_SUMMARY, USER_REVIEW_SUMMARY } from "@/routes/react-query";

export function invalidateUserDaily(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: [USER_DAILY] });
}

/** Due / inbox / desk lists — always refresh after any SRS update. */
export function invalidateReviewCaches(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: [USER_REVIEW_SUMMARY] });
  void queryClient.invalidateQueries({ queryKey: [USER_INBOX_SUMMARY] });
  void queryClient.invalidateQueries({ queryKey: [USER_DESKS] });
}

export function invalidateAfterStudySession(queryClient: QueryClient) {
  invalidateUserDaily(queryClient);
  invalidateReviewCaches(queryClient);
}

/** Daily progress only counts Good/Easy (quality >= 3), matching server recordDailyProgress. */
export function shouldInvalidateDailyAfterGrade(quality: number, _mode: "reveal" | "match") {
  return quality >= 3;
}

export function shouldInvalidateDailyAfterWriteAnswer(isCorrect: boolean) {
  return isCorrect;
}
