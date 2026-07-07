import { ChevronRight, Flag } from "@mui/icons-material";
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
  compact?: boolean;
}

export function ChallengeBanner({
  challenge,
  onOpen,
  compact = false,
}: ChallengeBannerProps) {
  const myEntry = challenge.leaderboard.find((entry) => entry.isMe);
  const leaderLabel = challenge.leaderNickname
    ? `@${challenge.leaderNickname}`
    : null;

  if (compact) {
    const detail = myEntry
      ? `#${myEntry.rank}`
      : leaderLabel ?? "join";

    return (
      <Card variant="outlined" sx={{ borderColor: "warning.light" }}>
        <CardActionArea onClick={onOpen}>
          <CardContent
            sx={{
              py: 1,
              "&:last-child": { pb: 1 },
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Flag sx={{ fontSize: 18, color: "warning.main", flexShrink: 0 }} />
            <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }} noWrap>
              Challenge · {challenge.desk.title} · {detail}
            </Typography>
            <ChevronRight sx={{ fontSize: 18, color: "text.disabled" }} />
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }

  const miniLeaderboard = challenge.leaderboard.slice(0, 3);

  return (
    <Card variant="outlined" sx={{ borderColor: "warning.light" }}>
      <CardActionArea onClick={onOpen}>
        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.25 }}
          >
            <Flag sx={{ fontSize: 18, color: "warning.main" }} />
            Weekly challenge
          </Typography>

          <Typography variant="caption" color="text.secondary" display="block">
            Most reviews on one shared deck this week
          </Typography>

          <Typography variant="body2" fontWeight={600} sx={{ mt: 0.75 }} noWrap>
            {challenge.desk.title}
          </Typography>

          {myEntry ? (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>
              Your rank: #{myEntry.rank} · {myEntry.cardsReviewed} cards
            </Typography>
          ) : (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>
              Add this deck to your library to join
            </Typography>
          )}

          {miniLeaderboard.length > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25, mt: 1 }}>
              {miniLeaderboard.map((entry) => (
                <Typography
                  key={`${entry.nickname}-${entry.rank}`}
                  variant="caption"
                  color="text.secondary"
                >
                  #{entry.rank}{" "}
                  {entry.isMe ? "You" : `@${entry.nickname}`} · {entry.cardsReviewed} cards
                </Typography>
              ))}
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
