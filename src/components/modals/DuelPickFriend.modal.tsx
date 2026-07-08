import {
  Button,
  Drawer,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { bottomSheetSlotProps } from "@/components/layout/overlay.constants";
import { SectionLoader } from "@/components/ui/Loader";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useProtectedRequest } from "@/utils/protected";
import { getFriendsRequest } from "@/services/friends/friends";
import { FRIENDS } from "@/routes/react-query";

interface DuelPickFriendModalProps {
  deskTitle: string;
  onClose: () => void;
  onSelectFriend: (friendSub: string, friendNickname: string) => void;
}

export default function DuelPickFriendModal({
  deskTitle,
  onClose,
  onSelectFriend,
}: DuelPickFriendModalProps) {
  const { call } = useProtectedRequest();

  const { data: friends = [], isLoading } = useQuery({
    queryKey: [FRIENDS],
    queryFn: async () => call((token) => getFriendsRequest(token)),
  });

  return (
    <Drawer
      open
      anchor="bottom"
      onClose={onClose}
      slotProps={bottomSheetSlotProps}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          p: 3,
          minHeight: "35vh",
        },
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={0.5}>
        Race on {deskTitle}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Pick a friend to challenge
      </Typography>

      {isLoading ? (
        <SectionLoader minHeight="20vh" />
      ) : friends.length === 0 ? (
        <Typography color="text.secondary">Add friends first to start a duel.</Typography>
      ) : (
        <List sx={{ maxHeight: "45vh", overflowY: "auto" }}>
          {friends.map((friend) => (
            <ListItemButton
              key={friend.sub}
              onClick={() => onSelectFriend(friend.sub, friend.nickname)}
              sx={{ borderRadius: 2, mb: 0.5, gap: 1.5 }}
            >
              <UserAvatar nickname={friend.nickname} avatarUrl={friend.avatar_url} size={36} />
              <Typography fontWeight={600}>@{friend.nickname}</Typography>
            </ListItemButton>
          ))}
        </List>
      )}

      <Button fullWidth variant="outlined" onClick={onClose} sx={{ mt: 2 }}>
        Cancel
      </Button>
    </Drawer>
  );
}
