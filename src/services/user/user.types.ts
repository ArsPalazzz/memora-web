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
  sub: string;
  nickname: string;
  email: string;
  created_at: string;
}

export interface GetUserDailyResponse {
  currentStreak: number;
  dailyGoal: number;
  cardsReviewed: number;
}
