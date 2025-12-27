import {
  Divider,
  Drawer,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import { DeskSettingsCardOrientationModalProps } from "./DeskSettings.types";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import React from "react";
import { CARD_ORIENTATION } from "@/services/desk/desk.const";

const PREDEFINED_VALUES = [
  CARD_ORIENTATION.NORMAL,
  CARD_ORIENTATION.REVERSED,
  CARD_ORIENTATION.MIXED,
];

export default function DeskSettingsCardOrientationModal(
  props: DeskSettingsCardOrientationModalProps
) {
  const { setOpenSheet, currentValue, onClose } = props;
  const [selectedValue, setSelectedValue] =
    useState<CARD_ORIENTATION>(currentValue);

  const handleClose = () => {
    onClose(selectedValue);
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
          minHeight: "35vh",
        },
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={2}>
        Card orientation
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
              <Typography>
                {" "}
                {val.charAt(0).toUpperCase() + val.slice(1)}
              </Typography>
              {selectedValue === val && <CheckIcon />}
            </ListItemButton>
            {index < PREDEFINED_VALUES.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}
