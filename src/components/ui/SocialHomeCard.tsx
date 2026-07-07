import { CheckCircle, ChevronRight, EmojiEvents, Flag, People } from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { ReactNode } from "react";
import { FriendActivity, WeeklyLeagueResponse } from "@/services/friends/friends.types";
import { CurrentChallengeResponse } from "@/services/challenge/challenge.types";
import { ROUTES } from "@/routes/paths";

interface SocialHomeCardProps {
  friends?: FriendActivity[];
  league?: WeeklyLeagueResponse;
  challenge?: CurrentChallengeResponse;
  onFriendClick: (nickname: string) => void;
  onChallengeOpen: () => void;
}

function SocialRow({
  icon,
  label,
  onClick,
  to,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  to?: string;
}) {
  const content = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        py: 0.75,
      }}
    >
      <Box sx={{ display: "flex", color: "text.secondary", flexShrink: 0 }}>{icon}</Box>
      <Typography variant="body2" color="text.secondary" sx={{ flex: 1, minWidth: 0 }} noWrap>
        {label}
      </Typography>
      <ChevronRight sx={{ fontSize: 18, color: "text.disabled" }} />
    </Box>
  );

  if (to) {
    return (
      <CardActionArea component={RouterLink} to={to} sx={{ borderRadius: 1 }}>
        {content}
      </CardActionArea>
    );
  }

  return (
    <Box onClick={onClick} sx={{ cursor: "pointer", borderRadius: 1, "&:hover": { bgcolor: "action.hover" } }}>
      {content}
    </Box>
  );
}

export function SocialHomeCard({
  friends = [],
  league,
  challenge,
  onFriendClick,
  onChallengeOpen,
}: SocialHomeCardProps) {
  const hasLeague = (league?.totalParticipants ?? 0) >= 2;
  const visibleFriends = friends.slice(0, 2);
  const hasSocialContent =
    visibleFriends.length > 0 || hasLeague || !!challenge;

  if (!hasSocialContent) {
    return (
      <Card sx={{ border: "1px solid", borderColor: "divider" }}>
        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}
          >
            <People sx={{ fontSize: 18, color: "text.secondary" }} />
            Friends
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Добавь друга{" "}
            <Link component={RouterLink} to={ROUTES.FEED} underline="hover">
              в ленте
            </Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ border: "1px solid", borderColor: "divider" }}>
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Typography
          variant="subtitle2"
          fontWeight={700}
          sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1 }}
        >
          <People sx={{ fontSize: 18, color: "text.secondary" }} />
          Friends
        </Typography>

        {visibleFriends.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25, mb: 1 }}>
            {visibleFriends.map((friend) => (
              <Box
                key={friend.nickname}
                onClick={() => onFriendClick(friend.nickname)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  py: 0.25,
                  px: 0.5,
                  borderRadius: 1,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Typography variant="body2" fontWeight={600} noWrap>
                  @{friend.nickname}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
                  <Typography variant="caption" color="text.secondary">
                    {friend.cardsReviewedToday}/{friend.dailyGoal}
                  </Typography>
                  {friend.goalAchieved && (
                    <CheckCircle sx={{ fontSize: 14, color: "success.main" }} />
                  )}
                </Box>
              </Box>
            ))}
            {friends.length > 2 && (
              <Typography variant="caption" color="text.secondary" sx={{ px: 0.5 }}>
                +{friends.length - 2} ещё сегодня
              </Typography>
            )}
          </Box>
        )}

        {(hasLeague || challenge) && visibleFriends.length > 0 && (
          <Divider sx={{ mb: 0.5 }} />
        )}

        {hasLeague && league && (
          <SocialRow
            icon={<EmojiEvents sx={{ fontSize: 16 }} />}
            label={`Weekly · #${league.myRank} из ${league.totalParticipants}`}
            to={ROUTES.FRIENDS_LEAGUE}
          />
        )}

        {!hasLeague && league && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", py: 0.5 }}>
            League появится, когда будет 2+ участника
          </Typography>
        )}

        {challenge && (
          <SocialRow
            icon={<Flag sx={{ fontSize: 16 }} />}
            label={`Challenge · ${challenge.desk.title}${
              challenge.leaderNickname ? ` · @${challenge.leaderNickname}` : ""
            }`}
            onClick={onChallengeOpen}
          />
        )}
      </CardContent>
    </Card>
  );
}
