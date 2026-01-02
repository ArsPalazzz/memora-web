export type StartSessionResponse = {
  sessionId: string;
};

export type NextCardResponse = {
  sub: string;
  text: string[];
};

export type AnswerResult = {
  isCorrect: boolean;
  finished: boolean;
  correctVariants: string[];
};
