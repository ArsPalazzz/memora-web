"use client";

import { ROUTES } from "@/routes/next";
import { isAuthenticatedRequest } from "@/services/auth/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    isAuthenticatedRequest()
      .then(() => router.replace(ROUTES.HOME))
      .catch(() => router.replace(ROUTES.LOGIN));
  }, [router]);

  return null;
}
