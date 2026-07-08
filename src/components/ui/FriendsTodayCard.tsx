import { CheckCircle, People } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { FriendActivity } from "@/services/friends/friends.types";

interface FriendsTodayCardProps {
  friends: FriendActivity[];
  onFriendClick: (nickname: string) => void;
}

export function FriendsTodayCard({
  friends,
  onFriendClick,
}: FriendsTodayCardProps) {
  const visibleFriends = friends.slice(0, 2);

  if (visibleFriends.length === 0) {
    return null;
  }

  return (
    <Card variant="outlined">
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
          >
            <People sx={{ fontSize: 18, color: "primary.main" }} />
            Friends' activity
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Cards reviewed today
          </Typography>
        </Box>

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
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, flex: 1 }}>
                <UserAvatar
                  nickname={friend.nickname}
                  avatarUrl={friend.avatar_url}
                  size={28}
                />
                <Typography variant="body2" fontWeight={600} noWrap>
                  @{friend.nickname}
                </Typography>
              </Box>
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
              +{friends.length - 2} more today
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
