import {
  Box,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { motion } from "framer-motion";
import { CardPromptWithSpeak } from "@/components/play/CardPromptWithSpeak";
import { CardImage } from "@/components/ui/CardImage";
import { PlaySessionShell } from "@/components/play/PlaySessionShell";
import { OpponentTrack } from "@/components/duel/OpponentTrack";
import { DuelRaceDisconnectBanner } from "@/components/duel/DuelRaceDisconnectBanner";
import type { DuelRacePayload } from "@/services/games/duel.types";
import type { DuelScoreState } from "@/utils/duelScoring";
import type { OpponentTrackPlayer } from "@/components/duel/OpponentTrack";
import {
  DEFAULT_FRONT_LANGUAGE,
  type LanguageCode,
} from "@/constants/language.const";

interface DuelRaceViewProps {
  payload: DuelRacePayload;
  currentCard: DuelRacePayload["cards"][number] | null;
  cardIndex: number;
  cardCount: number;
  cardTimerMs: number;
  scoreState: DuelScoreState;
  answer: string;
  setAnswer: (value: string) => void;
  submitAnswer: () => void;
  inputLocked: boolean;
  shake: boolean;
  meTrack: OpponentTrackPlayer;
  opponentTrack: OpponentTrackPlayer | null;
  disconnectBanner: {
    selfReconnecting: boolean;
    graceRemainingMs: number;
    nickname: string;
  } | null;
}

export function DuelRaceView({
  payload,
  currentCard,
  cardIndex,
  cardCount,
  cardTimerMs,
  scoreState,
  answer,
  setAnswer,
  submitAnswer,
  inputLocked,
  shake,
  meTrack,
  opponentTrack,
  disconnectBanner,
}: DuelRaceViewProps) {
  const theme = useTheme();

  if (!currentCard) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
        }}
      >
        <Typography color="text.secondary">Finishing race…</Typography>
      </Box>
    );
  }

  const promptLanguage = (currentCard.promptLanguage ??
    DEFAULT_FRONT_LANGUAGE) as LanguageCode;
  const cardSeconds = (cardTimerMs / 1000).toFixed(1);

  return (
    <PlaySessionShell
      current={Math.min(cardIndex + 1, cardCount)}
      total={cardCount}
      nested
    >
      {disconnectBanner && (
        <DuelRaceDisconnectBanner
          nickname={disconnectBanner.nickname}
          graceRemainingMs={disconnectBanner.graceRemainingMs}
          selfReconnecting={disconnectBanner.selfReconnecting}
        />
      )}

      <OpponentTrack me={meTrack} opponent={opponentTrack} />

      <Box
        sx={{
          px: 2,
          py: 0.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          minHeight: 36,
        }}
      >
        <Typography variant="subtitle2" fontWeight={800}>
          {scoreState.score} pts
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <LocalFireDepartmentIcon
            sx={{
              fontSize: 18,
              color:
                scoreState.currentStreak >= 3 ? "warning.main" : "text.disabled",
            }}
          />
          <Typography variant="subtitle2" fontWeight={700}>
            {scoreState.currentStreak}
          </Typography>
        </Box>

        {payload.config.showLiveProgress !== false ? (
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 40, textAlign: "right" }}>
            {cardSeconds}s
          </Typography>
        ) : (
          <Box sx={{ minWidth: 40 }} />
        )}
      </Box>

      <motion.div
        animate={shake ? { x: [0, -10, 10, -8, 8, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
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
                py: 2,
              }}
            >
              <CardPromptWithSpeak
                text={currentCard.text}
                language={promptLanguage}
              />
              <CardImage url={currentCard.image_url} size="study" />
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ px: 2, mt: 2, mb: 2, flexShrink: 0 }}>
          <TextField
            fullWidth
            placeholder={
              inputLocked ? "Wrong — wait…" : "Type your answer"
            }
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && answer.trim() && !inputLocked) {
                submitAnswer();
              }
            }}
            disabled={inputLocked}
            sx={{
              "& .MuiInputBase-root": {
                height: 48,
                minHeight: 48,
                px: 2,
                display: "flex",
                alignItems: "center",
                bgcolor: inputLocked ? "action.hover" : "background.paper",
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
                    onClick={submitAnswer}
                    disabled={!answer.trim() || inputLocked}
                  >
                    <ArrowForwardIosIcon
                      fontSize="small"
                      color={
                        answer.trim() && !inputLocked ? "primary" : "disabled"
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </motion.div>
    </PlaySessionShell>
  );
}
