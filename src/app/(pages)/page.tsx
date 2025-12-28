"use client";

import { ROUTES } from "@/routes/next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(() => router.replace(ROUTES.HOME))
      .catch(() => router.replace(ROUTES.LOGIN));
  }, [router]);

  return null;
}
