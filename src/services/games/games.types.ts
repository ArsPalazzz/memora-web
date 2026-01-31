export type StartSessionResponse = {
  sessionId: string;
};

export type NextCardResponse = {
  card: {
    sub: string;
    text: string[];
  };
  progress: {
    current: number;
    total: number;
  };
};

export type AnswerResult = {
  isCorrect: boolean;
  finished: boolean;
  correctVariants: string[];
};

export type StartReviewSessionResult = {
  sessionId: string;
};

export type GetFeedNextCardResult = {
  cards: {
    sub: string;
    text: string[];
    backVariants: string[];
    imageUuid: string;
    deskTitle: string;
    deskSub: string;
    globalStats: {
      shown: number;
      liked: number;
      answered: number;
    };
    examples: string[];
  }[];
};
