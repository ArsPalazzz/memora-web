import { QueryClient } from "@tanstack/react-query";
import { USER_DAILY } from "@/routes/react-query";

export function invalidateUserDaily(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: [USER_DAILY] });
}

export function shouldInvalidateDailyAfterGrade(quality: number, mode: "reveal" | "match") {
  return quality >= 3;
}

export function shouldInvalidateDailyAfterWriteAnswer(isCorrect: boolean) {
  return isCorrect;
}
