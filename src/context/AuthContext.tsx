
import { refreshRequest } from "@/services/auth/auth";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

const TOKEN_KEY = "access_token";

function readStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

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
  const [accessToken, setAccessTokenState] = useState<string | null>(
    readStoredToken
  );
  const [isAuthReady, setIsAuthReady] = useState(false);

  const setAccessToken = useCallback((token: string | null) => {
    setAccessTokenState(token);
    if (typeof window === "undefined") return;
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  }, []);

  useEffect(() => {
    refreshRequest()
      .then(({ accessToken: token }) => setAccessToken(token))
      .catch(() => setAccessToken(null))
      .finally(() => setIsAuthReady(true));
  }, [setAccessToken]);

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined,
    });
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
