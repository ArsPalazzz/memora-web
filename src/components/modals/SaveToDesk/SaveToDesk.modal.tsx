import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { useMemo } from "react";
import { FetchDesksShortResponse, FolderFlat } from "@/services/desk/desk.types";
import { buildDeckPickerRows } from "@/utils/folder-tree";
import { Loader } from "@/components/ui/Loader";

export interface SaveToDeskModalProps {
  open: boolean;
  onClose: () => void;
  desks?: FetchDesksShortResponse[];
  folders?: FolderFlat[];
  isLoading: boolean;
  selectedDesks: string[];
  onSelectedDesksChange: (deskSubs: string[]) => void;
  addedDeskSubs: string[];
  onSave: () => void;
  isSaving: boolean;
}

export default function SaveToDeskModal({
  open,
  onClose,
  desks,
  folders,
  isLoading,
  selectedDesks,
  onSelectedDesksChange,
  addedDeskSubs,
  onSave,
  isSaving,
}: SaveToDeskModalProps) {
  const rows = useMemo(() => {
    if (!desks || !folders) {
      return [];
    }

    return buildDeckPickerRows(folders, desks);
  }, [desks, folders]);

  const toggleDesk = (deskSub: string) => {
    onSelectedDesksChange(
      selectedDesks.includes(deskSub)
        ? selectedDesks.filter((sub) => sub !== deskSub)
        : [...selectedDesks, deskSub]
    );
  };

  const hasNoDesks = !isLoading && desks?.length === 0;
  const isUnchanged =
    JSON.stringify([...selectedDesks].sort()) ===
    JSON.stringify([...addedDeskSubs].sort());

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      PaperProps={{ sx: { maxHeight: "min(420px, 72vh)" } }}
    >
      <DialogTitle sx={{ pb: 1 }}>Save to deck…</DialogTitle>
      <DialogContent
        dividers
        sx={{
          px: 1.5,
          py: 1,
          maxHeight: "min(280px, 50vh)",
          overflowY: "auto",
        }}
      >
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <Loader />
          </Box>
        ) : hasNoDesks ? (
          <Typography color="text.secondary" sx={{ py: 1 }}>
            You don&apos;t have any decks yet. Create one first!
          </Typography>
        ) : (
          <List dense disablePadding sx={{ py: 0 }}>
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

              const alreadyAdded = addedDeskSubs.includes(row.sub);
              const isSelected = selectedDesks.includes(row.sub);

              return (
                <ListItem
                  key={row.sub}
                  disablePadding
                  onClick={() => toggleDesk(row.sub)}
                  sx={{
                    pl: 1 + row.depth * 2,
                    py: 0.125,
                    minHeight: 36,
                    cursor: "pointer",
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Checkbox
                      edge="start"
                      checked={isSelected}
                      tabIndex={-1}
                      disableRipple
                      sx={{
                        p: 0.5,
                        "&.Mui-checked": {
                          color:
                            alreadyAdded && !isSelected
                              ? "grey.500"
                              : "primary.main",
                        },
                      }}
                    />
                  </ListItemIcon>
                  <LibraryBooksIcon
                    sx={{ mr: 1.5, fontSize: 18, color: "primary.main" }}
                  />
                  <ListItemText
                    primary={row.title}
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: 500,
                      noWrap: true,
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 1.25 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onSave}
          disabled={!selectedDesks.length || isSaving || isUnchanged}
          variant="contained"
        >
          {isSaving ? <CircularProgress size={24} /> : "Save to deck"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
