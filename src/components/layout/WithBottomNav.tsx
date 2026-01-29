"use client";

import { Box } from "@mui/material";
import BottomNav from "./BottomNav";
import { ReactNode } from "react";

interface WithBottomNavProps {
  children: ReactNode;
}

export default function WithBottomNav({ children }: WithBottomNavProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          pb: {
            xs: "56px",
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
