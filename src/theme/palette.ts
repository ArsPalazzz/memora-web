import { PaletteMode } from "@mui/material";
import { buildPrimaryPalette, DEFAULT_ACCENT_COLOR } from "./accentColor";

const createBasePalette = (
  mode: PaletteMode,
  accentColor: string = DEFAULT_ACCENT_COLOR
) => ({
  mode,
  primary: buildPrimaryPalette(accentColor, mode),
  secondary: {
    main: "#6C757D",
  },
});

export const getLightPalette = (accentColor?: string) => ({
  ...createBasePalette("light", accentColor),
  background: {
    default: "#F8F9FA",
    paper: "#FFFFFF",
  },
  text: {
    primary: "#212529",
    secondary: "#6C757D",
  },
  successBg: "#e8f5e9",
  errorBg: "#fdecea",
});

export const getDarkPalette = (accentColor?: string) => ({
  ...createBasePalette("dark", accentColor),
  background: {
    default: "#1a191b",
    paper: "#1E1E1E",
  },
  text: {
    primary: "#fff",
    secondary: "#aaaaaa",
  },
  successBg: "#2e7d32",
  errorBg: "#c62828",
});

/** @deprecated use getLightPalette */
export const lightPalette = getLightPalette();

/** @deprecated use getDarkPalette */
export const darkPalette = getDarkPalette();
