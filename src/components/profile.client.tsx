"use client";

import { Typography, Box, Grid, Stack } from "@mui/material";
import { useAuth } from "../utils/auth";
import BottomNav from "./layout/BottomNav";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MY_PROFILE } from "@/routes/react-query";
import { useProtectedRequest } from "@/utils/protected";
import { FullPageLoader, Loader } from "@/components/ui/Loader";
import { getMyProfileRequest } from "@/services/user/user";
import { logoutRequest } from "@/services/auth/auth";
import { ROUTES } from "@/routes/next";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { notifyError } from "@/utils/notification";
import Header from "@/components/layout/Header";
import ThemeToggle from "./ui/Buttons/ThemeToggler";

export default function ProfileClient() {
  const router = useRouter();
  const { authenticated } = useAuth();
  const { setAccessToken } = useAuthContext();
  const { call } = useProtectedRequest();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: [MY_PROFILE],
    queryFn: async () => call((token) => getMyProfileRequest(token)),
  });

  const logoutMutation = useMutation({
    mutationFn: () => call((token) => logoutRequest(token)),
    onSuccess: () => {
      setAccessToken(null);
      router.push(ROUTES.LOGIN);
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const onClick = () => logoutMutation.mutate();

  if (isProfileLoading) return <FullPageLoader />;

  if (!authenticated) return null;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Header title="Profile" />

        <Box sx={{ overflowY: "auto" }}>
          {isProfileLoading && <Loader />}

          {profile && (
            <Stack sx={{ pt: 2, px: 2 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Nickname
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {profile.nickname}
              </Typography>

              <Typography variant="subtitle1" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {profile.email}
              </Typography>

              <Typography variant="subtitle1" color="text.secondary">
                Registered at
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {profile.created_at.split("T")[0]}
              </Typography>

              <ThemeToggle sx={{ mb: 6 }} />

              <Typography variant="h6" color="#bb0101" onClick={onClick}>
                Logout
              </Typography>
            </Stack>
          )}
        </Box>

        <BottomNav />
      </Box>
    </>
  );
}
