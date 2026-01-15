"use client";

import {
  Typography,
  Box,
  CardContent,
  Card,
  Grid,
  IconButton,
  Chip,
  Button,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { useAuth } from "../utils/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDeskRequest, fetchMyDesksRequest } from "../services/desk/desk";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { useForm } from "react-hook-form";
import NewDeskModal from "@/components/modals/NewDesk/NewDesk.modal";
import {
  createDeskSchema,
  CreateDeskValues,
} from "@/schemas/createDesk.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifyError, notifySuccess } from "@/utils/notification";
import { useAuthContext } from "@/context/AuthContext";
import { USER_DAILY, USER_DESKS } from "@/routes/react-query";
import { CreateDeskResult } from "@/services/desk/desk.types";
import { useProtectedRequest } from "@/utils/protected";
import { FullPageLoader } from "@/components/ui/Loader";
import Header from "@/components/layout/Header";
import { v4 as uuidV4 } from "uuid";
import { useRouter } from "next/navigation";
import WithBottomNav from "./layout/WithBottomNav";
import { motion } from "framer-motion";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { CheckCircle, Star, Celebration } from "@mui/icons-material";
import { getUserDailyRequest } from "@/services/user/user";

interface DeskStats {
  learningCards: number;
  dueCards: number;
  newCards: number;
  masteredCards: number;
  lastReviewed?: string;
}

const MasteryProgress = ({
  learningCards: learning,
  masteredCards: mastered,
  dueCards: due,
  newCards,
}: DeskStats) => {
  const total = mastered + due + newCards + learning;

  const masteredPercentage = total > 0 ? (mastered / total) * 100 : 0;
  const learningPercentage = total > 0 ? (learning / total) * 100 : 0;
  const duePercentage = total > 0 ? (due / total) * 100 : 0;
  const newPercentage = total > 0 ? (newCards / total) * 100 : 0;

  if (total === 0) {
    return (
      <Box
        sx={{
          height: 12,
          borderRadius: 6,
          bgcolor: "grey.200",
        }}
      />
    );
  }

  const segments = [];
  let accumulatedLeft = 0;

  if (mastered > 0) {
    const percentage = masteredPercentage;
    segments.push({
      key: "mastered",
      left: accumulatedLeft,
      width: percentage,
      color: "success.main",
      opacity: 0.9,
    });
    accumulatedLeft += percentage;
  }

  if (learning > 0) {
    const percentage = learningPercentage;
    segments.push({
      key: "learning",
      left: accumulatedLeft,
      width: percentage,
      color: "info.main",
      opacity: 0.9,
    });
    accumulatedLeft += percentage;
  }

  if (due > 0) {
    const percentage = duePercentage;
    segments.push({
      key: "due",
      left: accumulatedLeft,
      width: percentage,
      color: "warning.main",
      opacity: 0.9,
    });
    accumulatedLeft += percentage;
  }

  if (newCards > 0) {
    const percentage = newPercentage;
    segments.push({
      key: "new",
      left: accumulatedLeft,
      width: percentage,
      color: "error.main",
      opacity: 0.9,
    });
  }

  return (
    <Box
      sx={{
        position: "relative",
        height: 12,
        borderRadius: 6,
        overflow: "hidden",
        bgcolor: "grey.200",
      }}
    >
      {segments.map((segment) => (
        <Box
          key={segment.key}
          sx={{
            position: "absolute",
            left: `${segment.left}%`,
            width: `${segment.width}%`,
            height: "100%",
            bgcolor: segment.color,
            opacity: segment.opacity,
          }}
        />
      ))}
    </Box>
  );
};

export default function HomeClient() {
  const { authenticated } = useAuth();
  const { accessToken } = useAuthContext();
  const queryClient = useQueryClient();
  const { call } = useProtectedRequest();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const { data: daily, isLoading: isDailyLoading } = useQuery({
    queryKey: [USER_DAILY],
    queryFn: async () => call((token) => getUserDailyRequest(token)),
  });

  const { data: desks, isLoading: isDesksLoading } = useQuery({
    queryKey: [USER_DESKS],
    queryFn: async () => call((token) => fetchMyDesksRequest(token)),
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateDeskValues>({
    resolver: zodResolver(createDeskSchema),
    mode: "onChange",
  });

  const createDeskMutation = useMutation({
    mutationFn: (payload: { data: CreateDeskValues; token: string }) => {
      const sub = uuidV4();
      const data = { sub, ...payload.data };

      return call(() => createDeskRequest(data, payload.token));
    },
    onSuccess: (payload: CreateDeskResult) => {
      reset();
      setOpen(false);
      notifySuccess(`Desk '${payload.title}' created successfully`);

      queryClient.invalidateQueries({ queryKey: [USER_DESKS] });
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const onSubmit = (data: CreateDeskValues) => {
    createDeskMutation.mutate({ data, token: accessToken! });
  };

  if (isDesksLoading) return <FullPageLoader />;

  if (!authenticated) return null;

  const getPriorityColor = (dueCards: number, totalCards: number) => {
    const ratio = dueCards / totalCards;
    if (ratio > 0.3) return "error";
    if (ratio > 0.1) return "warning";
    return "success";
  };

  return (
    <WithBottomNav>
      <Box sx={{ position: "relative" }}>
        <Header
          title="Desks"
          RightButton={
            <IconButton onClick={() => setOpen(true)}>
              <AddIcon sx={{ color: "white", fontSize: 30 }} />
            </IconButton>
          }
        />

        <Box sx={{ px: 2, pt: 2 }}>
          {isDesksLoading && <FullPageLoader />}

          {!desks?.length && <EmptyState onCreate={() => setOpen(true)} />}

          {desks && desks.length > 0 && (
            <Box>
              {daily && (
                <Box sx={{ mb: 3 }}>
                  <DailyStreakCard
                    streak={daily.currentStreak}
                    cardsReviewedToday={daily.cardsReviewed}
                    dailyGoal={daily.dailyGoal}
                  />
                </Box>
              )}

              <Grid container spacing={2}>
                {desks.map((desk, index) => {
                  const stats = {
                    learningCards: desk.learningCards,
                    dueCards: desk.dueCards,
                    newCards: desk.newCards,
                    masteredCards: desk.masteredCards,
                  };

                  const priorityColor = getPriorityColor(
                    stats.dueCards,
                    stats.dueCards +
                      stats.learningCards +
                      stats.masteredCards +
                      stats.newCards
                  );

                  return (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={desk.sub}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: Number(`0.${index + 1}`),
                        }}
                      >
                        <DeskCard
                          desk={desk}
                          stats={stats}
                          priorityColor={priorityColor}
                          onClick={() => router.push(`desk/${desk.sub}`)}
                        />
                      </motion.div>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}
        </Box>
      </Box>

      {open && (
        <NewDeskModal
          open={open}
          onClose={() => setOpen(false)}
          errors={errors}
          register={register}
          onSubmit={handleSubmit(onSubmit)}
        />
      )}
    </WithBottomNav>
  );
}

const DeskCard = ({
  desk,
  stats,
  priorityColor,
  onClick,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  desk: any;
  stats: DeskStats;
  priorityColor: string;
  onClick: () => void;
}) => (
  <Card
    variant="outlined"
    sx={{
      height: "100%",
      transition: "0.3s",
      cursor: "pointer",
      "&:hover": {
        boxShadow: 6,
        transform: "translateY(-4px)",
        borderColor: "primary.main",
      },
    }}
    onClick={onClick}
  >
    <CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            lineHeight: 1.2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {desk.title}
        </Typography>

        <Chip
          label={`${stats.dueCards} due`}
          size="small"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          color={priorityColor as any}
          variant="outlined"
          sx={{ ml: 1, flexShrink: 0 }}
        />
      </Box>

      {desk.description && (
        <Typography
          variant="body2"
          color="text.secondary"
          mb={3}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {desk.description}
        </Typography>
      )}

      <Box>
        <MasteryProgress {...stats} />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
          {stats.masteredCards} mastered • {stats.learningCards} learning •{" "}
          {stats.dueCards} due • {stats.newCards} new
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

// Пустой стейт
const EmptyState = ({ onCreate }: { onCreate: () => void }) => (
  <Box
    sx={{
      width: "100%",
      height: "calc(100vh - 150px)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      px: 2,
    }}
  >
    <LibraryBooksIcon sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
    <Typography variant="h6" sx={{ mb: 1 }}>
      No desks yet
    </Typography>
    <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
      Start your learning journey by creating your first deck of flashcards
    </Typography>
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={onCreate}
      size="large"
    >
      Create First Deck
    </Button>
  </Box>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DailyStreakCard = ({ streak, cardsReviewedToday, dailyGoal }: any) => {
  const isGoalCompleted = cardsReviewedToday >= dailyGoal;
  const progress = Math.min(cardsReviewedToday / dailyGoal, 1);

  return (
    <Card
      sx={{
        cursor: isGoalCompleted ? "pointer" : "default",
        border: isGoalCompleted ? "3px solid gold" : "2px solid",
        borderColor: "primary.main",
        bgcolor: "background.paper",
        position: "relative",
        overflow: "hidden",
        transform: isGoalCompleted ? "translateY(-2px)" : "none",
        transition: "all 0.3s",
        "&:hover": isGoalCompleted
          ? {
              boxShadow: 6,
              transform: "translateY(-4px)",
            }
          : {},
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
                  <Celebration sx={{ color: "warning.main" }} />
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
      </CardContent>
    </Card>
  );
};
