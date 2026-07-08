
import {
  getAccessToken,
  refreshAccessToken,
  setAccessToken as persistAccessToken,
  setOnUnauthorized,
  subscribeAccessToken,
} from "@/auth/tokenStore";
import { clearAppQueryCache } from "@/utils/clearAppQueryCache";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/paths";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
  logout: () => {},
  isAuthReady: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [accessToken, setAccessTokenState] = useState<string | null>(
    getAccessToken
  );
  const [isAuthReady, setIsAuthReady] = useState(false);

  const setAccessToken = useCallback((token: string | null) => {
    persistAccessToken(token);
    setAccessTokenState(token);
  }, []);

  useEffect(() => {
    return subscribeAccessToken(setAccessTokenState);
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => {
      clearAppQueryCache();
      setAccessTokenState(null);
      navigate(ROUTES.LOGIN, { replace: true });
    });

    return () => setOnUnauthorized(null);
  }, [navigate]);

  useEffect(() => {
    refreshAccessToken()
      .then((token) => setAccessTokenState(token))
      .catch(() => setAccessTokenState(null))
      .finally(() => setIsAuthReady(true));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined,
    });
    clearAppQueryCache();
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, logout, isAuthReady }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
