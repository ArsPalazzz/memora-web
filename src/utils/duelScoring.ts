export const DUEL_CORRECT_BASE_POINTS = 100;
export const DUEL_CORRECT_MIN_POINTS = 40;
export const DUEL_MAX_TIME_PENALTY = 60;
export const DUEL_STREAK_BONUS_THRESHOLD = 3;
export const DUEL_STREAK_MULTIPLIER = 1.1;
export const DUEL_MIN_ANSWER_DURATION_MS = 200;

export function calculateTimePenalty(durationMs: number): number {
  return Math.min(DUEL_MAX_TIME_PENALTY, Math.floor(durationMs / 500) * 5);
}

export function calculateCorrectPoints(
  durationMs: number,
  streakAfterAnswer: number
): number {
  const base = Math.max(
    DUEL_CORRECT_MIN_POINTS,
    DUEL_CORRECT_BASE_POINTS - calculateTimePenalty(durationMs)
  );

  if (streakAfterAnswer >= DUEL_STREAK_BONUS_THRESHOLD) {
    return Math.floor(base * DUEL_STREAK_MULTIPLIER);
  }

  return base;
}

export interface DuelScoreState {
  score: number;
  correctCount: number;
  wrongCount: number;
  totalTimeMs: number;
  currentStreak: number;
  maxStreak: number;
}

export function createInitialScoreState(): DuelScoreState {
  return {
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    totalTimeMs: 0,
    currentStreak: 0,
    maxStreak: 0,
  };
}

export function applyAnswerToScoreState(
  state: DuelScoreState,
  params: { correct: boolean; durationMs: number }
): DuelScoreState {
  const totalTimeMs = state.totalTimeMs + Math.max(0, params.durationMs);

  if (!params.correct) {
    return {
      ...state,
      wrongCount: state.wrongCount + 1,
      totalTimeMs,
      currentStreak: 0,
    };
  }

  const currentStreak = state.currentStreak + 1;
  const points = calculateCorrectPoints(params.durationMs, currentStreak);

  return {
    score: state.score + points,
    correctCount: state.correctCount + 1,
    wrongCount: state.wrongCount,
    totalTimeMs,
    currentStreak,
    maxStreak: Math.max(state.maxStreak, currentStreak),
  };
}

export function scoreStateFromProgress(progress: {
  score: number;
  correctCount: number;
  streak: number;
  totalTimeMs: number;
}): DuelScoreState {
  return {
    score: progress.score,
    correctCount: progress.correctCount,
    wrongCount: 0,
    totalTimeMs: progress.totalTimeMs,
    currentStreak: progress.streak,
    maxStreak: progress.streak,
  };
}
