import { EmojiEvents } from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Link,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { WeeklyLeagueResponse } from "@/services/friends/friends.types";
import { ROUTES } from "@/routes/paths";

interface WeeklyLeagueCardProps {
  league: WeeklyLeagueResponse;
}

export function WeeklyLeagueCard({ league }: WeeklyLeagueCardProps) {
  const hasLeague = league.totalParticipants >= 2;

  return (
    <Card
      sx={{
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <CardActionArea component={RouterLink} to={ROUTES.FRIENDS_LEAGUE}>
        <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}
          >
            <EmojiEvents sx={{ fontSize: 18, color: "warning.main" }} />
            Weekly league
          </Typography>

          {hasLeague ? (
            <Typography variant="body2" color="text.secondary">
              Weekly: ты #{league.myRank} из {league.totalParticipants}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Добавь друзей для league{" "}
              <Link
                component={RouterLink}
                to={ROUTES.FEED}
                underline="hover"
                onClick={(event) => event.stopPropagation()}
              >
                в ленте
              </Link>
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
