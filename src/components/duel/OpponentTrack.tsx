import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { UserAvatar } from "@/components/ui/UserAvatar";

export interface OpponentTrackPlayer {
  sub: string;
  nickname: string;
  avatar_url: string | null;
  progressPercent: number;
  pulseKey?: number;
  label?: string;
}

interface OpponentTrackProps {
  me: OpponentTrackPlayer;
  opponent: OpponentTrackPlayer | null;
}

function TrackLane({
  player,
  align,
}: {
  player: OpponentTrackPlayer;
  align: "left" | "right";
}) {
  const clampedProgress = Math.min(100, Math.max(0, player.progressPercent));

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minHeight: 36 }}>
      {align === "left" && (
        <UserAvatar
          nickname={player.nickname}
          avatarUrl={player.avatar_url}
          size={32}
        />
      )}

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: align === "left" ? "flex-start" : "flex-end",
            mb: 0.25,
          }}
        >
          <Typography variant="caption" fontWeight={700} noWrap>
            {player.label ?? `@${player.nickname}`}
          </Typography>
        </Box>

        <Box
          sx={{
            position: "relative",
            height: 8,
            borderRadius: 4,
            bgcolor: "grey.200",
            overflow: "hidden",
          }}
        >
          <motion.div
            key={player.pulseKey}
            initial={false}
            animate={{
              width: `${clampedProgress}%`,
              scale: player.pulseKey ? [1, 1.04, 1] : 1,
            }}
            transition={{
              width: { duration: 0.25, ease: "easeOut" },
              scale: { duration: 0.35 },
            }}
            style={{
              height: "100%",
              borderRadius: 4,
              background: align === "left" ? "#6366f1" : "#f97316",
              transformOrigin: align === "left" ? "left center" : "right center",
            }}
          />
        </Box>
      </Box>

      {align === "right" && (
        <motion.div
          animate={
            player.pulseKey
              ? { scale: [1, 1.12, 1], transition: { duration: 0.35 } }
              : { scale: 1 }
          }
        >
          <UserAvatar
            nickname={player.nickname}
            avatarUrl={player.avatar_url}
            size={32}
          />
        </motion.div>
      )}
    </Box>
  );
}

export function OpponentTrack({ me, opponent }: OpponentTrackProps) {
  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
        flexShrink: 0,
      }}
    >
      <TrackLane player={me} align="left" />
      {opponent ? (
        <TrackLane player={opponent} align="right" />
      ) : (
        <Typography variant="caption" color="text.secondary" textAlign="center">
          Waiting for opponent…
        </Typography>
      )}
    </Box>
  );
}
