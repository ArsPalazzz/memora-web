export type HomeTab = "folders" | "desks";

export const MAX_PINNED_FOLDERS = 8;

const LAST_TAB_KEY = "home.lastTab";
const PINNED_FOLDERS_KEY = "home.pinnedFolderSubs";

export type PinToggleResult = "pinned" | "unpinned" | "limit";

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

export function loadHomeLastTab(): HomeTab {
  const raw = localStorage.getItem(LAST_TAB_KEY);
  return raw === "desks" ? "desks" : "folders";
}

export function saveHomeLastTab(tab: HomeTab): void {
  localStorage.setItem(LAST_TAB_KEY, tab);
}

export function loadPinnedFolderSubs(): string[] {
  return readJsonArray(PINNED_FOLDERS_KEY);
}

export function savePinnedFolderSubs(folderSubs: string[]): void {
  localStorage.setItem(PINNED_FOLDERS_KEY, JSON.stringify(folderSubs));
}

export function isFolderPinned(
  folderSub: string,
  pinnedFolderSubs: string[]
): boolean {
  return pinnedFolderSubs.includes(folderSub);
}

export function togglePinnedFolder(
  folderSub: string,
  pinnedFolderSubs: string[]
): { next: string[]; result: PinToggleResult } {
  if (pinnedFolderSubs.includes(folderSub)) {
    return {
      next: pinnedFolderSubs.filter((sub) => sub !== folderSub),
      result: "unpinned",
    };
  }

  if (pinnedFolderSubs.length >= MAX_PINNED_FOLDERS) {
    return { next: pinnedFolderSubs, result: "limit" };
  }

  return {
    next: [...pinnedFolderSubs, folderSub],
    result: "pinned",
  };
}

export function resolvePinnedFolders(
  pinnedFolderSubs: string[],
  folders: Array<{ sub: string; title: string }>
): Array<{ sub: string; title: string }> {
  const titleBySub = new Map(folders.map((folder) => [folder.sub, folder.title]));

  return pinnedFolderSubs
    .filter((sub) => titleBySub.has(sub))
    .map((sub) => ({
      sub,
      title: titleBySub.get(sub)!,
    }));
}

export function homeTabToIndex(tab: HomeTab): number {
  return tab === "desks" ? 1 : 0;
}

export function homeIndexToTab(index: number): HomeTab {
  return index === 1 ? "desks" : "folders";
}

export function resolveInitialHomeTab(urlTab: string | null): HomeTab {
  if (urlTab === "desks" || urlTab === "folders") {
    return urlTab;
  }
  return loadHomeLastTab();
}
