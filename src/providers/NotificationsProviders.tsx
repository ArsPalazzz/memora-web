
import { SnackbarProvider } from "notistack";

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      {children}
    </SnackbarProvider>
  );
}
