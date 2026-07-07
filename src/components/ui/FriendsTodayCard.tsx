import { CheckCircle, People } from "@mui/icons-material";
import {
  Box,
  Card,
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
  const hasFriends = friends.length > 0;

  return (
    <Card
      sx={{
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
        <Typography
          variant="subtitle2"
          fontWeight={700}
          sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.5 }}
        >
          <People sx={{ fontSize: 18, color: "text.secondary" }} />
          Друзья сегодня
        </Typography>

        {hasFriends ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {friends.map((friend) => (
              <Box
                key={friend.nickname}
                onClick={() => onFriendClick(friend.nickname)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  px: 1,
                  py: 0.75,
                  borderRadius: 1,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Typography variant="body2" fontWeight={600} noWrap>
                  @{friend.nickname}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {friend.cardsReviewedToday}/{friend.dailyGoal}
                  </Typography>
                  {friend.goalAchieved && (
                    <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Добавь друга{" "}
            <Link component={RouterLink} to={ROUTES.FEED} underline="hover">
              в ленте
            </Link>
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
