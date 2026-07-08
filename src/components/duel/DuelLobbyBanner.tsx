import { Alert, Button } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { DuelLobbyBanner as BannerState } from "@/hooks/useDuelLobby";
import { ROUTES } from "@/routes/paths";

interface DuelLobbyBannerProps {
  banner: BannerState | null;
}

function bannerMessage(banner: BannerState): string {
  switch (banner.type) {
    case "reconnect":
      return "Connection lost — reconnecting…";
    case "opponent_disconnected":
      return `@${banner.nickname} disconnected. Waiting to reconnect…`;
    case "opponent_left":
      return "Your opponent left the lobby.";
    case "cancelled":
      return "This duel was cancelled.";
    default:
      return "";
  }
}

function bannerSeverity(
  banner: BannerState
): "warning" | "error" | "info" {
  switch (banner.type) {
    case "reconnect":
    case "opponent_disconnected":
      return "warning";
    case "opponent_left":
    case "cancelled":
      return "error";
    default:
      return "info";
  }
}

export function DuelLobbyBanner({ banner }: DuelLobbyBannerProps) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {banner && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <Alert
            severity={bannerSeverity(banner)}
            sx={{ borderRadius: 2 }}
            action={
              banner.type === "cancelled" || banner.type === "opponent_left" ? (
                <Button color="inherit" size="small" onClick={() => navigate(ROUTES.HOME)}>
                  Home
                </Button>
              ) : undefined
            }
          >
            {bannerMessage(banner)}
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
