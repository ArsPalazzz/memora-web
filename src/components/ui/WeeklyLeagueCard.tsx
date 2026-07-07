import {
  EmojiEvents,
  ChevronRight,
} from "@mui/icons-material";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { WeeklyLeagueResponse } from "@/services/friends/friends.types";
import { ROUTES } from "@/routes/paths";

interface WeeklyLeagueCardProps {
  league: WeeklyLeagueResponse;
  compact?: boolean;
}

export function WeeklyLeagueCard({ league, compact = false }: WeeklyLeagueCardProps) {
  const hasLeague = league.totalParticipants >= 2;

  if (compact) {
    return (
      <Card variant="outlined">
        <CardActionArea component={RouterLink} to={ROUTES.FRIENDS_LEAGUE}>
          <CardContent
            sx={{
              py: 1,
              "&:last-child": { pb: 1 },
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <EmojiEvents sx={{ fontSize: 18, color: "warning.main", flexShrink: 0 }} />
            <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }} noWrap>
              Weekly league
              {hasLeague
                ? ` · #${league.myRank} of ${league.totalParticipants}`
                : " · add friends to join"}
            </Typography>
            <ChevronRight sx={{ fontSize: 18, color: "text.disabled" }} />
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }

  return (
    <Card variant="outlined">
      <CardActionArea component={RouterLink} to={ROUTES.FRIENDS_LEAGUE}>
        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.25 }}
          >
            <EmojiEvents sx={{ fontSize: 18, color: "warning.main" }} />
            Weekly league
          </Typography>

          {hasLeague ? (
            <>
              <Typography variant="caption" color="text.secondary" display="block">
                Compete with friends this week
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ mt: 0.75 }}>
                You are #{league.myRank} of {league.totalParticipants}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              Add a friend with public stats to unlock the league.
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
