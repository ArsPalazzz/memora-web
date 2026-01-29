import { refreshRequest } from "@/services/auth/auth";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routes/next";

export function useProtectedRequest() {
  const { setAccessToken, accessToken } = useAuthContext();
  const router = useRouter();

  const call = async <T>(
    requestFn: (token: string) => Promise<T>,
    requiresAuth = true
  ): Promise<T> => {
    if (requiresAuth && !accessToken) {
      try {
        const { accessToken: newToken } = await refreshRequest();
        setAccessToken(newToken);
        return await requestFn(newToken);
      } catch (error) {
        setAccessToken(null);
        router.replace(ROUTES.LOGIN);
        return Promise.reject(error);
      }
    }

    try {
      return await requestFn(accessToken!);
    } catch (err: unknown) {
      const message = (err as Error).message;

      if (!requiresAuth) return Promise.reject(err);

      const isAuthError = message === "Authentication required";
      const isExpired = message.includes("TokenExpiredError");
      const noRefresh = message === "No refresh token";

      if (isAuthError) {
        try {
          const { accessToken: newToken } = await refreshRequest();
          setAccessToken(newToken);
          return await requestFn(newToken);
        } catch {
          setAccessToken(null);
          router.replace(ROUTES.LOGIN);
          return Promise.resolve([] as unknown as T);
        }
      }

      if (isExpired) {
        setAccessToken(null);
        router.replace(ROUTES.LOGIN);
        return Promise.resolve([] as unknown as T);
      }

      if (noRefresh) {
        return Promise.resolve([] as unknown as T);
      }

      return Promise.reject(err);
    }
  };

  return { call };
}
