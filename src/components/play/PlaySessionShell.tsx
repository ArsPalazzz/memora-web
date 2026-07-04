import { Box, LinearProgress, Typography } from "@mui/material";
import { ReactNode } from "react";
import { VIEWPORT_SHELL_SX, VIEWPORT_TOP_SAFE_PADDING } from "../layout/viewport.constants";

interface PlaySessionShellProps {
  current?: number;
  total?: number;
  children: ReactNode;
}

export function PlaySessionShell({ current, total, children }: PlaySessionShellProps) {
  const showProgress = current !== undefined && total !== undefined && total > 0;

  return (
    <Box
      sx={{
        ...VIEWPORT_SHELL_SX,
        pb: 2,
        pt: VIEWPORT_TOP_SAFE_PADDING,
        boxSizing: "border-box",
      }}
    >
      {showProgress && (
        <Box sx={{ px: 3, mb: 2 }}>
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

      {children}
    </Box>
  );
}
