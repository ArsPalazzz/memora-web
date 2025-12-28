"use client";

import { useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { useProtectedRequest } from "@/utils/protected";
import { getCardsToPlayRequest } from "@/services/desk/desk";
import { FullPageLoader } from "./ui/Loader";

export default function PlayDeskPage() {
  const { id: sub } = useParams() as { id: string };
  const router = useRouter();
  const { call } = useProtectedRequest();
  const theme = useTheme();

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const { data: res, isLoading } = useQuery({
    queryKey: ["cards-to-play", sub],
    enabled: !!sub,
    queryFn: () => call((token) => getCardsToPlayRequest(sub, token)),
  });

  const current = res?.cards?.[index];
  const isLast = index === (res?.cards.length ?? 0) - 1;

  if (isLoading || !current) return <FullPageLoader />;

  const question = current.showSide === "front" ? current.front : current.back;
  const correctAnswer =
    current.showSide === "front" ? current.back : current.front;

  function normalize(text: string) {
    return text.trim().toLowerCase().replace(/\s+/g, " ");
  }

  function checkAnswer() {
    setIsCorrect(normalize(answer) === normalize(correctAnswer));
  }

  function nextCard() {
    if (isLast) {
      router.back(); // можно заменить на страницу статистики
      return;
    }

    setAnswer("");
    setIsCorrect(null);
    setIndex((i) => i + 1);
  }

  // const cardColor =
  //   isCorrect === null ? "background.paper" : isCorrect ? "#e8f5e9" : "#fdecea";
  console.log(theme.palette);
  const cardColor =
    isCorrect === null
      ? theme.palette.background.paper
      : isCorrect
      ? theme.palette.successBg
      : theme.palette.errorBg;

  return (
    <>
      {/* MAIN LAYOUT */}
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          px: 2,
          pb: 2,
        }}
      >
        {/* Progress */}
        <Typography textAlign="center" color="text.secondary" mt={2} mb={2}>
          {index + 1} / {res.cards.length}
        </Typography>

        {/* CARD */}
        <Fade in key={index}>
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
                  {question}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Fade>

        {/* INPUT + CHECK */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            disabled={isCorrect !== null}
            placeholder="Type your answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isCorrect === null && answer.trim()) {
                checkAnswer();
              }
            }}
          />

          <Button
            variant="contained"
            size="large"
            disabled={!answer.trim()}
            onClick={checkAnswer}
          >
            Check
          </Button>
        </Box>
      </Box>

      {/* RESULT OVERLAY */}
      <Fade in={isCorrect !== null}>
        <Box
          sx={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1300,
            p: 2,
            pb: 3,
            bgcolor: "background.default",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            color={isCorrect ? "green" : "red"}
            mb={1}
          >
            {isCorrect ? "Correct 🎉" : "Wrong ❌"}
          </Typography>

          {!isCorrect && (
            <Typography mb={2}>
              Correct answer: <b>{correctAnswer}</b>
            </Typography>
          )}

          <Button fullWidth size="large" variant="contained" onClick={nextCard}>
            {isLast ? "Finish" : "Next"}
          </Button>
        </Box>
      </Fade>
    </>
  );
}
