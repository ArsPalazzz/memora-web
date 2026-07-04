import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { motion } from "framer-motion";
import { MatchBoardCard } from "@/services/games/games.types";

interface MatchResultsViewProps {
  cards: MatchBoardCard[];
  resultByCard: Map<string, boolean>;
  correctCount: number;
  total: number;
  onContinue: () => void;
}

export function MatchResultsView({
  cards,
  resultByCard,
  correctCount,
  total,
  onContinue,
}: MatchResultsViewProps) {
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
      <Box sx={{ textAlign: "center", mb: 2, mt: 1, flexShrink: 0 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {correctCount} of {total} matched
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review below, then rate each card for spaced repetition.
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {cards.map((card, index) => {
          const isCorrect = resultByCard.get(card.sub) ?? false;

          return (
            <motion.div
              key={card.sub}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  borderColor: isCorrect ? "success.light" : "divider",
                }}
              >
                <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    {isCorrect ? (
                      <CheckCircleOutlineIcon sx={{ color: "success.main", mt: 0.25 }} />
                    ) : (
                      <RadioButtonUncheckedIcon sx={{ color: "text.secondary", mt: 0.25 }} />
                    )}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {card.front.join(", ")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {card.backVariants.join(", ")}
                      </Typography>
                      {!isCorrect && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                          Different match selected
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </Box>

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={onContinue}
        sx={{ mt: 2, minHeight: 48, flexShrink: 0 }}
      >
        Continue to grading
      </Button>
    </Box>
  );
}
