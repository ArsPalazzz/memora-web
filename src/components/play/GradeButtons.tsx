import { Box, Fade, Typography } from "@mui/material";
import { GRADE_COLORS, GRADE_OPTIONS } from "./play.constants";

interface GradeButtonsProps {
  disabled?: boolean;
  onGrade: (quality: number) => void;
}

export function GradeButtons({ disabled = false, onGrade }: GradeButtonsProps) {
  return (
    <Fade in>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {GRADE_OPTIONS.map(({ quality, label }) => (
          <Box
            key={quality}
            onClick={() => {
              if (disabled) return;
              onGrade(quality);
            }}
            sx={{
              flex: 1,
              cursor: disabled ? "not-allowed" : "pointer",
              textAlign: "center",
              py: 1.5,
              position: "relative",
              transition: "background-color 0.2s",
              "&:hover": {
                bgcolor: disabled ? "transparent" : "action.hover",
              },
              opacity: disabled ? 0.6 : 1,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                bgcolor: disabled ? "#9e9e9e" : GRADE_COLORS[quality],
              }}
            />

            <Typography
              variant="body2"
              fontWeight={500}
              sx={{
                fontSize: "1.05rem",
                userSelect: "none",
                color: disabled ? "#9e9e9e" : GRADE_COLORS[quality],
              }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Fade>
  );
}
