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
import { useProtectedRequest } from "@/utils/protected";
import { fetchMyDesksShortRequest } from "@/services/desk/desk";

interface DuelChallengeDeskModalProps {
  friendNickname: string;
  onClose: () => void;
  onSelectDesk: (deskSub: string, deskTitle: string) => void;
}

export default function DuelChallengeDeskModal({
  friendNickname,
  onClose,
  onSelectDesk,
}: DuelChallengeDeskModalProps) {
  const { call } = useProtectedRequest();

  const { data: desks = [], isLoading } = useQuery({
    queryKey: ["desks-short"],
    queryFn: async () => call((token) => fetchMyDesksShortRequest(token)),
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
        Challenge @{friendNickname}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Pick a deck for the duel
      </Typography>

      {isLoading ? (
        <SectionLoader minHeight="20vh" />
      ) : desks.length === 0 ? (
        <Typography color="text.secondary">You do not have any decks yet.</Typography>
      ) : (
        <List sx={{ maxHeight: "45vh", overflowY: "auto" }}>
          {desks.map((desk) => (
            <ListItemButton
              key={desk.sub}
              onClick={() => onSelectDesk(desk.sub, desk.title)}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <Typography fontWeight={600}>{desk.title}</Typography>
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
