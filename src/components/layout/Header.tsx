
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Header({
  title,
  onBack,
  RightButton,
}: {
  title: string;
  onBack?: () => void;
  RightButton?: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        display: "flex",
        justifyContent: "space-between",
        bgcolor: "primary.main",
        width: "100%",
        pt: 2,
        pb: 1,
        px: 2,
        zIndex: 10,
        height: "8vh",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {onBack && (
          <IconButton onClick={onBack}>
            <ArrowBackIcon sx={{ color: "white", fontSize: 30 }} />
          </IconButton>
        )}
        <Typography variant="h5" color="white">
          {title}
        </Typography>
      </Box>

      {RightButton}
    </Box>
  );
}
