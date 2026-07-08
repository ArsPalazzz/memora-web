import { Alert } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

export const DUEL_DISCONNECT_GRACE_MS = 30_000;

interface DuelRaceDisconnectBannerProps {
  nickname: string;
  graceRemainingMs: number;
  selfReconnecting: boolean;
}

export function DuelRaceDisconnectBanner({
  nickname,
  graceRemainingMs,
  selfReconnecting,
}: DuelRaceDisconnectBannerProps) {
  const secondsLeft = Math.max(0, Math.ceil(graceRemainingMs / 1000));

  const message = selfReconnecting
    ? "Reconnecting…"
    : `@${nickname} reconnecting… (${secondsLeft}s)`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        <Alert severity="warning" sx={{ mx: 2, borderRadius: 2 }}>
          {message}
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
}
