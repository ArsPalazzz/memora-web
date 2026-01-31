import { CARD_ORIENTATION } from "../desk/desk.const";

export interface SignUpParams {
  email: string;
  password: string;
}

export interface SignUpResponse {
  sub: string;
  nickname: string;
  email: string;
  role: "registered";
  password: string;
}

export interface GetMyProfileResponse {
  profile: {
    sub: string;
    nickname: string;
    email: string;
    created_at: string;
  };
  settings: {
    card_orientation: CARD_ORIENTATION;
    reviewSettings: {
      cards_per_session: number;
    };
  };
}

export interface GetUserDailyResponse {
  currentStreak: number;
  dailyGoal: number;
  cardsReviewed: number;
}
