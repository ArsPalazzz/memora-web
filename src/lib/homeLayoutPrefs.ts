export type HomeTab = "folders" | "desks";

const LAST_TAB_KEY = "home.lastTab";

export function loadHomeLastTab(): HomeTab {
  const raw = localStorage.getItem(LAST_TAB_KEY);
  return raw === "desks" ? "desks" : "folders";
}

export function saveHomeLastTab(tab: HomeTab): void {
  localStorage.setItem(LAST_TAB_KEY, tab);
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
