import { useAuthContext } from "../context/AuthContext";

export function useAuth() {
  const { accessToken, isAuthReady } = useAuthContext();

  return {
    loading: !isAuthReady,
    authenticated: !!accessToken,
  };
}
