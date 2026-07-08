import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { motion } from "framer-motion";
import { UserAvatar } from "@/components/ui/UserAvatar";
import type { DuelPlayerResponse } from "@/services/games/duel.types";

interface DuelPlayerSlotProps {
  player: DuelPlayerResponse | null;
  slotIndex: number;
  isMe: boolean;
  isHost: boolean;
}

export function DuelPlayerSlot({
  player,
  slotIndex,
  isMe,
  isHost,
}: DuelPlayerSlotProps) {
  const empty = !player;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: slotIndex * 0.08 }}
    >
      <Card
        variant="outlined"
        sx={{
          borderStyle: empty ? "dashed" : "solid",
          borderColor: empty ? "divider" : isMe ? "primary.main" : "divider",
          bgcolor: empty ? "action.hover" : "background.paper",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            py: 2,
            "&:last-child": { pb: 2 },
          }}
        >
          {empty ? (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: "action.selected",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <PersonOutlineIcon color="disabled" />
            </Box>
          ) : (
            <UserAvatar
              nickname={player.nickname}
              avatarUrl={player.avatar_url}
              size={48}
            />
          )}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary">
              Player {slotIndex + 1}
              {isHost && !empty ? " · Host" : ""}
              {isMe ? " · You" : ""}
            </Typography>
            <Typography fontWeight={700} noWrap>
              {empty ? "Waiting for opponent…" : `@${player.nickname}`}
            </Typography>
          </Box>

          {!empty && (
            <Chip
              size="small"
              label={player.ready ? "Ready" : "Not ready"}
              color={player.ready ? "success" : "default"}
              variant={player.ready ? "filled" : "outlined"}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
