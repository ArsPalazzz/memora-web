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
} from "@mui/material";
import { useProtectedRequest } from "@/utils/protected";
import { FullPageLoader } from "./ui/Loader";
import { useMutation } from "@tanstack/react-query";
import { useAnswerCard, useNextCard } from "@/services/games/games.queries";
import { NextCardResponse } from "@/services/games/games.types";
import { startDeskSessionRequest } from "@/services/games/games";

type AnswerResult = {
  isCorrect: boolean;
  finished: boolean;
  correctVariants: string[];
};

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
        px: 2,
        pb: 2,
      }}
    >
      {currentCard && (
        <>
          <Fade in key={currentCard.sub}>
            <Box sx={{ flex: 1, display: "flex" }}>
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
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    px: 3,
                  }}
                >
                  <Typography variant="h4" fontWeight={600}>
                    {currentCard.text.join(", ")}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Fade>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            {result === null ? (
              <>
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
                />

                <Button
                  variant="contained"
                  size="large"
                  disabled={!answer.trim()}
                  onClick={submitAnswer}
                >
                  Check
                </Button>
              </>
            ) : (
              <Fade in>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color={result.isCorrect ? "green" : "red"}
                    mb={1}
                  >
                    {result.isCorrect ? "Correct 🎉" : "Wrong ❌"}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Correct answers: {result.correctVariants.join(", ")}
                  </Typography>

                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    onClick={nextCard}
                  >
                    {result.finished ? "Finish" : "Next"}
                  </Button>
                </Box>
              </Fade>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
