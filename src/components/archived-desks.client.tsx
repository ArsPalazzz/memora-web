"use client";

import { Typography, Box, Grid } from "@mui/material";
import { useAuth } from "../utils/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchMyArchivedDesksRequest,
  restoreDeskRequest,
} from "../services/desk/desk";
import { useAuthContext } from "@/context/AuthContext";
import { ARCHIVED_DESKS, USER_DESKS } from "@/routes/react-query";
import { useProtectedRequest } from "@/utils/protected";
import { FullPageLoader } from "@/components/ui/Loader";
import Header from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import WithBottomNav from "./layout/WithBottomNav";
import { motion } from "framer-motion";
import { ROUTES } from "@/routes/next";
import { ArchivedDeskCard } from "./ui/ArchivedDeskCard";
import ArchiveIcon from "@mui/icons-material/Archive";
import { useNotification } from "@/context/NotificationContext";

export default function ArchivedDesksClient() {
  const { authenticated } = useAuth();
  const { accessToken } = useAuthContext();
  const queryClient = useQueryClient();
  const { call } = useProtectedRequest();
  const router = useRouter();
  const { notifySuccess, notifyError } = useNotification();

  const { data: desks, isLoading: isDesksLoading } = useQuery({
    queryKey: [ARCHIVED_DESKS],
    queryFn: async () => call((token) => fetchMyArchivedDesksRequest(token)),
  });

  const archiveDeskMutation = useMutation({
    mutationFn: (payload: { data: { desk_sub: string }; token: string }) => {
      return call(() => restoreDeskRequest(payload.data, payload.token));
    },
    onSuccess: () => {
      notifySuccess(`Deck restored successfully`);

      queryClient.invalidateQueries({ queryKey: [ARCHIVED_DESKS] });
      queryClient.invalidateQueries({ queryKey: [USER_DESKS] });
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const onRestore = (desk_sub: string) => {
    archiveDeskMutation.mutate({ data: { desk_sub }, token: accessToken! });
  };

  if (isDesksLoading) return <FullPageLoader />;

  if (!authenticated) return null;

  return (
    <WithBottomNav>
      <Box sx={{ position: "relative" }}>
        <Header
          title="Archived Decks"
          onBack={() => router.push(ROUTES.PROFILE)}
        />

        <Box sx={{ px: 2, pt: 2 }}>
          {isDesksLoading && <FullPageLoader />}

          {!desks?.length && <ArchiveEmptyState />}

          {desks && desks.length > 0 && (
            <Box>
              <Grid container spacing={2}>
                {desks.map((desk, index) => {
                  const stats = {
                    learningCards: desk.learningCards,
                    dueCards: desk.dueCards,
                    newCards: desk.newCards,
                    masteredCards: desk.masteredCards,
                  };

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
                        <ArchivedDeskCard
                          desk={desk}
                          stats={stats}
                          onRestore={() => onRestore(desk.sub)}
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
    </WithBottomNav>
  );
}

const ArchiveEmptyState = () => (
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
    <ArchiveIcon sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
    <Typography variant="h6" sx={{ mb: 1 }}>
      Archive is empty
    </Typography>
    <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
      Archived decks will appear here. Archive decks you don&apos;t need right
      now to keep your workspace clean
    </Typography>
  </Box>
);
