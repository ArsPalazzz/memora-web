import {
  Divider,
  Drawer,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import React, { useMemo, useState } from "react";
import {
  DEFAULT_DESK_STUDY_MODE,
  DEFAULT_FEED_STUDY_MODE,
  FEED_STUDY_MODES,
  FeedStudyMode,
  STUDY_MODE_LABELS,
  StudyMode,
  normalizeFeedStudyMode,
} from "@/constants/studyMode.const";

const DESK_STUDY_MODES: StudyMode[] = ["write", "reveal", "match"];

function normalizeStudyMode(value: StudyMode, modes: StudyMode[]): StudyMode {
  if (modes.includes(value)) return value;
  return modes[0] ?? DEFAULT_DESK_STUDY_MODE;
}

interface StudyModeSelectModalProps {
  title?: string;
  currentValue: StudyMode;
  onClose: (value: StudyMode) => void;
  setOpenSheet: (value: null) => void;
  includeSwipe?: boolean;
}

export default function StudyModeSelectModal({
  title = "Study mode",
  currentValue,
  onClose,
  setOpenSheet,
  includeSwipe = false,
}: StudyModeSelectModalProps) {
  const deskModes = useMemo(() => DESK_STUDY_MODES, []);
  const feedModes = useMemo(() => [...FEED_STUDY_MODES], []);
  const modes = includeSwipe ? feedModes : deskModes;

  const fallback = includeSwipe ? DEFAULT_FEED_STUDY_MODE : DEFAULT_DESK_STUDY_MODE;

  const [selectedValue, setSelectedValue] = useState<StudyMode | FeedStudyMode>(
    includeSwipe
      ? normalizeFeedStudyMode(currentValue)
      : normalizeStudyMode(currentValue ?? fallback, deskModes)
  );

  const handleClose = () => {
    onClose(selectedValue as StudyMode);
    setOpenSheet(null);
  };

  return (
    <Drawer
      open
      anchor="bottom"
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          p: 3,
          minHeight: "35vh",
        },
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={2}>
        {title}
      </Typography>

      <List>
        {modes.map((mode, index) => (
          <React.Fragment key={mode}>
            <ListItemButton
              selected={selectedValue === mode}
              onClick={() => setSelectedValue(mode)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                px: 2,
                py: 1,
                minHeight: 44,
              }}
            >
              <Typography>{STUDY_MODE_LABELS[mode]}</Typography>
              {selectedValue === mode && <CheckIcon />}
            </ListItemButton>
            {index < modes.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}
