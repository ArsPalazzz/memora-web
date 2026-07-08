import { useCallback } from "react";
import { getAccessToken, refreshAccessToken } from "@/auth/tokenStore";

export function useProtectedRequest() {
  const call = useCallback(
    async <T>(
      requestFn: (token: string) => Promise<T>,
      requiresAuth = true
    ): Promise<T> => {
      if (!requiresAuth) {
        return requestFn("");
      }

      let token = getAccessToken();

      if (!token) {
        token = await refreshAccessToken();
      }

      return requestFn(token);
    },
    []
  );

  return { call };
}
