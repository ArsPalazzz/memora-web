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
import React, { useState } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import {
  ACCENT_PRESETS,
  parseColorInput,
} from "@/theme/accentColor";
import { AccentColorModalProps } from "./FeedSettings.types";
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
        width: 44,
        height: 44,
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

    applyColor(parsed, true);
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
          p: 3,
          maxHeight: "85vh",
          overflowY: "auto",
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <PaletteIcon color="primary" />
        <Typography variant="h6" fontWeight={600} flex={1}>
          Accent color
        </Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary" mb={1.5}>
        Palette
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: 1.5,
          mb: 2,
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
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary" mb={1.5}>
            Saved
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
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

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" color="text.secondary" mb={1.5}>
        Custom color
      </Typography>
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: parseColorInput(customInput) ?? accentColor,
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
          helperText={inputError ?? " "}
          onChange={(event) => {
            setCustomInput(event.target.value);
            if (inputError) {
              setInputError(null);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleApplyCustom();
            }
          }}
        />
      </Stack>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 1 }}
        onClick={handleApplyCustom}
      >
        Apply & save
      </Button>
    </Drawer>
  );
}
