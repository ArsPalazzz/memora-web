
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import PeopleIcon from "@mui/icons-material/People";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import StyleIcon from "@mui/icons-material/Style";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import WithBottomNav from "@/components/layout/WithBottomNav";
import { SectionLoader } from "@/components/ui/Loader";
import { useProtectedRequest } from "@/utils/protected";
import { getPublicProfileRequest, getMyProfileRequest } from "@/services/user/user";
import { sendFriendRequest, getFriendshipStatusRequest, acceptFriendRequest, declineFriendRequest } from "@/services/friends/friends";
import { FRIENDSHIP_STATUS, FRIENDS, FRIENDS_REQUESTS, MY_PROFILE, PUBLIC_PROFILE } from "@/routes/react-query";
import { ROUTES } from "@/routes/paths";
import { PublicProfileDesk } from "@/services/user/user.types";
import { formatCount } from "@/utils/formatCount";
import { useNotification } from "@/context/NotificationContext";
import { useAuth } from "@/utils/auth";

function formatMemberSince(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.split("T")[0];
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PublicDeskCard({
  desk,
  onClick,
}: {
  desk: PublicProfileDesk;
  onClick: () => void;
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        minHeight: 132,
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "0.3s",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-4px)",
          borderColor: "primary.main",
        },
      }}
      onClick={onClick}
    >
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 2,
          "&:last-child": { pb: 2 },
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {desk.title}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}>
          <Chip
            size="small"
            icon={<LibraryBooksIcon sx={{ fontSize: 16 }} />}
            label={`${desk.cardCount} cards`}
            variant="outlined"
          />
          <Chip
            size="small"
            icon={<FavoriteBorderIcon sx={{ fontSize: 16 }} />}
            label={`${formatCount(desk.totalSaves)} saves`}
            variant="outlined"
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function PublicProfileClient() {
  const { nickname } = useParams<{ nickname: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { call } = useProtectedRequest();
  const { authenticated } = useAuth();
  const queryClient = useQueryClient();
  const { notifySuccess, notifyError } = useNotification();

  const { data: myProfile } = useQuery({
    queryKey: [MY_PROFILE],
    queryFn: async () => call((token) => getMyProfileRequest(token)),
    enabled: authenticated,
  });

  const isOwnProfile =
    !!nickname &&
    !!myProfile?.profile.nickname &&
    myProfile.profile.nickname.toLowerCase() === nickname.toLowerCase();

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [PUBLIC_PROFILE, nickname],
    queryFn: async () => call((token) => getPublicProfileRequest(nickname!, token)),
    enabled: !!nickname,
    retry: false,
  });

  const { data: friendshipStatus, isLoading: isFriendshipLoading } = useQuery({
    queryKey: [FRIENDSHIP_STATUS, nickname],
    queryFn: async () => call((token) => getFriendshipStatusRequest(nickname!, token)),
    enabled: !!nickname && authenticated && !isOwnProfile,
  });

  const sendRequestMutation = useMutation({
    mutationFn: () => call((token) => sendFriendRequest(nickname!, token)),
    onSuccess: () => {
      notifySuccess(`Friend request sent to @${nickname}`);
      queryClient.invalidateQueries({ queryKey: [FRIENDSHIP_STATUS, nickname] });
    },
    onError: (err) => {
      notifyError(err.message);
    },
  });

  const acceptRequestMutation = useMutation({
    mutationFn: () =>
      call((token) => acceptFriendRequest(friendshipStatus!.sub, token)),
    onSuccess: () => {
      notifySuccess(`You are now friends with @${nickname}`);
      queryClient.invalidateQueries({ queryKey: [FRIENDSHIP_STATUS, nickname] });
      queryClient.invalidateQueries({ queryKey: [FRIENDS] });
      queryClient.invalidateQueries({ queryKey: [FRIENDS_REQUESTS] });
    },
    onError: (err) => notifyError(err.message),
  });

  const declineRequestMutation = useMutation({
    mutationFn: () =>
      call((token) => declineFriendRequest(friendshipStatus!.sub, token)),
    onSuccess: () => {
      notifySuccess("Friend request declined");
      queryClient.invalidateQueries({ queryKey: [FRIENDSHIP_STATUS, nickname] });
      queryClient.invalidateQueries({ queryKey: [FRIENDS_REQUESTS] });
    },
    onError: (err) => notifyError(err.message),
  });

  const handleDeskClick = (deskSub: string) => {
    if (!nickname) return;
    navigate(ROUTES.publicDesk(nickname, deskSub), { state: { fromProfile: true } });
  };

  const renderFriendAction = () => {
    if (!authenticated || isOwnProfile || isFriendshipLoading) {
      return null;
    }

    if (friendshipStatus?.status === "accepted") {
      return (
        <Button
          variant="outlined"
          disabled
          startIcon={<PeopleIcon />}
          sx={{ mt: 2 }}
        >
          Friends
        </Button>
      );
    }

    if (friendshipStatus?.status === "pending") {
      if (friendshipStatus.direction === "incoming") {
        return (
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              disabled={acceptRequestMutation.isPending || declineRequestMutation.isPending}
              onClick={() => acceptRequestMutation.mutate()}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              disabled={acceptRequestMutation.isPending || declineRequestMutation.isPending}
              onClick={() => declineRequestMutation.mutate()}
            >
              Decline
            </Button>
          </Stack>
        );
      }

      return (
        <Button
          variant="outlined"
          disabled
          startIcon={<HourglassTopIcon />}
          sx={{ mt: 2 }}
        >
          Pending
        </Button>
      );
    }

    return (
      <Button
        variant="contained"
        startIcon={<PersonAddIcon />}
        sx={{ mt: 2 }}
        disabled={sendRequestMutation.isPending}
        onClick={() => sendRequestMutation.mutate()}
      >
        {sendRequestMutation.isPending ? "Sending..." : "Add friend"}
      </Button>
    );
  };

  return (
    <WithBottomNav>
      <Header title={nickname ? `@${nickname}` : "Profile"} onBack={() => navigate(-1)} />

      <Box sx={{ px: 2, py: 2, pb: 3 }}>
        {isLoading && <SectionLoader minHeight="40vh" />}

        {!isLoading && (isError || !profile) && (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              User not found
            </Typography>
            <Typography color="text.secondary">
              This profile does not exist or is unavailable.
            </Typography>
          </Box>
        )}

        {profile && (
          <>
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
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
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
                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                      }}
                    >
                      {profile.nickname[0]?.toUpperCase() || "U"}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={700}>
                        @{profile.nickname}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Learning since {formatMemberSince(profile.memberSince)}
                      </Typography>
                      {profile.stats && (
                        <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap", gap: 1 }}>
                          <Chip
                            size="small"
                            icon={<LocalFireDepartmentIcon sx={{ fontSize: 16 }} />}
                            label={`${profile.stats.currentStreak} day streak`}
                            variant="outlined"
                          />
                          <Chip
                            size="small"
                            icon={<StyleIcon sx={{ fontSize: 16 }} />}
                            label={`${profile.stats.cardsReviewedThisWeek} cards this week`}
                            variant="outlined"
                          />
                        </Stack>
                      )}
                      {renderFriendAction()}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>

            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Public decks
            </Typography>

            {profile.desks.length === 0 ? (
              <Card variant="outlined">
                <CardContent sx={{ py: 4, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    No public decks yet.
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={2}>
                {profile.desks.map((desk, index) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={desk.sub}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: Number(`0.${index + 1}`),
                      }}
                    >
                      <PublicDeskCard
                        desk={desk}
                        onClick={() => handleDeskClick(desk.sub)}
                      />
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>
    </WithBottomNav>
  );
}
