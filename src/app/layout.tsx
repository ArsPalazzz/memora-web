import { ThemeProviderClient, useThemeContext } from "@/context/ThemeContext";
import ClientProviders from "./ClientProviders";
import "./globals.css";
import { getTheme } from "@/theme/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { InnerThemeProvider } from "@/components/InnerThemeProvider";
import OrientationLock from "@/components/orientation-lock.client";

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
              <OrientationLock>{children}</OrientationLock>
            </ClientProviders>
          </InnerThemeProvider>
        </ThemeProviderClient>
      </body>
    </html>
  );
}
