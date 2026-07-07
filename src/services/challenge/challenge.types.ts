export interface ChallengeLeaderboardEntry {
  rank: number;
  nickname: string;
  isMe: boolean;
  cardsReviewed: number;
  localDeskSub: string;
}

export interface CurrentChallengeResponse {
  weekStart: string;
  weekEnd: string;
  desk: {
    sub: string;
    title: string;
    creatorNickname: string;
  };
  leaderboard: ChallengeLeaderboardEntry[];
  leaderNickname: string | null;
}
