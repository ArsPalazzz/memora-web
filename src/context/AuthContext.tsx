"use client";

import { refreshRequest } from "@/services/auth/auth";
// import { processOfflineQueue } from "@/services/indexedDB";
import { useProtectedRequest } from "@/utils/protected";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { call } = useProtectedRequest();

  useEffect(() => {
    const refreshSession = async () => {
      try {
        call(refreshRequest);
      } catch {
        setAccessToken(null);
      }
    };

    refreshSession();
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setAccessToken(null);
  };

  // window.addEventListener("online", () => {
  //   processOfflineQueue(accessToken);
  // });

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
