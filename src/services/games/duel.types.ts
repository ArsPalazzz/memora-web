export type DuelStatus = 'waiting' | 'countdown' | 'racing' | 'finished' | 'cancelled';

export type DuelCardPick = 'random' | 'newest';
export type DuelCardSet = 'mirror';
export type DuelMode = 'write';

export interface DuelConfig {
  deskSub: string;
  cardCount: 5 | 10 | 15 | 20;
  mode: DuelMode;
  cardSet: DuelCardSet;
  cardPick: DuelCardPick;
  countdownSec: number;
  wrongAnswerLockMs: number;
  showLiveProgress: boolean;
}

export interface DuelPlayerResponse {
  sub: string;
  slot: number;
  ready: boolean;
  score: number;
  correctCount: number;
  wrongCount: number;
  totalTimeMs: number;
  maxStreak: number;
  placement: number | null;
  disconnectedAt: string | null;
  joinedAt: string;
  nickname: string;
  avatar_url: string | null;
}

export interface DuelResponse {
  id: string;
  code: string;
  hostSub: string;
  deskSub: string;
  deskTitle: string;
  config: DuelConfig;
  cardSeed: number | null;
  cardSubs: string[];
  status: DuelStatus;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  players: DuelPlayerResponse[];
}

export interface DuelRacePayload {
  duelId: string;
  startedAt: number;
  config: DuelConfig;
  opponents: Array<{
    sub: string;
    nickname: string;
    avatar_url: string | null;
  }>;
  cards: Array<{
    index: number;
    sub: string;
    text: string[];
    backVariants?: string[];
    image_url: string | null;
    promptLanguage: string;
    answerLanguage: string;
  }>;
}

export interface DuelLobbyErrorPayload {
  message: string;
}

export interface DuelJoinPayload {
  duelId: string;
}

export interface DuelReadyPayload {
  duelId: string;
  ready: boolean;
}

export interface DuelUpdateConfigPayload {
  duelId: string;
  config: Partial<DuelConfig>;
}

export interface DuelStartPayload {
  duelId: string;
}

export interface DuelRaceFinishedResults {
  scoreboard: DuelRaceScoreboardEntry[];
  cardByCard: DuelRaceCardComparison[];
}

export interface DuelRaceScoreboardEntry {
  sub: string;
  nickname: string;
  avatar_url: string | null;
  placement: number;
  score: number;
  correctCount: number;
  wrongCount: number;
  totalTimeMs: number;
  maxStreak: number;
}

export interface DuelRaceCardComparison {
  cardIndex: number;
  cardSub: string;
  prompt: string[];
  players: Record<
    string,
    {
      answer: string;
      correct: boolean;
      durationMs: number;
    }
  >;
}

export interface DuelHeadToHeadStats {
  wins: number;
  losses: number;
  totalDuels: number;
}

export type DuelHistoryOutcome =
  | 'win'
  | 'loss'
  | 'tie'
  | 'forfeit_win'
  | 'forfeit_loss';

export interface DuelHistoryEntry {
  id: string;
  deskSub: string;
  deskTitle: string;
  finishedAt: string;
  cardCount: number;
  myPlacement: number;
  myScore: number;
  opponent: {
    sub: string;
    nickname: string;
    avatar_url: string | null;
    placement: number;
    score: number;
  } | null;
  outcome: DuelHistoryOutcome;
}

export interface DuelRaceProgress {
  userSub: string;
  cardIndex: number;
  score: number;
  correctCount: number;
  streak: number;
  totalTimeMs: number;
}

export interface DuelRaceOpponentProgress {
  sub: string;
  nickname: string;
  avatar_url: string | null;
  cardIndex: number;
  score: number;
  correctCount: number;
  wrongCount: number;
  streak: number;
  totalTimeMs: number;
  disconnectedAt: string | null;
}

export interface DuelRaceRejoinState {
  phase: 'countdown' | 'racing' | 'finished';
  duelId: string;
  myIndex: number;
  cardCount: number;
  myProgress: {
    score: number;
    correctCount: number;
    wrongCount: number;
    streak: number;
    totalTimeMs: number;
  };
  opponents: DuelRaceOpponentProgress[];
  payload?: DuelRacePayload;
  results?: DuelRaceFinishedResults;
}

export interface DuelRaceAdvancePayload {
  duelId: string;
  cardIndex: number;
  answer: string;
  durationMs: number;
  clientTimestamp?: number;
}

export interface DuelRaceForfeitPayload {
  duelId: string;
}

export interface DuelRaceRejoinPayload {
  duelId: string;
}

export interface DuelLeavePayload {
  duelId: string;
}

export interface DuelRaceGradedPayload {
  cardIndex: number;
  correct: boolean;
}

export interface DuelClientToServerEvents {
  'lobby:join': (payload: DuelJoinPayload) => void;
  'lobby:leave': (payload: DuelLeavePayload) => void;
  'lobby:ready': (payload: DuelReadyPayload) => void;
  'lobby:update-config': (payload: DuelUpdateConfigPayload) => void;
  'lobby:start': (payload: DuelStartPayload) => void;
  'race:advance': (payload: DuelRaceAdvancePayload) => void;
  'race:forfeit': (payload: DuelRaceForfeitPayload) => void;
  'race:rejoin': (payload: DuelRaceRejoinPayload) => void;
}

export interface DuelServerToClientEvents {
  'lobby:state': (state: DuelResponse) => void;
  'lobby:error': (payload: DuelLobbyErrorPayload) => void;
  'race:started': (payload: DuelRacePayload) => void;
  'race:progress': (payload: DuelRaceProgress) => void;
  'race:graded': (payload: DuelRaceGradedPayload) => void;
  'race:finished': (payload: { results: DuelRaceFinishedResults }) => void;
  'race:rejoin-state': (payload: DuelRaceRejoinState) => void;
  'race:error': (payload: DuelLobbyErrorPayload) => void;
}
