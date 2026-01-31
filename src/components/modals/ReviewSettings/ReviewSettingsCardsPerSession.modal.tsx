import {
  Divider,
  Drawer,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import { ReviewSettingsCardsPerSessionModalProps } from "./ReviewSettings.types";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import React from "react";
import { CARDS_PER_SESSION_LIMIT } from "@/services/desk/desk.const";

const PREDEFINED_VALUES = [10, 25, 50, 75, 100];

export default function ReviewSettingsCardsPerSessionModal({
  setOpenSheet,
  currentValue,
  onClose,
}: ReviewSettingsCardsPerSessionModalProps) {
  const [selectedValue, setSelectedValue] = useState<number>(currentValue);

  const handleClose = () => {
    const valueToSend = selectedValue;

    if (
      valueToSend !== undefined &&
      valueToSend <= CARDS_PER_SESSION_LIMIT &&
      valueToSend > 0
    ) {
      onClose(Number(valueToSend));
    }

    setOpenSheet(null);
  };

  return (
    <Drawer
      open={true}
      anchor="bottom"
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          p: 3,
          minHeight: "55vh",
        },
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={2}>
        Cards per session
      </Typography>

      <List>
        {PREDEFINED_VALUES.map((val, index) => (
          <React.Fragment key={val}>
            <ListItemButton
              selected={selectedValue === val}
              onClick={() => setSelectedValue(val)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                px: 2,
                py: 1,
              }}
            >
              <Typography>{val}</Typography>
              {selectedValue === val && <CheckIcon />}
            </ListItemButton>
            {index < PREDEFINED_VALUES.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}
