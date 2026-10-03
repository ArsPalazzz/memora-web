const EXCLUDED_DESKS_KEY = "review.excludedDeskSubs";
const INCLUDE_INBOX_KEY = "review.includeInbox";

export type ReviewDeskSelection = {
  excludedDeskSubs: string[];
  includeInbox: boolean;
};

function readJsonArray(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function loadReviewDeskSelection(): ReviewDeskSelection {
  const includeInboxRaw = localStorage.getItem(INCLUDE_INBOX_KEY);
  return {
    excludedDeskSubs: readJsonArray(EXCLUDED_DESKS_KEY),
    includeInbox: includeInboxRaw === null ? true : includeInboxRaw === "true",
  };
}

export function saveReviewDeskSelection(selection: ReviewDeskSelection): void {
  localStorage.setItem(
    EXCLUDED_DESKS_KEY,
    JSON.stringify(selection.excludedDeskSubs)
  );
  localStorage.setItem(INCLUDE_INBOX_KEY, String(selection.includeInbox));
}

export function isDeskIncluded(
  deskSub: string,
  excludedDeskSubs: string[]
): boolean {
  return !excludedDeskSubs.includes(deskSub);
}

export function getSelectedDeskSubs(
  desks: Array<{ deskSub: string }>,
  excludedDeskSubs: string[]
): string[] {
  return desks
    .filter((desk) => isDeskIncluded(desk.deskSub, excludedDeskSubs))
    .map((desk) => desk.deskSub);
}

export function getSelectedDueCount(
  desks: Array<{ deskSub: string; dueCount: number }>,
  excludedDeskSubs: string[]
): number {
  return desks.reduce((sum, desk) => {
    if (!isDeskIncluded(desk.deskSub, excludedDeskSubs)) {
      return sum;
    }
    return sum + desk.dueCount;
  }, 0);
}
