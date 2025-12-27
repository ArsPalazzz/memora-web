import { PaletteMode } from "@mui/material";

export const lightPalette = {
  mode: "light" as PaletteMode,
  primary: {
    main: "#5961d3",
    contrastText: "#fff",
  },
  secondary: {
    main: "#6C757D",
  },
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
};

export const darkPalette = {
  mode: "dark" as PaletteMode,
  primary: {
    main: "#5961d3",
    contrastText: "#fff",
  },
  secondary: {
    main: "#6C757D",
  },
  background: {
    default: "#121212",
    paper: "#1E1E1E",
  },
  text: {
    primary: "#fff",
    secondary: "#aaaaaa",
  },
  successBg: "#2e7d32",
  errorBg: "#c62828",
};
