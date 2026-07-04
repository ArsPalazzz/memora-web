export const STUDY_MODES = ["write", "reveal", "match", "swipe"] as const;

export type StudyMode = (typeof STUDY_MODES)[number];

export const FEED_STUDY_MODES = ["write", "reveal"] as const;
export type FeedStudyMode = (typeof FEED_STUDY_MODES)[number];

export const DEFAULT_DESK_STUDY_MODE: StudyMode = "write";
export const DEFAULT_REVIEW_STUDY_MODE: StudyMode = "write";
export const DEFAULT_FEED_STUDY_MODE: FeedStudyMode = "write";

export const STUDY_MODE_LABELS: Record<StudyMode, string> = {
  write: "Type answer",
  reveal: "Reveal & grade",
  match: "Match pairs",
  swipe: "Swipe browse",
};

export function normalizeFeedStudyMode(mode: StudyMode | undefined | null): FeedStudyMode {
  return mode === "reveal" ? "reveal" : "write";
}
