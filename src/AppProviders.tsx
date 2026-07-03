import { CssBaseline } from "@mui/material";
import QueryProvider from "@/providers/QueryProvider";
import { NotificationsProvider } from "@/providers/NotificationsProviders";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProviderClient } from "@/context/ThemeContext";
import { InnerThemeProvider } from "@/components/InnerThemeProvider";
import OrientationLock from "@/components/orientation-lock.client";
import { FCMInitializer } from "@/components/FCMInitializer";
import { NotificationProvider } from "@/context/NotificationContext";

function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <NotificationsProvider>
        <CssBaseline />
        <AuthProvider>{children}</AuthProvider>
      </NotificationsProvider>
    </QueryProvider>
  );
}

/** Root provider tree — mirrors memora-web src/app/layout.tsx + ClientProviders.tsx */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProviderClient>
      <InnerThemeProvider>
        <ClientProviders>
          <FCMInitializer />
          <OrientationLock>
            <NotificationProvider>{children}</NotificationProvider>
          </OrientationLock>
        </ClientProviders>
      </InnerThemeProvider>
    </ThemeProviderClient>
  );
}
