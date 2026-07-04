import { CARD_ORIENTATION } from "../desk/desk.const";
import { StudyMode } from "@/constants/studyMode.const";

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
    study_mode: StudyMode;
    reviewSettings: {
      cards_per_session: number;
      study_mode: StudyMode;
    };
  };
}

export interface GetUserDailyResponse {
  currentStreak: number;
  dailyGoal: number;
  cardsReviewed: number;
}
