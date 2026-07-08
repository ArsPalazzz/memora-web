import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BoltIcon from "@mui/icons-material/Bolt";
import { motion } from "framer-motion";
import type { DuelRaceCardComparison } from "@/services/games/duel.types";
import { formatRaceDuration } from "@/utils/duelResults.utils";

interface DuelCardBreakdownProps {
  cards: DuelRaceCardComparison[];
  mySub: string;
  opponentSub: string | undefined;
}

function ResultChip({ correct }: { correct: boolean }) {
  return correct ? (
    <CheckCircleIcon sx={{ fontSize: 18, color: "success.main" }} />
  ) : (
    <CancelIcon sx={{ fontSize: 18, color: "error.main" }} />
  );
}

export function DuelCardBreakdown({
  cards,
  mySub,
  opponentSub,
}: DuelCardBreakdownProps) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>
        Card by card
      </Typography>

      <Stack spacing={1.25}>
        {cards.map((card, index) => {
          const myAnswer = card.players[mySub];
          const opponentAnswer = opponentSub ? card.players[opponentSub] : undefined;
          const prompt = card.prompt[0] ?? `Card ${card.cardIndex + 1}`;

          let fasterLabel: string | null = null;
          if (myAnswer && opponentAnswer) {
            if (myAnswer.durationMs < opponentAnswer.durationMs) {
              fasterLabel = "You";
            } else if (opponentAnswer.durationMs < myAnswer.durationMs) {
              fasterLabel = "Opponent";
            } else {
              fasterLabel = "Tie";
            }
          }

          return (
            <motion.div
              key={card.cardSub}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
            >
              <Card variant="outlined">
                <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Typography variant="body2" fontWeight={700} gutterBottom noWrap>
                    {prompt}
                  </Typography>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        You
                      </Typography>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        {myAnswer ? (
                          <>
                            <ResultChip correct={myAnswer.correct} />
                            <Typography variant="body2">
                              {formatRaceDuration(myAnswer.durationMs)}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="body2" color="text.disabled">
                            —
                          </Typography>
                        )}
                      </Stack>
                    </Box>

                    {opponentSub && (
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Opponent
                        </Typography>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          {opponentAnswer ? (
                            <>
                              <ResultChip correct={opponentAnswer.correct} />
                              <Typography variant="body2">
                                {formatRaceDuration(opponentAnswer.durationMs)}
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="body2" color="text.disabled">
                              —
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                    )}

                    {fasterLabel && (
                      <Chip
                        size="small"
                        icon={<BoltIcon sx={{ fontSize: "16px !important" }} />}
                        label={fasterLabel}
                        variant="outlined"
                        color={fasterLabel === "You" ? "success" : "default"}
                      />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </Stack>
    </Box>
  );
}
