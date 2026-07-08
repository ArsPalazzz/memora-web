import { LanguageCode } from "@/constants/language.const";

export type StartSessionResponse = {
  sessionId: string;
  mode?: "write" | "reveal" | "match" | "swipe";
};

export type MatchBoardCard = {
  sub: string;
  front: string[];
  backVariants: string[];
};

export type MatchBoardRightSlot = {
  slotId: number;
  text: string;
};

export type MatchCardResult = {
  cardSub: string;
  isCorrect: boolean;
};

export type MatchBoardResponse = {
  sessionId: string;
  cards: MatchBoardCard[];
  rightSlots: MatchBoardRightSlot[];
  progress: { total: number };
  submitted: boolean;
  results?: MatchCardResult[];
};

export type MatchSubmitResponse = {
  sessionId: string;
  results: MatchCardResult[];
};

export type NextCardResponse = {
  mode?: "write" | "reveal" | "match" | "swipe";
  card: {
    sub: string;
    text: string[];
    image_url?: string | null;
    promptLanguage?: LanguageCode;
    answerLanguage?: LanguageCode;
  };
  progress: {
    current: number;
    total: number;
  };
};

export type RevealResult = {
  finished: boolean;
  answerVariants: string[];
  examples: string[];
  frontVariants: string[];
};

export type AnswerResult = {
  isCorrect: boolean;
  finished: boolean;
  correctVariants: string[];
};

export type StartReviewSessionResult = {
  sessionId: string;
  mode?: "write" | "reveal" | "match" | "swipe";
};

export type GetFeedNextCardResult = {
  cards: {
    sub: string;
    text: string[];
    backVariants: string[];
    image_url?: string | null;
    deskTitle: string;
    deskSub: string;
    creatorNickname: string;
    saveCount: number;
    globalStats: {
      shown: number;
      liked: number;
      answered: number;
    };
    examples: string[];
    promptLanguage?: LanguageCode;
    answerLanguage?: LanguageCode;
  }[];
};

export type StartFeedSessionResult = {
  sessionId: string;
  mode?: "write" | "reveal" | "match" | "swipe";
  cards: GetFeedNextCardResult["cards"];
};
