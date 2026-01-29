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
  ListItemButton,
  List,
  ListItemIcon,
  ListItemText,
  Grid,
} from "@mui/material";
import { useAuth } from "../utils/auth";
import ScreenRotationIcon from "@mui/icons-material/ScreenRotation";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SettingsIcon from "@mui/icons-material/Settings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { useFCM } from "@/hooks/useFCM";
import { motion } from "framer-motion";
import WithBottomNav from "./layout/WithBottomNav";
import { useState } from "react";
import FeedSettingsCardOrientationModal from "./modals/FeedSettings/FeedSettingsCardOrientation.modal";
import { CARD_ORIENTATION } from "@/services/desk/desk.const";
import React from "react";
import { useThemeContext } from "@/context/ThemeContext";
import ThemeTogglerModal from "./modals/FeedSettings/ThemeTogglermodal";
import { FeedSettings } from "@/services/desk/desk.types";
import { updateFeedSettingsRequest } from "@/services/desk/desk";
import ArchiveIcon from "@mui/icons-material/Archive";

export default function ProfileClient() {
  const router = useRouter();
  const { authenticated } = useAuth();
  const { setAccessToken, accessToken } = useAuthContext();
  const { call } = useProtectedRequest();
  const theme = useTheme();

  const [openSheet, setOpenSheet] = useState<null | string>(null);
  const { mode } = useThemeContext();
  const queryClient = useQueryClient();

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

  const { data: profileInfo, isLoading: isProfileLoading } = useQuery({
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

  const cardOrientation =
    profileInfo &&
    profileInfo.settings &&
    profileInfo.settings.card_orientation &&
    profileInfo.settings.card_orientation.charAt(0).toUpperCase() +
      profileInfo.settings.card_orientation.slice(1);

  const settingsItems = [
    {
      key: "cardOrientation",
      icon: <ScreenRotationIcon sx={{ color: "primary.main", fontSize: 20 }} />,
      title: "Card orientation (Feed)",
      subtitle: "How cards should be displayed",
      value: cardOrientation,
    },
    {
      key: "themeColor",
      icon: <SettingsIcon sx={{ color: "primary.main", fontSize: 20 }} />,
      title: "Theme color",
      subtitle: "Main theme of application",
      value: mode?.[0]?.toUpperCase() + mode?.slice(1),
    },
  ];

  const updateDeskSettingsMutation = useMutation({
    mutationFn: (payload: { data: FeedSettings; token: string }) => {
      return call(() => updateFeedSettingsRequest(payload.data, payload.token));
    },
    onSuccess: () => {
      notifySuccess(`Feed settings updated successfully`);

      queryClient.invalidateQueries({ queryKey: [MY_PROFILE] });
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const onUpdateFeedSettingsSubmit = (data: FeedSettings) => {
    updateDeskSettingsMutation.mutate({ data, token: accessToken! });
  };

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
                      await enableNotifications();
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
                    flexShrink: 0,
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
                  {profileInfo?.profile.nickname?.[0]?.toUpperCase() || "U"}
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {profileInfo?.profile.nickname || "User"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Member since {profileInfo?.profile.created_at.split("T")[0]}
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
                      {profileInfo?.profile.nickname}
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
                      {profileInfo?.profile.email}
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
                      {profileInfo?.profile.created_at.split("T")[0]}
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
          <Grid size={{ xs: 12 }}>
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

                <List
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    overflow: "hidden",
                    pt: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      pb: 2,
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

                      <ListItemText
                        primary="Push Notifications"
                        secondary="Get notifications to revise cards"
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
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
                      sx={{ minWidth: 100, height: 32 }}
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

                  <Divider component="li" />

                  {settingsItems.map((item, index) => (
                    <React.Fragment key={item.key}>
                      <ListItemButton
                        onClick={() => setOpenSheet(item.key)}
                        sx={{
                          pl: 0,
                          py: 2,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 2,
                          "&:hover": { bgcolor: "inherit" },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {item.icon}
                          </ListItemIcon>

                          <ListItemText
                            primary={item.title}
                            secondary={item.subtitle}
                            primaryTypographyProps={{ fontWeight: 600 }}
                          />
                        </Box>

                        <Typography color="text.secondary" fontWeight={600}>
                          {item.value}
                        </Typography>
                      </ListItemButton>

                      {index !== 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Grid size={{ xs: 12 }}>
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Hidden
                </Typography>

                <List
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    overflow: "hidden",
                    pt: 2,
                  }}
                >
                  <ListItemButton
                    onClick={() => router.push("/desk/archived")}
                    sx={{
                      pl: 0,
                      "&:hover": { bgcolor: "inherit" },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <ArchiveIcon
                          sx={{ color: "primary.main", fontSize: 20 }}
                        />
                      </ListItemIcon>

                      <ListItemText
                        primary="Archived desks"
                        secondary="Desks you archived"
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </Box>
                  </ListItemButton>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card
            sx={{
              borderRadius: 3,
              bgcolor: "#bb0101",
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
                }}
              >
                <Typography
                  variant="h6"
                  color="#ececec"
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

      {profileInfo && openSheet === "cardOrientation" && (
        <FeedSettingsCardOrientationModal
          setOpenSheet={setOpenSheet}
          currentValue={profileInfo?.settings.card_orientation}
          onClose={(value: CARD_ORIENTATION) => {
            if (value === profileInfo.settings.card_orientation) return;

            onUpdateFeedSettingsSubmit({ card_orientation: value });
          }}
        />
      )}

      {profileInfo && openSheet === "themeColor" && (
        <ThemeTogglerModal onClose={() => setOpenSheet(null)} />
      )}
    </WithBottomNav>
  );
}
