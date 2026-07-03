
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "@/theme/theme";
import { useThemeContext } from "@/context/ThemeContext";
import React from "react";

export const InnerThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { mode } = useThemeContext();
  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
