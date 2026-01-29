"use client";

import { Typography, Box, Grid, IconButton, Button } from "@mui/material";
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
import { getUserDailyRequest } from "@/services/user/user";
import { DeskCard } from "./ui/DeskCard";
import { DailyStreakCard } from "./ui/DailyStreakCard";

export default function HomeClient() {
  const { authenticated } = useAuth();
  const { accessToken } = useAuthContext();
  const queryClient = useQueryClient();
  const { call } = useProtectedRequest();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const { data: daily } = useQuery({
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
    control,
  } = useForm<CreateDeskValues>({
    resolver: zodResolver(createDeskSchema),
    defaultValues: { isPublic: true },
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
          control={control}
        />
      )}
    </WithBottomNav>
  );
}

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
