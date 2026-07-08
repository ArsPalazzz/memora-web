import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

interface DuelCountdownOverlayProps {
  countdownEndsAt: number;
  onComplete?: () => void;
}

function getCountdownLabel(remainingMs: number): string {
  const secondsLeft = Math.ceil(remainingMs / 1000);

  if (secondsLeft <= 0) {
    return "GO!";
  }

  return String(secondsLeft);
}

export function DuelCountdownOverlay({
  countdownEndsAt,
  onComplete,
}: DuelCountdownOverlayProps) {
  const [now, setNow] = useState(() => Date.now());
  const remainingMs = countdownEndsAt - now;
  const label = getCountdownLabel(remainingMs);
  const isGo = label === "GO!";

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 50);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (remainingMs <= -400) {
      onComplete?.();
    }
  }, [onComplete, remainingMs]);

  if (remainingMs <= -400) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: (theme) => theme.zIndex.modal + 2,
        bgcolor: "rgba(0, 0, 0, 0.82)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "all",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={label}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: isGo ? 1.15 : 1, opacity: 1 }}
          exit={{ scale: 1.4, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "6rem", sm: "8rem" },
              fontWeight: 900,
              color: isGo ? "success.light" : "common.white",
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            {label}
          </Typography>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
