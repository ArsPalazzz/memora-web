
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
  Switch,
  IconButton,
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
import { SectionLoader, Loader } from "@/components/ui/Loader";
import { getMyProfileRequest, updateMyProfileRequest, uploadAvatarRequest, deleteAvatarRequest } from "@/services/user/user";
import { logoutRequest } from "@/services/auth/auth";
import { clearAppQueryCache } from "@/utils/clearAppQueryCache";
import { ROUTES } from "@/routes/paths";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import { useFCM } from "@/hooks/useFCM";
import { motion } from "framer-motion";
import WithBottomNav from "./layout/WithBottomNav";
import { useRef, useState } from "react";
import FeedSettingsCardOrientationModal from "./modals/FeedSettings/FeedSettingsCardOrientation.modal";
import { CARD_ORIENTATION } from "@/services/desk/desk.const";
import { DEFAULT_FEED_STUDY_MODE, DEFAULT_REVIEW_STUDY_MODE, STUDY_MODE_LABELS, StudyMode, normalizeFeedStudyMode, studyModeLabelSx } from "@/constants/studyMode.const";
import StudyModeSelectModal from "./modals/StudyModeSelect.modal";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import React from "react";
import { useThemeContext } from "@/context/ThemeContext";
import ThemeTogglerModal from "./modals/FeedSettings/ThemeTogglermodal";
import AccentColorModal from "./modals/FeedSettings/AccentColorModal";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import PaletteIcon from "@mui/icons-material/Palette";
import { FeedSettings } from "@/services/desk/desk.types";
import {
  updateFeedSettingsRequest,
  updateReviewSettingsRequest,
} from "@/services/desk/desk";
import ArchiveIcon from "@mui/icons-material/Archive";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { UserAvatar } from "@/components/ui/UserAvatar";
import ReviewSettingsCardsPerSessionModal from "./modals/ReviewSettings/ReviewSettingsCardsPerSession.modal";
import { useNotification } from "@/context/NotificationContext";

export default function ProfileClient() {
  const navigate = useNavigate();
  const { authenticated } = useAuth();
  const { setAccessToken, accessToken } = useAuthContext();
  const { call } = useProtectedRequest();
  const theme = useTheme();

  const [openSheet, setOpenSheet] = useState<null | string>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { mode, accentColor } = useThemeContext();
  const queryClient = useQueryClient();
  const { notifySuccess, notifyError } = useNotification();

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
      clearAppQueryCache();
      setAccessToken(null);
      navigate(ROUTES.LOGIN);
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

  const cardsPerSession =
    profileInfo &&
    profileInfo.settings &&
    profileInfo.settings.reviewSettings &&
    profileInfo.settings.reviewSettings.cards_per_session;

  const settingsItems = [
    {
      key: "themeMode",
      icon: <Brightness4Icon sx={{ color: "primary.main", fontSize: 20 }} />,
      title: "Theme",
      subtitle: "Light or dark appearance",
      value: mode?.[0]?.toUpperCase() + mode?.slice(1),
    },
    {
      key: "accentColor",
      icon: <PaletteIcon sx={{ color: "primary.main", fontSize: 20 }} />,
      title: "Accent color",
      subtitle: "Buttons, links, and highlights",
      value: accentColor.toUpperCase(),
      swatch: accentColor,
    },
  ];

  const feedStudyModeLabel =
    STUDY_MODE_LABELS[normalizeFeedStudyMode(profileInfo?.settings?.study_mode)];

  const reviewStudyModeLabel = profileInfo?.settings?.reviewSettings?.study_mode
    ? STUDY_MODE_LABELS[profileInfo.settings.reviewSettings.study_mode]
    : STUDY_MODE_LABELS[DEFAULT_REVIEW_STUDY_MODE];

  const feedItems = [
    {
      key: "cardOrientation",
      icon: <ScreenRotationIcon sx={{ color: "primary.main", fontSize: 20 }} />,
      title: "Card orientation",
      subtitle: "How cards should be displayed",
      value: cardOrientation,
    },
    {
      key: "studyModeFeed",
      icon: <MenuBookIcon sx={{ color: "primary.main", fontSize: 20 }} />,
      title: "Study mode",
      subtitle: "How you practice cards in the feed",
      value: feedStudyModeLabel,
    },
  ];

  const reviewItems = [
    {
      key: "cardsPerSession",
      icon: <SettingsIcon sx={{ color: "primary.main", fontSize: 20 }} />,
      title: "Cards per session",
      subtitle: "How many cards to show in review",
      value: cardsPerSession,
    },
    {
      key: "studyModeReview",
      icon: <MenuBookIcon sx={{ color: "primary.main", fontSize: 20 }} />,
      title: "Study mode",
      subtitle: "How you practice cards in review",
      value: reviewStudyModeLabel,
    },
  ];

  const updateReviewSettingsMutation = useMutation({
    mutationFn: (payload: {
      data: { cards_per_session: number; study_mode: StudyMode };
      token: string;
    }) => {
      return call(() =>
        updateReviewSettingsRequest(payload.data, payload.token)
      );
    },
    onSuccess: () => {
      notifySuccess(`Review settings updated successfully`);

      queryClient.invalidateQueries({ queryKey: [MY_PROFILE] });
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const onUpdateReviewSubmit = (data: {
    cards_per_session: number;
    study_mode: StudyMode;
  }) => {
    updateReviewSettingsMutation.mutate({ data, token: accessToken! });
  };

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

  const updateMyProfileMutation = useMutation({
    mutationFn: (payload: {
      stats_public?: boolean;
      league_notifications?: boolean;
      token: string;
    }) => {
      const { token, ...body } = payload;
      return call(() => updateMyProfileRequest(body, token));
    },
    onSuccess: () => {
      notifySuccess("Profile settings updated");
      queryClient.invalidateQueries({ queryKey: [MY_PROFILE] });
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const handleStatsPublicChange = (checked: boolean) => {
    updateMyProfileMutation.mutate({ stats_public: checked, token: accessToken! });
  };

  const handleLeagueNotificationsChange = (checked: boolean) => {
    updateMyProfileMutation.mutate({
      league_notifications: checked,
      token: accessToken!,
    });
  };

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) =>
      call((token) => uploadAvatarRequest(file, token)),
    onSuccess: () => {
      notifySuccess("Avatar updated");
      queryClient.invalidateQueries({ queryKey: [MY_PROFILE] });
    },
    onError: (err) => notifyError(err.message),
  });

  const deleteAvatarMutation = useMutation({
    mutationFn: () => call((token) => deleteAvatarRequest(token)),
    onSuccess: () => {
      notifySuccess("Avatar removed");
      queryClient.invalidateQueries({ queryKey: [MY_PROFILE] });
    },
    onError: (err) => notifyError(err.message),
  });

  const handleAvatarSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    uploadAvatarMutation.mutate(file);
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

  if (isProfileLoading) {
    return (
      <WithBottomNav>
        <Header title="Profile" />
        <SectionLoader minHeight="50vh" />
      </WithBottomNav>
    );
  }
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

      <Box sx={{ overflowY: "auto", px: 2, py: 3, pb: 6 }}>
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
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                  <UserAvatar
                    nickname={profileInfo?.profile.nickname ?? "User"}
                    avatarUrl={profileInfo?.profile.avatar_url}
                    size={70}
                    sx={{
                      fontSize: "2rem",
                      boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                    }}
                  />
                  <IconButton
                    aria-label="Change avatar"
                    size="small"
                    disabled={uploadAvatarMutation.isPending || deleteAvatarMutation.isPending}
                    onClick={() => avatarInputRef.current?.click()}
                    sx={{
                      position: "absolute",
                      right: -4,
                      bottom: -4,
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: "divider",
                      boxShadow: 1,
                      "&:hover": { bgcolor: "background.paper" },
                    }}
                  >
                    {uploadAvatarMutation.isPending ? (
                      <Loader size={16} />
                    ) : (
                      <PhotoCameraIcon sx={{ fontSize: 16 }} />
                    )}
                  </IconButton>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleAvatarSelected}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {profileInfo?.profile.nickname || "User"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Member since {profileInfo?.profile.created_at.split("T")[0]}
                  </Typography>
                  {profileInfo?.profile.avatar_url && (
                    <Button
                      size="small"
                      sx={{ mt: 0.5, px: 0, minWidth: 0 }}
                      disabled={deleteAvatarMutation.isPending}
                      onClick={() => deleteAvatarMutation.mutate()}
                    >
                      Remove photo
                    </Button>
                  )}
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
                <Typography variant="h6" fontWeight={600}>
                  Feed
                </Typography>

                <List
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  {feedItems.map((item) => (
                    <React.Fragment key={item.key}>
                      <ListItemButton
                        onClick={() => setOpenSheet(item.key)}
                        sx={{
                          pl: 0,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 2,
                          "&:hover": { bgcolor: "inherit" },
                          pb: 0,
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

                        <Typography
                          color="text.secondary"
                          fontWeight={600}
                          sx={
                            item.key === "studyModeFeed"
                              ? studyModeLabelSx
                              : undefined
                          }
                        >
                          {item.value}
                        </Typography>
                      </ListItemButton>
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
          transition={{ duration: 0.3, delay: 0.4 }}
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
                <Typography variant="h6" fontWeight={600}>
                  Review
                </Typography>

                <List
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    overflow: "hidden",
                    pb: 0,
                  }}
                >
                  {reviewItems.map((item, index) => (
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
                          pb: 0,
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

                        <Typography
                          color="text.secondary"
                          fontWeight={600}
                          sx={
                            item.key === "studyModeReview"
                              ? studyModeLabelSx
                              : undefined
                          }
                        >
                          {item.value}
                        </Typography>
                      </ListItemButton>

                      {index !== settingsItems.length - 1 && (
                        <Divider component="li" />
                      )}
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
          transition={{ duration: 0.3, delay: 0.5 }}
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
                    pb: 0,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      pb: 2,
                      gap: 1,
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

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: 2,
                      gap: 1,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <EmojiEventsIcon sx={{ color: "warning.main", fontSize: 20 }} />
                      <ListItemText
                        primary="League notifications"
                        secondary="Get notified when a friend overtakes you in the weekly league"
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </Stack>
                    <Switch
                      checked={profileInfo?.profile.league_notifications ?? true}
                      onChange={(_, checked) => handleLeagueNotificationsChange(checked)}
                      disabled={updateMyProfileMutation.isPending}
                      inputProps={{ "aria-label": "League notifications" }}
                    />
                  </Box>

                  <Divider component="li" />

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: 2,
                      gap: 1,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <VisibilityIcon sx={{ color: "primary.main", fontSize: 20 }} />
                      <ListItemText
                        primary="Show my activity"
                        secondary="Display streak and weekly stats on your public profile"
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </Stack>
                    <Switch
                      checked={profileInfo?.profile.stats_public ?? false}
                      onChange={(_, checked) => handleStatsPublicChange(checked)}
                      disabled={updateMyProfileMutation.isPending}
                      inputProps={{ "aria-label": "Show my activity" }}
                    />
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
                          pb: 0,
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

                        <Stack direction="row" alignItems="center" spacing={1}>
                          {"swatch" in item && item.swatch && (
                            <Box
                              sx={{
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                bgcolor: item.swatch,
                                border: 1,
                                borderColor: "divider",
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <Typography color="text.secondary" fontWeight={600}>
                            {item.value}
                          </Typography>
                        </Stack>
                      </ListItemButton>

                      {index !== settingsItems.length - 1 && (
                        <Divider component="li" />
                      )}
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
          transition={{ duration: 0.3, delay: 0.5 }}
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
                    onClick={() => navigate("/desk/archived")}
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
                        primary="Archived decks"
                        secondary="Decks you archived"
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
          transition={{ duration: 0.3, delay: 0.6 }}
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

            onUpdateFeedSettingsSubmit({
              card_orientation: value,
              study_mode:
                profileInfo.settings.study_mode ?? DEFAULT_FEED_STUDY_MODE,
            });
          }}
        />
      )}

      {profileInfo && openSheet === "cardsPerSession" && (
        <ReviewSettingsCardsPerSessionModal
          setOpenSheet={setOpenSheet}
          currentValue={profileInfo?.settings.reviewSettings.cards_per_session}
          onClose={(value: number) => {
            const perSession =
              profileInfo?.settings.reviewSettings.cards_per_session;

            if (value === perSession) return;

            onUpdateReviewSubmit({
              cards_per_session: value,
              study_mode:
                profileInfo.settings.reviewSettings.study_mode ??
                DEFAULT_REVIEW_STUDY_MODE,
            });
          }}
        />
      )}

      {profileInfo && openSheet === "studyModeFeed" && (
        <StudyModeSelectModal
          title="Feed study mode"
          includeSwipe
          setOpenSheet={setOpenSheet}
          currentValue={normalizeFeedStudyMode(
            profileInfo.settings.study_mode ?? DEFAULT_FEED_STUDY_MODE
          )}
          onClose={(value) => {
            const normalized = normalizeFeedStudyMode(value);
            if (
              normalized ===
              normalizeFeedStudyMode(profileInfo.settings.study_mode ?? DEFAULT_FEED_STUDY_MODE)
            ) {
              return;
            }

            onUpdateFeedSettingsSubmit({
              card_orientation: profileInfo.settings.card_orientation,
              study_mode: normalized,
            });
          }}
        />
      )}

      {profileInfo && openSheet === "studyModeReview" && (
        <StudyModeSelectModal
          setOpenSheet={setOpenSheet}
          currentValue={
            profileInfo.settings.reviewSettings.study_mode ?? DEFAULT_REVIEW_STUDY_MODE
          }
          onClose={(value) => {
            const current =
              profileInfo.settings.reviewSettings.study_mode ?? DEFAULT_REVIEW_STUDY_MODE;

            if (value === current) return;

            onUpdateReviewSubmit({
              cards_per_session: profileInfo.settings.reviewSettings.cards_per_session,
              study_mode: value,
            });
          }}
        />
      )}

      {openSheet === "themeMode" && (
        <ThemeTogglerModal onClose={() => setOpenSheet(null)} />
      )}

      {openSheet === "accentColor" && (
        <AccentColorModal onClose={() => setOpenSheet(null)} />
      )}
    </WithBottomNav>
  );
}
