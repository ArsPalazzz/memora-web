import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "@/theme/theme";
import { useThemeContext } from "@/context/ThemeContext";
import React, { useMemo } from "react";

export const InnerThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { mode, accentColor } = useThemeContext();
  const theme = useMemo(
    () => getTheme(mode, accentColor),
    [mode, accentColor]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
