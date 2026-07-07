import { Flag } from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { CurrentChallengeResponse } from "@/services/challenge/challenge.types";

interface ChallengeBannerProps {
  challenge: CurrentChallengeResponse;
  onOpen: () => void;
}

export function ChallengeBanner({ challenge, onOpen }: ChallengeBannerProps) {
  const miniLeaderboard = challenge.leaderboard.slice(0, 3);
  const leaderLabel = challenge.leaderNickname
    ? `@${challenge.leaderNickname}`
    : "—";

  return (
    <Card
      sx={{
        border: "1px solid",
        borderColor: "warning.light",
        bgcolor: "background.paper",
      }}
    >
      <CardActionArea onClick={onOpen}>
        <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}
          >
            <Flag sx={{ fontSize: 18, color: "warning.main" }} />
            Challenge: {challenge.desk.title} — {leaderLabel}
          </Typography>

          {miniLeaderboard.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {miniLeaderboard.map((entry) => (
                <Typography
                  key={`${entry.nickname}-${entry.rank}`}
                  variant="caption"
                  color="text.secondary"
                >
                  #{entry.rank}{" "}
                  {entry.isMe ? "Ты" : `@${entry.nickname}`} · {entry.cardsReviewed}{" "}
                  cards
                </Typography>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Добавь колоду в библиотеку, чтобы участвовать
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
