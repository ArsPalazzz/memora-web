import FolderIcon from "@mui/icons-material/Folder";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import {
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { bottomSheetSlotProps } from "@/components/layout/overlay.constants";
import { SectionLoader } from "@/components/ui/Loader";
import { FOLDERS_FLAT, USER_DESKS_SHORT } from "@/routes/react-query";
import {
  fetchMyDesksShortRequest,
  getFoldersFlatRequest,
} from "@/services/desk/desk";
import { buildDeckPickerRows } from "@/utils/folder-tree";
import { useProtectedRequest } from "@/utils/protected";

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

  const { data: desks = [], isLoading: isDesksLoading } = useQuery({
    queryKey: [USER_DESKS_SHORT],
    queryFn: async () => call((token) => fetchMyDesksShortRequest(token)),
  });

  const { data: folders = [], isLoading: isFoldersLoading } = useQuery({
    queryKey: [FOLDERS_FLAT],
    queryFn: async () => call((token) => getFoldersFlatRequest(token)),
  });

  const rows = useMemo(
    () => buildDeckPickerRows(folders, desks),
    [folders, desks]
  );

  const isLoading = isDesksLoading || isFoldersLoading;
  const hasNoDesks = !isLoading && desks.length === 0;

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
      ) : hasNoDesks ? (
        <Typography color="text.secondary">You do not have any decks yet.</Typography>
      ) : (
        <List dense disablePadding sx={{ maxHeight: "45vh", overflowY: "auto" }}>
          {rows.map((row) => {
            if (row.type === "folder") {
              return (
                <ListItem
                  key={`folder-${row.folderSub}`}
                  disablePadding
                  sx={{
                    pl: 1 + row.depth * 2,
                    py: 0.5,
                    minHeight: 30,
                  }}
                >
                  <FolderIcon
                    sx={{ mr: 1.5, fontSize: 18, color: "text.secondary" }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={600}
                    noWrap
                  >
                    {row.label}
                  </Typography>
                </ListItem>
              );
            }

            return (
              <ListItemButton
                key={row.sub}
                onClick={() => onSelectDesk(row.sub, row.title)}
                sx={{
                  pl: 1 + row.depth * 2,
                  py: 0.125,
                  minHeight: 36,
                  borderRadius: 2,
                  mb: 0.25,
                }}
              >
                <LibraryBooksIcon
                  sx={{ mr: 1.5, fontSize: 18, color: "primary.main" }}
                />
                <ListItemText
                  primary={row.title}
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: 600,
                    noWrap: true,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      )}

      <Button fullWidth variant="outlined" onClick={onClose} sx={{ mt: 2 }}>
        Cancel
      </Button>
    </Drawer>
  );
}
