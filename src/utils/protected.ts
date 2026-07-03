import { refreshRequest } from "@/services/auth/auth";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/paths";

export function useProtectedRequest() {
  const { setAccessToken, accessToken } = useAuthContext();
  const navigate = useNavigate();

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
        navigate(ROUTES.LOGIN, { replace: true });
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
          navigate(ROUTES.LOGIN, { replace: true });
          return Promise.resolve([] as unknown as T);
        }
      }

      if (isExpired) {
        setAccessToken(null);
        navigate(ROUTES.LOGIN, { replace: true });
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
