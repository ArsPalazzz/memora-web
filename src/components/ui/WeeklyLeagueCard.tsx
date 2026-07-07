import { EmojiEvents } from "@mui/icons-material";
import {
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
    <Card variant="outlined">
      <CardActionArea component={RouterLink} to={ROUTES.FRIENDS_LEAGUE}>
        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.25 }}
          >
            <EmojiEvents sx={{ fontSize: 18, color: "warning.main" }} />
            Рейтинг недели
          </Typography>

          {hasLeague ? (
            <>
              <Typography variant="caption" color="text.secondary" display="block">
                Соревнование с друзьями за эту неделю
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ mt: 0.75 }}>
                Ты #{league.myRank} из {league.totalParticipants}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              Нужен хотя бы один друг с публичной статистикой.{" "}
              <Link
                component={RouterLink}
                to={ROUTES.FRIENDS}
                underline="hover"
                onClick={(event) => event.stopPropagation()}
              >
                Добавить
              </Link>
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
