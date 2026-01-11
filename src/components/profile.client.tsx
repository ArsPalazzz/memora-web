"use client";

import {
  Typography,
  Box,
  Stack,
  useTheme,
  Button,
  CardContent,
  Card,
  alpha,
  Divider,
} from "@mui/material";
import { useAuth } from "../utils/auth";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MY_PROFILE } from "@/routes/react-query";
import { useProtectedRequest } from "@/utils/protected";
import { FullPageLoader, Loader } from "@/components/ui/Loader";
import { getMyProfileRequest } from "@/services/user/user";
import { logoutRequest } from "@/services/auth/auth";
import { ROUTES } from "@/routes/next";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { notifyError, notifySuccess } from "@/utils/notification";
import Header from "@/components/layout/Header";
import ThemeToggle from "./ui/Buttons/ThemeToggler";
import { useFCM } from "@/hooks/useFCM";
import { motion } from "framer-motion";
import WithBottomNav from "./layout/WithBottomNav";

export default function ProfileClient() {
  const router = useRouter();
  const { authenticated } = useAuth();
  const { setAccessToken } = useAuthContext();
  const { call } = useProtectedRequest();
  const theme = useTheme();

  const {
    token: messageToken,
    permission,
    enableNotifications,
    isLoading: notificationsLoading,
    showCustomPrompt,
    setShowCustomPrompt,
    disableNotifications,
    showNotificationPrompt,
  } = useFCM();

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

  const handleNotifications = async () => {
    if (messageToken) {
      const result = await disableNotifications();
      if (result?.success) {
        notifySuccess(result.message);
      } else if (result?.message) {
        notifyError(result.message);
      }
    } else if (permission === "granted") {
      const result = await enableNotifications();
      if (result?.success) {
        notifySuccess(result.message);
      } else if (result?.message) {
        notifyError(result.message);
      }
    } else {
      showNotificationPrompt();
    }
  };

  const handleLogout = () => logoutMutation.mutate();

  if (isProfileLoading) return <FullPageLoader />;
  if (!authenticated) return null;

  return (
    <WithBottomNav>
      {showCustomPrompt && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: alpha("#000", 0.5),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            p: 2,
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              sx={{
                maxWidth: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Enable Notifications?
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Get notified about new lessons, updates, and important
                  announcements. You can change this anytime in settings.
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => setShowCustomPrompt(false)}
                    disabled={notificationsLoading}
                  >
                    Not Now
                  </Button>
                  <Button
                    variant="contained"
                    onClick={async () => {
                      const result = await enableNotifications();
                      if (result?.success) {
                        notifySuccess(result.message);
                      } else if (result?.message) {
                        notifyError(result.message);
                      }
                    }}
                    disabled={notificationsLoading}
                    startIcon={
                      notificationsLoading ? null : <NotificationsActiveIcon />
                    }
                  >
                    {notificationsLoading ? "Enabling..." : "Enable"}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      )}

      <Header title="Profile" />

      <Box sx={{ overflowY: "auto", px: 2, py: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            sx={{
              mb: 3,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    bgcolor: theme.palette.primary.main,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "2rem",
                    fontWeight: 600,
                    boxShadow: `0 4px 20px ${alpha(
                      theme.palette.primary.main,
                      0.3
                    )}`,
                  }}
                >
                  {profile?.nickname?.[0]?.toUpperCase() || "U"}
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {profile?.nickname || "User"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Member since {profile?.created_at.split("T")[0]}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card
            sx={{
              mb: 3,
              borderRadius: 3,
              bgcolor: "background.paper",
              boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Account Details
              </Typography>

              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <PersonIcon sx={{ color: "primary.main", fontSize: 20 }} />
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      Nickname
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {profile?.nickname}
                    </Typography>
                  </Box>
                </Stack>

                <Divider />

                <Stack direction="row" alignItems="center" spacing={2}>
                  <EmailIcon sx={{ color: "primary.main", fontSize: 20 }} />
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {profile?.email}
                    </Typography>
                  </Box>
                </Stack>

                <Divider />

                <Stack direction="row" alignItems="center" spacing={2}>
                  <CalendarTodayIcon
                    sx={{ color: "primary.main", fontSize: 20 }}
                  />
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      Registered
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {profile?.created_at.split("T")[0]}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card
            sx={{
              mb: 3,
              borderRadius: 3,
              bgcolor: "background.paper",
              boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Settings
              </Typography>

              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {messageToken ? (
                      <NotificationsActiveIcon
                        sx={{ color: "primary.main", fontSize: 20 }}
                      />
                    ) : (
                      <NotificationsOffIcon
                        sx={{ color: "primary.main", fontSize: 20 }}
                      />
                    )}
                    <Typography variant="body1">Push Notifications</Typography>
                  </Stack>
                  <Button
                    variant={messageToken ? "outlined" : "contained"}
                    size="small"
                    onClick={handleNotifications}
                    disabled={notificationsLoading}
                    startIcon={
                      notificationsLoading ? null : messageToken ? (
                        <NotificationsOffIcon />
                      ) : (
                        <NotificationsIcon />
                      )
                    }
                    sx={{ minWidth: 120, height: 32 }}
                  >
                    {notificationsLoading ? (
                      <Loader size={23} />
                    ) : messageToken ? (
                      "Disable"
                    ) : (
                      "Enable"
                    )}
                  </Button>
                </Box>

                <Divider />

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <SettingsIcon
                      sx={{ color: "primary.main", fontSize: 20 }}
                    />
                    <Typography variant="body1">Theme</Typography>
                  </Stack>
                  <ThemeToggle />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card
            sx={{
              borderRadius: 3,
              bgcolor: alpha("#bb0101", 0.05),
              border: `1px solid ${alpha("#bb0101", 0.1)}`,
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: alpha("#bb0101", 0.08),
                transform: "translateY(-2px)",
                boxShadow: `0 8px 24px ${alpha("#bb0101", 0.15)}`,
              },
              "&:active": {
                transform: "translateY(0)",
              },
            }}
            onClick={handleLogout}
          >
            <CardContent sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                }}
              >
                <LogoutIcon sx={{ color: "#bb0101", fontSize: 20 }} />
                <Typography
                  variant="h6"
                  color="#bb0101"
                  fontWeight={600}
                  sx={{ userSelect: "none" }}
                >
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </WithBottomNav>
  );
}
