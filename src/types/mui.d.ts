import type {} from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    successBg: string;
    errorBg: string;
  }
  interface PaletteOptions {
    successBg?: string;
    errorBg?: string;
  }
}
