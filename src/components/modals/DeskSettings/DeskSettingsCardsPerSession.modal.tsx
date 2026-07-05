import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  TextField,
  Typography,
} from "@mui/material";
import { DeskSettingsCardsPerSessionModalProps } from "./DeskSettings.types";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import React from "react";
import { CARDS_PER_SESSION_LIMIT } from "@/services/desk/desk.const";
import { bottomSheetSlotProps } from "@/components/layout/overlay.constants";

const PREDEFINED_VALUES = [10, 25, 50, 75, 100, 125, 150, 175, 200];

export default function DeskSettingsCardsPerSessionModal(
  props: DeskSettingsCardsPerSessionModalProps
) {
  const { setOpenSheet, currentValue, onClose } = props;
  const [selectedValue, setSelectedValue] = useState<number | "custom">(
    PREDEFINED_VALUES.includes(currentValue) ? currentValue : "custom"
  );
  const [customValue, setCustomValue] = useState<number | "">(
    PREDEFINED_VALUES.includes(currentValue) ? "" : currentValue
  );

  const [error, setError] = useState("");

  const handleClose = () => {
    const isCustom = selectedValue === "custom";
    const valueToSend = isCustom ? customValue : selectedValue;

    if (
      valueToSend !== "" &&
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
      <Typography variant="h6" fontWeight={600} mb={2}>
        Cards per session
      </Typography>

      <List>
        <ListItemButton
          selected={selectedValue === "custom"}
          onClick={() => setSelectedValue("custom")}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 2,
            py: 1,
          }}
        >
          <Typography>Custom</Typography>
          <TextField
            variant="standard"
            placeholder="25"
            value={customValue}
            type="text"
            onChange={(e) => {
              const value = e.target.value;

              if (/^[1-9]\d*$/.test(value) || value === "") {
                const num = value === "" ? "" : Number(value);
                setCustomValue(num);

                if (num !== "" && num > CARDS_PER_SESSION_LIMIT) {
                  setError(
                    `Maximum allowed value is ${CARDS_PER_SESSION_LIMIT}`
                  );
                } else {
                  setError("");
                }
              }
            }}
            onFocus={() => setSelectedValue("custom")}
            sx={{
              flex: 1,
              "& input": {
                textAlign: "right",
                MozAppearance: "textfield",
              },
              "& input::-webkit-outer-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
              "& input::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
            }}
            InputProps={{ disableUnderline: true }}
            inputProps={{
              min: 1,
              step: 1,
            }}
            error={Boolean(error)}
          />
        </ListItemButton>

        <Divider />

        {PREDEFINED_VALUES.map((val, index) => (
          <React.Fragment key={val}>
            <ListItemButton
              selected={selectedValue === val}
              onClick={() => {
                setSelectedValue(val);
                setCustomValue("");
              }}
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
      <Box sx={{ height: "6vh", mt: "2vh" }}>
        {error && (
          <Typography variant="h6" color="error" align="center">
            {error}
          </Typography>
        )}
      </Box>
    </Drawer>
  );
}
