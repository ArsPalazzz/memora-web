import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { ReviewSummaryDesk } from "@/services/review/review.types";
import { bottomSheetSlotProps } from "@/components/layout/overlay.constants";
import {
  getSelectedDeskSubs,
  getSelectedDueCount,
  isDeskIncluded,
} from "@/lib/reviewDeskSelection";

interface StudyDeskPickerModalProps {
  desks: ReviewSummaryDesk[];
  inboxCount: number;
  excludedDeskSubs: string[];
  includeInbox: boolean;
  isStarting: boolean;
  onExcludedChange: (excludedDeskSubs: string[]) => void;
  onIncludeInboxChange: (includeInbox: boolean) => void;
  onClose: () => void;
  onStart: () => void;
  onOpenDesk: (deskSub: string) => void;
}

export default function StudyDeskPickerModal({
  desks,
  inboxCount,
  excludedDeskSubs,
  includeInbox,
  isStarting,
  onExcludedChange,
  onIncludeInboxChange,
  onClose,
  onStart,
  onOpenDesk,
}: StudyDeskPickerModalProps) {
  const selectedDueCount = getSelectedDueCount(desks, excludedDeskSubs);
  const selectedInboxCount = includeInbox ? inboxCount : 0;
  const selectedTotal = selectedDueCount + selectedInboxCount;
  const selectedDeskCount = getSelectedDeskSubs(desks, excludedDeskSubs).length;
  const allSelected =
    desks.length > 0 && selectedDeskCount === desks.length && (inboxCount === 0 || includeInbox);

  const toggleDesk = (deskSub: string) => {
    if (isDeskIncluded(deskSub, excludedDeskSubs)) {
      onExcludedChange([...excludedDeskSubs, deskSub]);
      return;
    }
    onExcludedChange(excludedDeskSubs.filter((sub) => sub !== deskSub));
  };

  const selectAll = () => {
    onExcludedChange([]);
    if (inboxCount > 0) {
      onIncludeInboxChange(true);
    }
  };

  const selectNone = () => {
    onExcludedChange(desks.map((desk) => desk.deskSub));
    onIncludeInboxChange(false);
  };

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
          p: 2.5,
          pb: 3,
          maxHeight: "85vh",
        },
      }}
    >
      <Typography variant="h6" fontWeight={700}>
        Choose decks
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Selected {selectedTotal} cards
        {selectedDueCount > 0 || selectedInboxCount > 0
          ? ` · Due ${selectedDueCount} · Feed ${selectedInboxCount}`
          : ""}
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button size="small" onClick={selectAll} disabled={allSelected}>
          Select all
        </Button>
        <Button
          size="small"
          onClick={selectNone}
          disabled={selectedTotal === 0 && selectedDeskCount === 0 && !includeInbox}
        >
          Clear
        </Button>
      </Stack>

      <List
        dense
        disablePadding
        sx={{ maxHeight: "50vh", overflowY: "auto", mx: -0.5 }}
      >
        {inboxCount > 0 && (
          <ListItem disablePadding sx={{ mb: 0.25 }}>
            <ListItemButton
              onClick={() => onIncludeInboxChange(!includeInbox)}
              sx={{ borderRadius: 2, py: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Checkbox
                  edge="start"
                  checked={includeInbox}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText
                primary="Feed inbox"
                secondary={`${inboxCount} new`}
                primaryTypographyProps={{ fontWeight: 600, variant: "body2" }}
                secondaryTypographyProps={{ variant: "caption" }}
              />
            </ListItemButton>
          </ListItem>
        )}

        {desks.map((desk) => {
          const checked = isDeskIncluded(desk.deskSub, excludedDeskSubs);
          return (
            <ListItem
              key={desk.deskSub}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label={`Open ${desk.title}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpenDesk(desk.deskSub);
                  }}
                  size="small"
                >
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              }
              sx={{ mb: 0.25 }}
            >
              <ListItemButton
                onClick={() => toggleDesk(desk.deskSub)}
                sx={{ borderRadius: 2, py: 0.5, pr: 6 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Checkbox
                    edge="start"
                    checked={checked}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText
                  primary={desk.title}
                  secondary={`${desk.dueCount} due`}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    variant: "body2",
                    noWrap: true,
                  }}
                  secondaryTypographyProps={{ variant: "caption" }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}

        {desks.length === 0 && inboxCount === 0 && (
          <Box sx={{ py: 2 }}>
            <Typography color="text.secondary">No cards to study right now.</Typography>
          </Box>
        )}
      </List>

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button fullWidth variant="outlined" onClick={onClose}>
          Close
        </Button>
        <Button
          fullWidth
          variant="contained"
          disabled={selectedTotal === 0 || isStarting}
          onClick={onStart}
        >
          {isStarting ? "..." : `Study${selectedTotal > 0 ? ` (${selectedTotal})` : ""}`}
        </Button>
      </Stack>
    </Drawer>
  );
}
