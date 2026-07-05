
import { Box, IconButton, Typography } from "@mui/material";
import React, { useCallback, useRef } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { APP_HEADER_HEIGHT } from "./header.constants";
import { APP_HEADER_Z_INDEX } from "./overlay.constants";

export { APP_HEADER_HEIGHT };

export default function Header({
  title,
  onBack,
  RightButton,
}: {
  title: string;
  onBack?: () => void;
  RightButton?: React.ReactNode;
}) {
  const backHandledRef = useRef(false);

  const handleBack = useCallback(
    (event: React.SyntheticEvent) => {
      if (!onBack) return;

      event.preventDefault();
      event.stopPropagation();

      if (backHandledRef.current) return;
      backHandledRef.current = true;
      onBack();

      window.setTimeout(() => {
        backHandledRef.current = false;
      }, 400);
    },
    [onBack]
  );

  return (
    <>
      <Box
        component="header"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "primary.main",
          width: "100%",
          height: APP_HEADER_HEIGHT,
          pt: "env(safe-area-inset-top, 0px)",
          pb: 1,
          px: 2,
          zIndex: APP_HEADER_Z_INDEX,
          isolation: "isolate",
          touchAction: "manipulation",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
          {onBack && (
            <IconButton
              onPointerUp={handleBack}
              aria-label="Go back"
              sx={{
                pointerEvents: "auto",
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
                mr: 0.5,
                flexShrink: 0,
              }}
            >
              <ArrowBackIcon sx={{ color: "white", fontSize: 30 }} />
            </IconButton>
          )}
          <Typography variant="h5" color="white" noWrap>
            {title}
          </Typography>
        </Box>

        {RightButton}
      </Box>

      <Box aria-hidden sx={{ height: APP_HEADER_HEIGHT, flexShrink: 0 }} />
    </>
  );
}
