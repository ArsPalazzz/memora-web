import { Box, Typography } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import type { DuelRaceScoreboardEntry } from "@/services/games/duel.types";
import type { DuelResultsOutcome } from "@/utils/duelResults.utils";
import { outcomeHeadline, outcomeSubtitle } from "@/utils/duelResults.utils";

interface DuelResultsPodiumProps {
  me: DuelRaceScoreboardEntry | null;
  opponent: DuelRaceScoreboardEntry | null;
  outcome: DuelResultsOutcome;
}

function PodiumSlot({
  player,
  rank,
  highlight,
  delay,
  elevated,
}: {
  player: DuelRaceScoreboardEntry;
  rank: number;
  highlight: boolean;
  delay: number;
  elevated: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      style={{
        flex: elevated ? 1.15 : 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: elevated ? 0 : 28,
      }}
    >
      <Box sx={{ position: "relative", mb: 1 }}>
        {elevated && (
          <EmojiEventsIcon
            sx={{
              position: "absolute",
              top: -18,
              left: "50%",
              transform: "translateX(-50%)",
              color: "warning.main",
              fontSize: 28,
            }}
          />
        )}
        <Box
          sx={{
            borderRadius: "50%",
            p: 0.5,
            border: highlight ? "3px solid" : "2px solid",
            borderColor: highlight ? "warning.main" : "divider",
            boxShadow: highlight ? 4 : 1,
          }}
        >
          <UserAvatar
            nickname={player.nickname}
            avatarUrl={player.avatar_url}
            size={elevated ? 72 : 56}
          />
        </Box>
      </Box>

      <Typography fontWeight={800} noWrap sx={{ maxWidth: 120 }}>
        @{player.nickname}
      </Typography>
      <Typography variant="h6" fontWeight={900} color="primary.main">
        {player.score}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        #{rank}
      </Typography>
    </motion.div>
  );
}

export function DuelResultsPodium({
  me,
  opponent,
  outcome,
}: DuelResultsPodiumProps) {
  const [showConfetti, setShowConfetti] = useState(
    outcome === "win" || outcome === "forfeit_win"
  );

  useEffect(() => {
    if (!showConfetti) {
      return;
    }

    const timer = window.setTimeout(() => setShowConfetti(false), 4000);
    return () => window.clearTimeout(timer);
  }, [showConfetti]);

  if (!me) {
    return null;
  }

  const players = opponent ? [me, opponent] : [me];
  const sorted = [...players].sort((a, b) => a.placement - b.placement);
  const isTie = outcome === "tie";
  const winner = sorted[0];
  const runnerUp = sorted[1] ?? null;
  const iWon = outcome === "win" || outcome === "forfeit_win";

  return (
    <Box sx={{ position: "relative", overflow: "hidden", px: 2, pt: 2, pb: 1 }}>
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={260}
          gravity={0.25}
          style={{ position: "fixed", inset: 0, zIndex: 1300, pointerEvents: "none" }}
        />
      )}

      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="h4" fontWeight={900}>
          {outcomeHeadline(outcome)}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {outcomeSubtitle(outcome)}
        </Typography>
      </Box>

      {isTie && runnerUp ? (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 3, minHeight: 160 }}>
          <PodiumSlot
            player={me}
            rank={me.placement}
            highlight
            delay={0}
            elevated
          />
          <PodiumSlot
            player={runnerUp}
            rank={runnerUp.placement}
            highlight={false}
            delay={0.08}
            elevated
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 2,
            minHeight: 160,
          }}
        >
          {runnerUp && (
            <PodiumSlot
              player={runnerUp}
              rank={runnerUp.placement}
              highlight={runnerUp.sub === me.sub && iWon}
              delay={0.1}
              elevated={false}
            />
          )}

          <PodiumSlot
            player={winner}
            rank={winner.placement}
            highlight={winner.sub === me.sub && iWon}
            delay={0}
            elevated
          />
        </Box>
      )}
    </Box>
  );
}
