import { Box, Card, CardContent, Typography } from "@mui/material";
import { GradeButtons } from "./GradeButtons";
import { MatchBoardCard } from "@/services/games/games.types";

interface MatchGradingViewProps {
  card: MatchBoardCard;
  gradingIndex: number;
  total: number;
  isGrading: boolean;
  onGrade: (quality: number) => void;
}

export function MatchGradingView({
  card,
  gradingIndex,
  total,
  isGrading,
  onGrade,
}: MatchGradingViewProps) {
  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        px: 2,
        pb: 2,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        fontWeight={600}
        sx={{ mb: 2, textAlign: "center" }}
      >
        Card {gradingIndex + 1} / {total}
      </Typography>

      <Card
        sx={{
          flex: 1,
          display: "flex",
          boxShadow: 4,
          borderRadius: 3,
          mb: 2,
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 3,
            gap: 2,
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            {card.front.join(", ")}
          </Typography>
          <Box
            sx={{
              height: "1px",
              width: "40%",
              bgcolor: "divider",
            }}
          />
          <Typography variant="h6" fontWeight={500} color="text.primary">
            {card.backVariants.join(", ")}
          </Typography>
        </CardContent>
      </Card>

      <GradeButtons disabled={isGrading} onGrade={onGrade} />
    </Box>
  );
}
