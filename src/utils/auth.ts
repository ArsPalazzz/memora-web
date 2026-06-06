"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";

export function useAuth() {
  const { accessToken } = useAuthContext();
  const [loading, setLoading] = useState(accessToken === null);

  useEffect(() => {
    if (accessToken !== null) setLoading(false);
  }, [accessToken]);

  return { loading, authenticated: !!accessToken };
}
