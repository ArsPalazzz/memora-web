import { Box, Button, Card, CardContent, Fade, Typography, useTheme } from "@mui/material";
import { NextCardResponse, RevealResult } from "@/services/games/games.types";
import { GradeButtons } from "./GradeButtons";

interface RevealModeViewProps {
  currentCard: NextCardResponse;
  result: RevealResult | null;
  isRevealing: boolean;
  isGrading: boolean;
  onReveal: () => void;
  onGrade: (quality: number) => void;
}

export function RevealModeView({
  currentCard,
  result,
  isRevealing,
  isGrading,
  onReveal,
  onGrade,
}: RevealModeViewProps) {
  const theme = useTheme();
  const revealed = result !== null;

  return (
    <>
      <Fade in key={currentCard.card.sub}>
        <Box sx={{ flex: 1, minHeight: 0, display: "flex", px: 2 }}>
          <Card
            sx={{
              flex: 1,
              display: "flex",
              bgcolor: theme.palette.background.paper,
              boxShadow: 4,
              borderRadius: 3,
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
              <Typography variant="h4" fontWeight={600}>
                {currentCard.card.text.join(", ")}
              </Typography>

              {revealed && (
                <Fade in>
                  <Box sx={{ width: "100%" }}>
                    <Box
                      sx={{
                        height: "1px",
                        width: "40%",
                        mx: "auto",
                        mb: 2,
                        bgcolor: "divider",
                      }}
                    />
                    <Typography variant="h5" fontWeight={500} color="text.primary">
                      {result.answerVariants.join(", ")}
                    </Typography>

                    {result.examples.length > 0 && (
                      <Box sx={{ mt: 3, textAlign: "left", width: "100%" }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={600}
                          sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                        >
                          Examples
                        </Typography>
                        {result.examples.map((example, index) => (
                          <Typography
                            key={index}
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {example}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Fade>
              )}
            </CardContent>
          </Card>
        </Box>
      </Fade>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
          mb: 2,
          px: 2,
        }}
      >
        {!revealed ? (
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={onReveal}
            disabled={isRevealing}
            sx={{ height: 48 }}
          >
            Show answer
          </Button>
        ) : (
          <GradeButtons disabled={isGrading} onGrade={onGrade} />
        )}
      </Box>
    </>
  );
}
