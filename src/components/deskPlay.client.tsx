"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Fade,
  useTheme,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useProtectedRequest } from "@/utils/protected";
import { FullPageLoader } from "./ui/Loader";
import { useMutation } from "@tanstack/react-query";
import { useAnswerCard, useNextCard } from "@/services/games/games.queries";
import { NextCardResponse } from "@/services/games/games.types";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  gradeCardRequest,
  startDeskSessionRequest,
} from "@/services/games/games";

type AnswerResult = {
  isCorrect: boolean;
  finished: boolean;
  correctVariants: string[];
};

const GRADE_COLORS: Record<number, string> = {
  0: "#e53935",
  1: "#fb8c00",
  2: "#fbc02d",
  3: "#43a047",
  4: "#2e7d32",
};

const GRADE_OPTIONS = [
  { quality: 0, label: "Forgot" },
  { quality: 1, label: "Hard" },
  { quality: 2, label: "Okay" },
  { quality: 3, label: "Good" },
  { quality: 4, label: "Easy" },
] as const;

export default function PlayDeskPage() {
  const params = useParams() as { id: string };
  const deskSub = params.id;

  const router = useRouter();
  const theme = useTheme();
  const { call } = useProtectedRequest();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<AnswerResult | null>(null);

  const [currentCard, setCurrentCard] = useState<NextCardResponse | null>(null);
  const [cardLoading, setCardLoading] = useState<boolean>(false);

  const [token, setToken] = useState<string | null>(null);
  const startedRef = useRef(false);

  const nextCardMutation = useNextCard();
  const answerMutation = useAnswerCard();

  const startSessionMutation = useMutation({
    mutationFn: async (deskSub: string) => {
      return await call((token) => startDeskSessionRequest(deskSub, token));
    },
    onSuccess: (res) => setSessionId(res.sessionId),
    onError: (err) => console.log("ERROR", err),
  });

  const handleStartSession = () => {
    startSessionMutation.mutate(deskSub);
  };

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    handleStartSession();
  }, [deskSub]);

  useEffect(() => {
    if (!sessionId) return;
    setCardLoading(true);
    nextCardMutation.mutate(sessionId, {
      onSuccess: (res) => {
        setCurrentCard(res);
        setCardLoading(false);
      },
    });
  }, [sessionId]);

  const submitAnswer = () => {
    if (!sessionId || !answer.trim()) return;

    answerMutation.mutate(
      { sessionId, answer },
      {
        onSuccess: (res) => {
          setResult(res);
        },
      }
    );
  };

  const gradeMutation = useMutation({
    mutationFn: ({
      sessionId,
      quality,
    }: {
      sessionId: string;
      quality: number;
    }) => call((token) => gradeCardRequest({ sessionId, quality }, token)),
  });

  const submitGrade = (quality: number) => {
    if (!sessionId) return;

    gradeMutation.mutate(
      { sessionId, quality },
      {
        onSuccess: () => {
          nextCard();
        },
      }
    );
  };

  const nextCard = async () => {
    if (!sessionId) return;

    if (result?.finished) {
      router.push(`/desk/${deskSub}`);
      return;
    }

    setAnswer("");
    setResult(null);
    setCardLoading(true);
    nextCardMutation.mutate(sessionId, {
      onSuccess: (res) => {
        setCurrentCard(res);
        setCardLoading(false);
      },
    });
  };

  useEffect(() => {
    call((token) => {
      setToken(token);
      return Promise.resolve();
    });
  }, []);

  useEffect(() => {
    return () => {
      if (!sessionId || result?.finished || !token) return;

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/games/finish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId }),
        keepalive: true,
      });
    };
  }, []);

  if (cardLoading && !currentCard) return <FullPageLoader />;

  const cardColor =
    result === null
      ? theme.palette.background.paper
      : result.isCorrect
      ? theme.palette.successBg
      : theme.palette.errorBg;

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        pb: 2,
        pt: 2,
      }}
    >
      {currentCard && (
        <>
          <Fade in key={currentCard.sub}>
            <Box sx={{ flex: 1, display: "flex", px: 2 }}>
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
                  <Typography variant="h4" fontWeight={600}>
                    {currentCard.text.join(", ")}
                  </Typography>

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
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.95rem" }}
                        >
                          {result?.correctVariants.join(", ")}
                        </Typography>
                      </Box>
                    </Fade>
                  </Box>
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
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && answer.trim()) {
                    submitAnswer();
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
                        onClick={submitAnswer}
                        disabled={!answer.trim()}
                      >
                        <ArrowForwardIosIcon
                          fontSize="small"
                          color={answer.trim() ? "primary" : "disabled"}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ) : (
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
                      onClick={() => submitGrade(quality)}
                      sx={{
                        flex: 1,
                        cursor: "pointer",
                        textAlign: "center",
                        py: 1.5,
                        position: "relative",
                        transition: "background-color 0.2s",
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 4,
                          bgcolor: GRADE_COLORS[quality],
                        }}
                      />

                      <Typography
                        variant="body2"
                        fontWeight={500}
                        sx={{
                          fontSize: "1.05rem",
                          userSelect: "none",
                          color: GRADE_COLORS[quality],
                        }}
                      >
                        {label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Fade>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
