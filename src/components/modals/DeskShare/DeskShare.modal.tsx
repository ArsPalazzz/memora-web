import {
  Box,
  Button,
  Drawer,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { bottomSheetSlotProps } from "@/components/layout/overlay.constants";
import { DeskVisibilitySelect } from "@/components/ui/DeskVisibilitySelect";
import { DeskVisibility } from "@/schemas/createDesk.schema";

interface DeskShareModalProps {
  currentVisibility: DeskVisibility;
  onClose: () => void;
  onSave: (visibility: DeskVisibility) => void;
  isSaving: boolean;
}

export default function DeskShareModal({
  currentVisibility,
  onClose,
  onSave,
  isSaving,
}: DeskShareModalProps) {
  const [visibility, setVisibility] = useState<DeskVisibility>(currentVisibility);

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
        Share deck
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Choose who can view and add this deck to their library
      </Typography>

      <DeskVisibilitySelect value={visibility} onChange={setVisibility} />

      <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
        <Button fullWidth variant="outlined" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          fullWidth
          variant="contained"
          disabled={isSaving || visibility === currentVisibility}
          onClick={() => onSave(visibility)}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Drawer>
  );
}
