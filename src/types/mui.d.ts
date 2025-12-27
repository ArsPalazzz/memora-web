import { Palette, PaletteOptions } from "@mui/material/styles/createPalette";

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
