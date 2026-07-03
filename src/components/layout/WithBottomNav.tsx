
import { Box } from "@mui/material";
import BottomNav from "./BottomNav";
import { ReactNode } from "react";
import { BOTTOM_NAV_HEIGHT } from "./bottom-nav.constants";

interface WithBottomNavProps {
  children: ReactNode;
}

export default function WithBottomNav({ children }: WithBottomNavProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          WebkitOverflowScrolling: "touch",
          pb: {
            xs: BOTTOM_NAV_HEIGHT,
            md: 7,
          },
        }}
      >
        {children}
      </Box>
      <BottomNav />
    </Box>
  );
}
