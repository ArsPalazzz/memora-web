import { Celebration, CheckCircle, Star } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Typography,
} from "@mui/material";
import Confetti from "react-confetti";
import { useState } from "react";

export const DailyStreakCard = ({
  streak,
  cardsReviewedToday,
  dailyGoal,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => {
  const isGoalCompleted = cardsReviewedToday >= dailyGoal;
  const progress = Math.min(cardsReviewedToday / dailyGoal, 1);

  const [celebrate, setCelebrate] = useState(false);

  return (
    <Card
      sx={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        cursor: isGoalCompleted ? "pointer" : "default",
        border: isGoalCompleted ? "3px solid gold" : "2px solid",
        borderColor: "primary.main",
        bgcolor: "background.paper",
        position: "relative",
        overflow: "hidden",
        transform: isGoalCompleted ? "translateY(-2px)" : "none",
        transition: "all 0.3s",
      }}
      onClick={() => {
        if (!isGoalCompleted) return;

        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 3000);
      }}
    >
      {isGoalCompleted && (
        <Box
          sx={{
            position: "absolute",
            top: -50,
            left: -50,
            right: -50,
            bottom: -50,
            background:
              "linear-gradient(45deg, transparent 30%, rgba(255,215,0,0.1) 50%, transparent 70%)",
            animation: "shine 3s infinite linear",
            "@keyframes shine": {
              "0%": {
                transform: "translateX(-100%) translateY(-100%) rotate(45deg)",
              },
              "100%": {
                transform: "translateX(100%) translateY(100%) rotate(45deg)",
              },
            },
          }}
        />
      )}

      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {isGoalCompleted ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Celebration
                    sx={{ color: "warning.main", cursor: "pointer" }}
                  />
                  Daily Goal Completed!
                </Box>
              ) : (
                `🔥 ${streak} Day Streak`
              )}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {isGoalCompleted ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CheckCircle sx={{ color: "success.main", fontSize: 16 }} />
                  {cardsReviewedToday} cards reviewed
                </Box>
              ) : (
                `${cardsReviewedToday}/${dailyGoal} cards • ${
                  dailyGoal - cardsReviewedToday
                } to go`
              )}
            </Typography>
          </Box>

          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
              variant="determinate"
              value={100}
              size={70}
              thickness={4}
              sx={{
                color: "grey.300",
                position: "absolute",
              }}
            />

            <CircularProgress
              variant="determinate"
              value={progress * 100}
              size={70}
              thickness={4}
              sx={{
                color: isGoalCompleted ? "success.main" : "primary.main",
                position: "relative",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                width: 24,
                height: 24,
              }}
            >
              {isGoalCompleted ? (
                <Star sx={{ color: "gold", fontSize: 24 }} />
              ) : (
                <Typography variant="body2" fontWeight={700}>
                  {streak}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 2, position: "relative" }}>
          <LinearProgress
            variant="determinate"
            value={progress * 100}
            sx={{
              height: 12,
              borderRadius: 6,
              bgcolor: "grey.200",
              "& .MuiLinearProgress-bar": {
                bgcolor: isGoalCompleted ? "success.main" : "primary.main",
                borderRadius: 6,
                transition: "width 1s ease-in-out",
              },
            }}
          />

          <Box
            sx={{
              position: "absolute",
              top: -16,
              ml: 0.5,
              left: `${progress * 98}%`,
              transform: "translateX(-50%)",
              fontSize: 26,
              transition: "left 1s ease-in-out",
            }}
          >
            {isGoalCompleted ? "🏆" : "🎯"}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              0
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Goal: {dailyGoal}
            </Typography>
          </Box>
        </Box>

        {celebrate && (
          <Confetti
            numberOfPieces={200}
            gravity={0.2}
            initialVelocityY={500}
            tweenDuration={300}
          />
        )}
      </CardContent>
    </Card>
  );
};
