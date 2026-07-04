import {
  Box,
  Card,
  CardContent,
  Fade,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { NextCardResponse } from "@/services/games/games.types";
import { GradeButtons } from "./GradeButtons";
import { AnswerResult } from "./play.constants";
import { CardPromptWithSpeak } from "./CardPromptWithSpeak";
import { SpeakButton } from "@/components/ui/SpeakButton";
import {
  DEFAULT_BACK_LANGUAGE,
  DEFAULT_FRONT_LANGUAGE,
} from "@/constants/language.const";

interface WriteModeViewProps {
  currentCard: NextCardResponse;
  answer: string;
  result: AnswerResult | null;
  isAnswering: boolean;
  isGrading: boolean;
  onAnswerChange: (value: string) => void;
  onSubmitAnswer: () => void;
  onGrade: (quality: number) => void;
}

export function WriteModeView({
  currentCard,
  answer,
  result,
  isAnswering,
  isGrading,
  onAnswerChange,
  onSubmitAnswer,
  onGrade,
}: WriteModeViewProps) {
  const theme = useTheme();
  const promptLanguage =
    currentCard.card.promptLanguage ?? DEFAULT_FRONT_LANGUAGE;
  const answerLanguage =
    currentCard.card.answerLanguage ?? DEFAULT_BACK_LANGUAGE;

  const cardColor =
    result === null
      ? theme.palette.background.paper
      : result.isCorrect
        ? theme.palette.successBg
        : theme.palette.errorBg;

  return (
    <>
      <Fade in key={currentCard.card.sub}>
        <Box sx={{ flex: 1, minHeight: 0, display: "flex", px: 2 }}>
          <Card
            sx={{
              flex: 1,
              display: "flex",
              bgcolor: cardColor,
              transition: "background-color 0.3s",
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
              }}
            >
              <CardPromptWithSpeak
                text={currentCard.card.text}
                language={promptLanguage}
              />

              {result !== null && (
                <Box sx={{ height: 48, width: "100%", mt: 2 }}>
                  <Fade in={result !== null}>
                    <Box>
                      <Box
                        sx={{
                          height: "1px",
                          width: "40%",
                          mx: "auto",
                          mb: 1,
                          bgcolor: "divider",
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.5,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.95rem" }}
                        >
                          {result.correctVariants.join(", ")}
                        </Typography>
                        <SpeakButton
                          text={result.correctVariants}
                          language={answerLanguage}
                          label="Listen to answer"
                          variant="compact"
                        />
                      </Box>
                    </Box>
                  </Fade>
                </Box>
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
        {result === null ? (
          <TextField
            fullWidth
            placeholder="Type your answer"
            value={answer}
            onChange={(event) => onAnswerChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && answer.trim()) {
                onSubmitAnswer();
              }
            }}
            sx={{
              "& .MuiInputBase-root": {
                height: 48,
                minHeight: 48,
                px: 2,
                display: "flex",
                alignItems: "center",
              },
              "& .MuiInputBase-input": {
                padding: 0,
                height: "100%",
                display: "flex",
                alignItems: "center",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={onSubmitAnswer}
                    disabled={!answer.trim() || isAnswering}
                  >
                    <ArrowForwardIosIcon
                      fontSize="small"
                      color={answer.trim() && !isAnswering ? "primary" : "disabled"}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        ) : (
          <GradeButtons disabled={isGrading} onGrade={onGrade} />
        )}
      </Box>
    </>
  );
}
