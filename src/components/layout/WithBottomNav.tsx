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
        pb: {
          xs: "calc(56px + env(safe-area-inset-bottom, 0px))",
          md: 7,
        },
      }}
    >
      {children}
      <BottomNav />
    </Box>
  );
}
