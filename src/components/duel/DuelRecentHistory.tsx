import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { useNavigate } from "react-router-dom";
import { UserAvatar } from "@/components/ui/UserAvatar";
import type { DuelHistoryEntry } from "@/services/games/duel.types";
import { ROUTES } from "@/routes/paths";

function outcomeLabel(outcome: DuelHistoryEntry["outcome"]): string {
  switch (outcome) {
    case "win":
      return "W";
    case "loss":
      return "L";
    case "tie":
      return "T";
    case "forfeit_win":
      return "W*";
    case "forfeit_loss":
      return "L*";
    default:
      return "?";
  }
}

function outcomeColor(
  outcome: DuelHistoryEntry["outcome"]
): "success" | "error" | "warning" | "default" {
  switch (outcome) {
    case "win":
    case "forfeit_win":
      return "success";
    case "loss":
    case "forfeit_loss":
      return "error";
    case "tie":
      return "warning";
    default:
      return "default";
  }
}

interface DuelRecentHistoryProps {
  history: DuelHistoryEntry[];
  compact?: boolean;
}

export function DuelRecentHistory({ history, compact = false }: DuelRecentHistoryProps) {
  const navigate = useNavigate();

  if (history.length === 0) {
    return (
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="body2" color="text.secondary">
          No recent duels yet. Challenge a friend to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={1} sx={{ px: 2, pb: compact ? 1 : 2 }}>
      {history.map((entry) => (
        <Card key={entry.id} variant="outlined">
          <CardActionArea onClick={() => navigate(ROUTES.duelResults(entry.id))}>
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                py: 1.25,
                "&:last-child": { pb: 1.25 },
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor:
                    outcomeColor(entry.outcome) === "success"
                      ? "success.light"
                      : outcomeColor(entry.outcome) === "error"
                        ? "error.light"
                        : "warning.light",
                  color:
                    outcomeColor(entry.outcome) === "success"
                      ? "success.dark"
                      : outcomeColor(entry.outcome) === "error"
                        ? "error.dark"
                        : "warning.dark",
                  fontWeight: 900,
                  flexShrink: 0,
                }}
              >
                {outcomeLabel(entry.outcome)}
              </Box>

              {entry.opponent ? (
                <UserAvatar
                  nickname={entry.opponent.nickname}
                  avatarUrl={entry.opponent.avatar_url}
                  size={36}
                />
              ) : (
                <SportsEsportsIcon color="disabled" />
              )}

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontWeight={700} noWrap>
                  {entry.deskTitle}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {entry.opponent
                    ? `@${entry.opponent.nickname} · ${entry.myScore}–${entry.opponent.score}`
                    : `${entry.myScore} pts`}
                  {" · "}
                  {entry.cardCount} cards
                </Typography>
              </Box>

              <ChevronRightIcon color="disabled" />
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Stack>
  );
}
