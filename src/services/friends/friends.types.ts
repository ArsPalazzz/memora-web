export type FriendshipStatus = "none" | "pending" | "accepted";
export type FriendshipDirection = "outgoing" | "incoming" | null;

export interface FriendSummary {
  sub: string;
  nickname: string;
  avatar_url: string | null;
}

export interface FriendshipRelationship {
  sub: string;
  nickname: string;
  status: FriendshipStatus;
  direction: FriendshipDirection;
}

export interface SendFriendRequestResponse {
  nickname: string;
  sub: string;
  status: "pending";
}

export interface FriendActivity {
  nickname: string;
  avatar_url: string | null;
  cardsReviewedToday: number;
  dailyGoal: number;
  goalAchieved: boolean;
  currentStreak: number;
}

export interface LeagueParticipant {
  rank: number;
  nickname: string;
  isMe: boolean;
  avatar_url: string | null;
  score: number;
  cardsReviewed: number;
  goalsHit: number;
}

export interface WeeklyLeagueResponse {
  weekStart: string;
  weekEnd: string;
  participants: LeagueParticipant[];
  myRank: number | null;
  totalParticipants: number;
}
