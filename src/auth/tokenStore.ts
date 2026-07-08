import { refreshRequest } from "@/services/auth/auth";

const TOKEN_KEY = "access_token";

let accessToken: string | null =
  typeof window !== "undefined" ? sessionStorage.getItem(TOKEN_KEY) : null;

let refreshPromise: Promise<string> | null = null;
let onUnauthorized: (() => void) | null = null;
const listeners = new Set<(token: string | null) => void>();

function notifyListeners(token: string | null): void {
  listeners.forEach((listener) => listener(token));
}

export function subscribeAccessToken(
  listener: (token: string | null) => void
): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;

  if (typeof window === "undefined") return;

  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
  }

  notifyListeners(token);
}

export function setOnUnauthorized(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

export function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = refreshRequest()
    .then(({ accessToken: token }) => {
      setAccessToken(token);
      return token;
    })
    .catch((error) => {
      setAccessToken(null);
      onUnauthorized?.();
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export function isAuthRequestUrl(url?: string): boolean {
  if (!url) return false;

  return (
    url.includes("/auth/refresh") ||
    url.includes("/auth/sign-in") ||
    url.includes("/auth/login")
  );
}
