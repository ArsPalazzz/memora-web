import { CheckCircle, People } from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Link,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { FriendActivity } from "@/services/friends/friends.types";
import { ROUTES } from "@/routes/paths";

interface FriendsTodayCardProps {
  friends: FriendActivity[];
  onFriendClick: (nickname: string) => void;
}

export function FriendsTodayCard({
  friends,
  onFriendClick,
}: FriendsTodayCardProps) {
  const visibleFriends = friends.slice(0, 2);
  const hasFriends = visibleFriends.length > 0;

  return (
    <Card variant="outlined">
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 1,
            mb: hasFriends ? 1 : 0.5,
          }}
        >
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
            >
              <People sx={{ fontSize: 18, color: "primary.main" }} />
              Друзья
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Кто учился сегодня
            </Typography>
          </Box>
          <Link
            component={RouterLink}
            to={ROUTES.FRIENDS}
            underline="hover"
            variant="caption"
            fontWeight={600}
            sx={{ flexShrink: 0, mt: 0.25 }}
          >
            Все
          </Link>
        </Box>

        {hasFriends ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {visibleFriends.map((friend) => (
              <Box
                key={friend.nickname}
                onClick={() => onFriendClick(friend.nickname)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  px: 0.75,
                  py: 0.5,
                  borderRadius: 1,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Typography variant="body2" fontWeight={600} noWrap>
                  @{friend.nickname}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
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
              <Typography variant="caption" color="text.secondary" sx={{ px: 0.75 }}>
                +{friends.length - 2} ещё учились сегодня
              </Typography>
            )}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Пока никого.{" "}
            <Link component={RouterLink} to={ROUTES.FRIENDS} underline="hover">
              Найти друзей
            </Link>
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
