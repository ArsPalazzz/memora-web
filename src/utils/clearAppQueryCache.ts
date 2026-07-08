import type { QueryClient } from "@tanstack/react-query";

export const QUERY_CACHE_STORAGE_KEY = "memora-query-cache";

let appQueryClient: QueryClient | null = null;

export function registerAppQueryClient(client: QueryClient): void {
  appQueryClient = client;
}

export function clearAppQueryCache(): void {
  appQueryClient?.clear();

  if (typeof window !== "undefined") {
    localStorage.removeItem(QUERY_CACHE_STORAGE_KEY);
  }
}
