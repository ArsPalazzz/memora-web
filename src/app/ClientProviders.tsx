"use client";

import { CssBaseline } from "@mui/material";
import QueryProvider from "@/providers/QueryProvider";
import { NotificationsProvider } from "@/providers/NotificationsProviders";
import { AuthProvider } from "@/context/AuthContext";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <NotificationsProvider>
        <CssBaseline />
        <AuthProvider>{children}</AuthProvider>
      </NotificationsProvider>
    </QueryProvider>
  );
}
