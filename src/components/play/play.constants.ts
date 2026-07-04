export const GRADE_COLORS: Record<number, string> = {
  0: "#e53935",
  1: "#fb8c00",
  2: "#fbc02d",
  3: "#43a047",
  4: "#2e7d32",
};

export const GRADE_OPTIONS = [
  { quality: 0, label: "Forgot" },
  { quality: 1, label: "Hard" },
  { quality: 2, label: "Okay" },
  { quality: 3, label: "Good" },
  { quality: 4, label: "Easy" },
] as const;

export type AnswerResult = {
  isCorrect: boolean;
  finished: boolean;
  correctVariants: string[];
};
