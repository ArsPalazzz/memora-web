import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PaletteIcon from "@mui/icons-material/Palette";
import React, { useRef, useState } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import {
  ACCENT_PRESETS,
  parseColorInput,
} from "@/theme/accentColor";
import { AccentColorModalProps } from "./FeedSettings.types";
import { AccentColorPicker } from "./AccentColorPicker";
import { bottomSheetSlotProps } from "@/components/layout/overlay.constants";

function ColorSwatch({
  color,
  selected,
  onClick,
  label,
}: {
  color: string;
  selected?: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <Box
      component="button"
      type="button"
      aria-label={label ?? color}
      onClick={onClick}
      sx={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "2px solid",
        borderColor: selected ? "text.primary" : "divider",
        bgcolor: color,
        cursor: "pointer",
        p: 0,
        position: "relative",
        flexShrink: 0,
        boxShadow: selected ? 2 : 0,
      }}
    >
      {selected && (
        <CheckIcon
          sx={{
            position: "absolute",
            inset: 0,
            m: "auto",
            color: "#fff",
            fontSize: 20,
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.45))",
          }}
        />
      )}
    </Box>
  );
}

export default function AccentColorModal({ onClose }: AccentColorModalProps) {
  const {
    accentColor,
    savedAccentColors,
    setAccentColor,
    removeSavedAccentColor,
  } = useThemeContext();
  const [customInput, setCustomInput] = useState(accentColor);
  const [inputError, setInputError] = useState<string | null>(null);
  const lastValidPickerColorRef = useRef(accentColor);

  const applyColor = (color: string, save = true) => {
    setAccentColor(color, { save });
    setCustomInput(color);
    setInputError(null);
  };

  const handleApplyCustom = () => {
    const parsed = parseColorInput(customInput);
    if (!parsed) {
      setInputError("Use #RRGGBB or rgb(r, g, b)");
      return;
    }

    if (parsed === accentColor) {
      return;
    }

    applyColor(parsed, true);
  };

  const parsedCustomColor = parseColorInput(customInput);
  if (parsedCustomColor) {
    lastValidPickerColorRef.current = parsedCustomColor;
  }
  const pickerColor = parsedCustomColor ?? lastValidPickerColorRef.current;
  const canApplyCustom =
    parsedCustomColor !== null && parsedCustomColor !== accentColor;

  const handlePickerChange = (hex: string) => {
    setCustomInput(hex);
    if (inputError) {
      setInputError(null);
    }
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
          px: 2.5,
          pt: 2,
          pb: 2.5,
          maxHeight: "72vh",
          overflowY: "auto",
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
        <PaletteIcon color="primary" sx={{ fontSize: 22 }} />
        <Typography variant="h6" fontWeight={600} flex={1} sx={{ fontSize: "1.05rem" }}>
          Accent color
        </Typography>
        <IconButton aria-label="Close" onClick={onClose} edge="end" size="small">
          <CloseIcon />
        </IconButton>
      </Stack>

      <Typography variant="body2" color="text.secondary" mb={1}>
        Palette
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: 1,
          mb: 1.5,
        }}
      >
        {ACCENT_PRESETS.map((preset) => (
          <Stack key={preset.value} alignItems="center" spacing={0.5}>
            <ColorSwatch
              color={preset.value}
              selected={accentColor === preset.value}
              label={preset.name}
              onClick={() => applyColor(preset.value, true)}
            />
            <Typography variant="caption" color="text.secondary" noWrap>
              {preset.name}
            </Typography>
          </Stack>
        ))}
      </Box>

      {savedAccentColors.length > 0 && (
        <>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="body2" color="text.secondary" mb={1}>
            Saved
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
            {savedAccentColors.map((color) => (
              <Box key={color} sx={{ position: "relative" }}>
                <ColorSwatch
                  color={color}
                  selected={accentColor === color}
                  onClick={() => applyColor(color, false)}
                />
                <IconButton
                  size="small"
                  aria-label={`Remove ${color}`}
                  onClick={() => removeSavedAccentColor(color)}
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    width: 22,
                    height: 22,
                    bgcolor: "background.paper",
                    border: 1,
                    borderColor: "divider",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        </>
      )}

      <Divider sx={{ my: 1.5 }} />

      <Typography variant="body2" color="text.secondary" mb={1}>
        Custom color
      </Typography>

      <AccentColorPicker color={pickerColor} onChange={handlePickerChange} />

      <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mt: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: pickerColor,
            border: 1,
            borderColor: "divider",
            flexShrink: 0,
          }}
        />
        <TextField
          fullWidth
          size="small"
          label="Hex or RGB"
          placeholder="#5961d3 or rgb(89, 97, 211)"
          value={customInput}
          error={Boolean(inputError)}
          helperText={
            inputError ??
            (canApplyCustom ? " " : "Adjust the picker or enter hex / rgb")
          }
          onChange={(event) => {
            setCustomInput(event.target.value);
            if (inputError) {
              setInputError(null);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && canApplyCustom) {
              handleApplyCustom();
            }
          }}
        />
      </Stack>

      <Button
        variant="contained"
        fullWidth
        disabled={!canApplyCustom}
        sx={{ mt: 1.5 }}
        onClick={handleApplyCustom}
      >
        Apply custom color
      </Button>
    </Drawer>
  );
}
