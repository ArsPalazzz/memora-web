import { createTheme } from "@mui/material/styles";
import { DEFAULT_ACCENT_COLOR } from "./accentColor";
import { getDarkPalette, getLightPalette } from "./palette";
import { typography } from "./typography";

export const getTheme = (
  mode: "light" | "dark",
  accentColor: string = DEFAULT_ACCENT_COLOR
) => {
  const palette =
    mode === "light"
      ? getLightPalette(accentColor)
      : getDarkPalette(accentColor);

  return createTheme({
    palette,
    typography,
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 10,
            fontWeight: 600,
          },
        },
      },
    },
  });
};
