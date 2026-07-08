import type {
  DuelRaceFinishedResults,
  DuelRaceScoreboardEntry,
} from "@/services/games/duel.types";

export type DuelResultsOutcome =
  | "win"
  | "loss"
  | "tie"
  | "forfeit_win"
  | "forfeit_loss";

export function formatRaceDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }

  return `${(ms / 1000).toFixed(1)}s`;
}

export function formatAccuracy(correct: number, wrong: number): string {
  const total = correct + wrong;
  if (total === 0) {
    return "0%";
  }

  return `${Math.round((correct / total) * 100)}%`;
}

export function averageAnswerTimeMs(entry: DuelRaceScoreboardEntry): number {
  const answered = entry.correctCount + entry.wrongCount;
  if (answered === 0) {
    return 0;
  }

  return Math.round(entry.totalTimeMs / answered);
}

export function deriveResultsOutcome(
  results: DuelRaceFinishedResults,
  mySub: string,
  cardCount: number
): DuelResultsOutcome {
  const me = results.scoreboard.find((entry) => entry.sub === mySub);
  const opponent = results.scoreboard.find((entry) => entry.sub !== mySub);

  if (!me || !opponent) {
    return me?.placement === 1 ? "win" : "loss";
  }

  if (me.placement === opponent.placement) {
    return "tie";
  }

  const myAnswered = me.correctCount + me.wrongCount;
  const opponentAnswered = opponent.correctCount + opponent.wrongCount;
  const myForfeited = myAnswered < cardCount;
  const opponentForfeited = opponentAnswered < cardCount;

  if (me.placement === 1 && opponentForfeited) {
    return "forfeit_win";
  }

  if (opponent.placement === 1 && myForfeited) {
    return "forfeit_loss";
  }

  return me.placement === 1 ? "win" : "loss";
}

export function outcomeHeadline(outcome: DuelResultsOutcome): string {
  switch (outcome) {
    case "win":
      return "Victory!";
    case "loss":
      return "Good fight!";
    case "tie":
      return "It's a tie!";
    case "forfeit_win":
      return "Opponent forfeited";
    case "forfeit_loss":
      return "You forfeited";
    default:
      return "Duel complete";
  }
}

export function outcomeSubtitle(outcome: DuelResultsOutcome): string {
  switch (outcome) {
    case "win":
      return "You took the win — nice work.";
    case "loss":
      return "Rematch and turn it around.";
    case "tie":
      return "Evenly matched — one more round?";
    case "forfeit_win":
      return "Your opponent left the race.";
    case "forfeit_loss":
      return "Your opponent wins by default.";
    default:
      return "";
  }
}
