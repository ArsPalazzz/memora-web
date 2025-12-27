"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../context/AuthContext";

export function useAuth() {
  const { accessToken } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (accessToken !== null) setLoading(false);
  }, [accessToken, router]);

  return { loading, authenticated: !!accessToken };
}
