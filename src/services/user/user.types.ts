import { CARD_ORIENTATION } from "../desk/desk.const";
import { StudyMode } from "@/constants/studyMode.const";

export interface SignUpParams {
  email: string;
  password: string;
  nickname: string;
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
    stats_public: boolean;
    league_notifications: boolean;
    avatar_url: string | null;
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

export interface PublicProfileDesk {
  sub: string;
  title: string;
  cardCount: number;
  totalSaves: number;
}

export interface GetPublicProfileResponse {
  nickname: string;
  memberSince: string;
  avatar_url: string | null;
  desks: PublicProfileDesk[];
  stats?: {
    currentStreak: number;
    cardsReviewedThisWeek: number;
  };
}
