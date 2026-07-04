import { Box, LinearProgress, Typography } from "@mui/material";
import { ReactNode } from "react";
import { VIEWPORT_SHELL_SX, VIEWPORT_TOP_SAFE_PADDING } from "../layout/viewport.constants";

interface PlaySessionShellProps {
  current?: number;
  total?: number;
  children: ReactNode;
  /** When true, fills parent flex area instead of locking to 100dvh (feed with header/nav). */
  nested?: boolean;
}

export function PlaySessionShell({
  current,
  total,
  children,
  nested = false,
}: PlaySessionShellProps) {
  const showProgress = current !== undefined && total !== undefined && total > 0;

  return (
    <Box
      sx={{
        ...(nested
          ? {
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }
          : {
              ...VIEWPORT_SHELL_SX,
              pb: 2,
              pt: VIEWPORT_TOP_SAFE_PADDING,
              boxSizing: "border-box",
            }),
      }}
    >
      {showProgress && (
        <Box sx={{ px: 3, mb: 2, flexShrink: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {current} / {total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round((current / total) * 100)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(current / total) * 100}
            sx={{
              height: 9,
              borderRadius: 8,
              backgroundColor: "grey.200",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "primary.main",
                borderRadius: 4,
              },
            }}
          />
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
