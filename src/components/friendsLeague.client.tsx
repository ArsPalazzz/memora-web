import {
  alpha,
  Box,
  Card,
  CardContent,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router-dom";
import Header from "@/components/layout/Header";
import WithBottomNav from "@/components/layout/WithBottomNav";
import { SectionLoader } from "@/components/ui/Loader";
import { useProtectedRequest } from "@/utils/protected";
import { getFriendsLeagueRequest } from "@/services/friends/friends";
import { FRIENDS_LEAGUE } from "@/routes/react-query";
import { ROUTES } from "@/routes/paths";

function formatWeekRange(weekStart: string, weekEnd: string) {
  const start = new Date(`${weekStart}T00:00:00.000Z`);
  const end = new Date(`${weekEnd}T00:00:00.000Z`);
  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

  return `${formatter.format(start)} – ${formatter.format(end)} UTC`;
}

export default function FriendsLeagueClient() {
  const theme = useTheme();
  const { call } = useProtectedRequest();

  const { data: league, isLoading } = useQuery({
    queryKey: [FRIENDS_LEAGUE],
    queryFn: async () => call((token) => getFriendsLeagueRequest(token)),
  });

  const hasLeague = (league?.totalParticipants ?? 0) >= 2;

  return (
    <WithBottomNav>
      <Header title="Weekly league" />

      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", px: 2, py: 2 }}>
        {isLoading && <SectionLoader minHeight="40vh" />}

        {!isLoading && league && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {formatWeekRange(league.weekStart, league.weekEnd)}
            </Typography>

            {!hasLeague ? (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <EmojiEventsIcon
                  sx={{ fontSize: 56, color: "grey.400", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Add friends to unlock the league
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  You need at least one friend with public stats
                </Typography>
                <Link component={RouterLink} to={ROUTES.FRIENDS} underline="hover">
                  Find friends
                </Link>
              </Box>
            ) : (
              <Stack spacing={1.5}>
                {league.participants.map((participant) => (
                  <Card
                    key={participant.nickname}
                    sx={{
                      border: participant.isMe ? "2px solid" : "1px solid",
                      borderColor: participant.isMe
                        ? "primary.main"
                        : "divider",
                      bgcolor: participant.isMe
                        ? alpha(theme.palette.primary.main, 0.04)
                        : "background.paper",
                    }}
                  >
                    <CardContent
                      sx={{
                        py: 1.5,
                        "&:last-child": { pb: 1.5 },
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={800}
                        sx={{ minWidth: 28, textAlign: "center" }}
                      >
                        #{participant.rank}
                      </Typography>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body1" fontWeight={700} noWrap>
                          {participant.isMe
                            ? "You"
                            : `@${participant.nickname}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {participant.cardsReviewed} cards · {participant.goalsHit}{" "}
                          goals
                        </Typography>
                      </Box>

                      <Typography variant="h6" fontWeight={800}>
                        {participant.score}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </>
        )}
      </Box>
    </WithBottomNav>
  );
}
