
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import WithBottomNav from "@/components/layout/WithBottomNav";
import { SectionLoader } from "@/components/ui/Loader";
import { useProtectedRequest } from "@/utils/protected";
import {
  addDeskToLibraryRequest,
  getLibrarySourcesRequest,
  getPublicDeskRequest,
} from "@/services/desk/desk";
import { LIBRARY_SOURCES, PUBLIC_DESK, USER_DESKS } from "@/routes/react-query";
import { ROUTES } from "@/routes/paths";
import { formatCount } from "@/utils/formatCount";
import { BOTTOM_NAV_HEIGHT } from "@/components/layout/bottom-nav.constants";
import { useNotification } from "@/context/NotificationContext";

const ADD_BUTTON_HEIGHT = 72;

export default function PublicDeskClient() {
  const params = useParams<{ nickname?: string; sub?: string; id?: string }>();
  const deskSub = params.sub ?? params.id;
  const nickname = params.nickname;
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { call } = useProtectedRequest();
  const queryClient = useQueryClient();
  const { notifySuccess, notifyError } = useNotification();

  const {
    data: desk,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [PUBLIC_DESK, deskSub],
    queryFn: async () => call((token) => getPublicDeskRequest(deskSub!, token)),
    enabled: !!deskSub,
    retry: false,
  });

  const { data: librarySources } = useQuery({
    queryKey: [LIBRARY_SOURCES],
    queryFn: async () => call((token) => getLibrarySourcesRequest(token)),
  });

  const existingEntry = librarySources?.find(
    (entry) => entry.sourceDeskSub === deskSub
  );

  const addToLibraryMutation = useMutation({
    mutationFn: () => call((token) => addDeskToLibraryRequest(deskSub!, token)),
    onSuccess: (result) => {
      notifySuccess(`Added ${result.title}`);
      queryClient.invalidateQueries({ queryKey: [LIBRARY_SOURCES] });
      queryClient.invalidateQueries({ queryKey: [USER_DESKS] });
      navigate(`/desk/${result.localDeskSub}`);
    },
    onError: (err) => {
      notifyError(err.message);
    },
  });

  const handleBack = () => {
    const state = location.state as { fromProfile?: boolean } | null;

    if (state?.fromProfile && nickname) {
      navigate(ROUTES.userProfile(nickname));
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    if (nickname) {
      navigate(ROUTES.userProfile(nickname));
      return;
    }

    navigate(ROUTES.HOME);
  };

  const handleCreatorClick = () => {
    if (!desk?.creatorNickname) return;
    navigate(ROUTES.userProfile(desk.creatorNickname));
  };

  return (
    <WithBottomNav>
      <Header title={desk?.title ?? "Public deck"} onBack={handleBack} />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          px: 2,
          py: 2,
          pb: `calc(${ADD_BUTTON_HEIGHT + 16}px + ${BOTTOM_NAV_HEIGHT})`,
        }}
      >
        {isLoading && <SectionLoader minHeight="40vh" />}

        {!isLoading && (isError || !desk) && (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Deck unavailable
            </Typography>
            <Typography color="text.secondary">
              This deck is private, archived, or does not exist.
            </Typography>
          </Box>
        )}

        {desk && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Card
                sx={{
                  mb: 3,
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {desk.title}
                  </Typography>

                  {desk.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1.5 }}
                    >
                      {desk.description}
                    </Typography>
                  )}

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Typography variant="body2" color="text.secondary">
                      by{" "}
                      <Box
                        component="button"
                        type="button"
                        onClick={handleCreatorClick}
                        sx={{
                          color: "primary.main",
                          fontWeight: 600,
                          border: "none",
                          background: "none",
                          padding: 0,
                          font: "inherit",
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        @{desk.creatorNickname}
                      </Box>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      · {formatCount(desk.cardCount)} cards
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>

            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1.5 }}
            >
              Preview
            </Typography>

            {desk.cards.length === 0 ? (
              <Card variant="outlined">
                <CardContent sx={{ py: 4, textAlign: "center" }}>
                  <Typography color="text.secondary">No cards yet.</Typography>
                </CardContent>
              </Card>
            ) : (
              <Stack spacing={1.5}>
                {desk.cards.map((card, index) => (
                  <motion.div
                    key={card.sub}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                  >
                    <Card variant="outlined">
                      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                        <Typography variant="body1" fontWeight={500}>
                          {card.frontVariants.join(", ")}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Stack>
            )}

            {desk.pagination.hasMore && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", textAlign: "center", mt: 2 }}
              >
                Showing {desk.cards.length} of {formatCount(desk.cardCount)}{" "}
                cards
              </Typography>
            )}
          </>
        )}
      </Box>

      {desk && (
        <Box
          sx={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: BOTTOM_NAV_HEIGHT,
            px: 2,
            py: 1.5,
            bgcolor: "background.paper",
            borderTop: 1,
            borderColor: "divider",
            zIndex: 1,
          }}
        >
          {existingEntry ? (
            <Stack spacing={1}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={0.75}
              >
                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 18 }} />
                <Typography variant="body2" color="text.secondary">
                  Already in library
                </Typography>
              </Stack>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => navigate(`/desk/${existingEntry.localDeskSub}`)}
                sx={{ height: 48 }}
              >
                Open my copy
              </Button>
            </Stack>
          ) : (
            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={addToLibraryMutation.isPending}
              startIcon={<LibraryAddIcon />}
              onClick={() => addToLibraryMutation.mutate()}
              sx={{ height: 48 }}
            >
              {addToLibraryMutation.isPending
                ? "Adding..."
                : "Add to my library"}
            </Button>
          )}
        </Box>
      )}
    </WithBottomNav>
  );
}
