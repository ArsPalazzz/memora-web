import { createTheme } from "@mui/material/styles";
import { darkPalette, lightPalette } from "./palette";
import { typography } from "./typography";

// export const theme = createTheme({
//   palette,
//   typography,
//   shape: {
//     borderRadius: 12,
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: "none",
//           borderRadius: 10,
//           fontWeight: 600,
//         },
//       },
//     },
//   },
// });

export const getTheme = (mode: "light" | "dark") => {
  const palette = mode === "light" ? lightPalette : darkPalette;

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
