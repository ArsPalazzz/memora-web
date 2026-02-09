import { ThemeProviderClient } from "@/context/ThemeContext";
import ClientProviders from "./ClientProviders";
import "./globals.css";
import { InnerThemeProvider } from "@/components/InnerThemeProvider";
import OrientationLock from "@/components/orientation-lock.client";
import { FCMInitializer } from "@/components/FCMInitializer";
import { NotificationProvider } from "@/context/NotificationContext";

export const metadata = {
  title: "Memora App",
  description: "Memora App",
  themeColor: "#317EFB",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
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
      </body>
    </html>
  );
}
