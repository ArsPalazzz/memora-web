
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/utils/auth";
import { SectionLoader } from "./ui/Loader";
import { CardImage } from "./ui/CardImage";
import { getDeskPlaceholder } from "@/utils/desk-placeholder";
import {
  Box,
  Card,
  Divider,
  IconButton,
  List,
  Grid,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import Header from "./layout/Header";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { USER_CARDS, USER_DESK } from "@/routes/react-query";
import {
  invalidateDeskListQueries,
  patchDeskMetadataInCaches,
} from "@/utils/invalidateDeskQueries";
import { useProtectedRequest } from "@/utils/protected";
import ScreenRotationIcon from "@mui/icons-material/ScreenRotation";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  archiveDeskRequest,
  createCardRequest,
  deleteCardRequest,
  deleteCardImageRequest,
  fetchCardRequest,
  fetchDeskRequest,
  regenerateCardExamplesRequest,
  updateCardRequest,
  uploadCardImageRequest,
  updateDeskRequest,
  updateDeskSettingsRequest,
} from "@/services/desk/desk";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArchiveIcon from "@mui/icons-material/Archive";
import { useForm } from "react-hook-form";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  createCardSchema,
  CreateCardValues,
} from "@/schemas/createCard.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "@/context/AuthContext";
import React from "react";
import { DeskSettings, FetchDeskResponse } from "@/services/desk/desk.types";
import { DeskVisibility } from "@/schemas/createDesk.schema";
import { CARD_ORIENTATION } from "@/services/desk/desk.const";
import {
  updateDeskSchema,
  UpdateDeskValues,
} from "@/schemas/updateDesk.schema";
import { ROUTES } from "@/routes/paths";
import {
  updateCardSchema,
  UpdateCardValues,
} from "@/schemas/updateCard.schema";
import WithBottomNav from "./layout/WithBottomNav";
import { BOTTOM_NAV_HEIGHT } from "./layout/bottom-nav.constants";
import { useNotification } from "@/context/NotificationContext";
import { AnkiStyleStats } from "./ui/DeskStats";
import NewCardModal from "./modals/NewCard/NewCard.modal";
import EditDeskModal from "./modals/EditDesk/EditDesk.modal";
import DeleteDeskModal from "./modals/DeleteDesk/DeleteDesk.modal";
import DeskSettingsCardsPerSessionModal from "./modals/DeskSettings/DeskSettingsCardsPerSession.modal";
import EditCardModal from "./modals/EditCard/EditCard.modal";
import DeskSettingsCardOrientationModal from "./modals/DeskSettings/DeskSettingsCardOrientation.modal";
import DeskSettingsLanguagesModal from "./modals/DeskSettings/DeskSettingsLanguages.modal";
import StudyModeSelectModal from "./modals/StudyModeSelect.modal";
import DeskShareModal from "./modals/DeskShare/DeskShare.modal";
import { formatLanguagePair } from "@/constants/language.const";
import {
  DEFAULT_DESK_STUDY_MODE,
  STUDY_MODE_LABELS,
  studyModeLabelSx,
} from "@/constants/studyMode.const";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TranslateIcon from "@mui/icons-material/Translate";

const PLAY_BUTTON_HEIGHT = 64;

export default function DeskClient() {
  const params = useParams() as { id: string };
  const { loading, authenticated } = useAuth();
  const { accessToken } = useAuthContext();
  const queryClient = useQueryClient();
  const { call } = useProtectedRequest();

  const sub = params.id;

  const {
    data: desk,
    isLoading: isDeskLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: [USER_DESK, sub],
    enabled: !!sub,
    queryFn: async () => call((token) => fetchDeskRequest(sub, token)),
    staleTime: 5 * 60_000,
    placeholderData: () => getDeskPlaceholder(queryClient, sub),
  });

  const [anchorMenu, setAnchorMenu] = useState<Element | null>(null);
  const openMenu = Boolean(anchorMenu);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => setAnchorMenu(event.currentTarget);
  const handleMenuClose = () => setAnchorMenu(null);

  const [createCardModal, setCreateCardModal] = useState(false);
  const [updateDeskModal, setUpdateDeskModal] = useState(false);
  const [updateCardModalSub, setUpdateCardModalSub] = useState("");
  const [editCardExamples, setEditCardExamples] = useState<string[]>([]);
  const [editCardImageUrl, setEditCardImageUrl] = useState<string | null>(null);
  const [deleteDeskModal, setDeleteDeskModal] = useState(false);
  const [openSheet, setOpenSheet] = useState<null | string>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const {
    handleSubmit: handleSubmitCreateCard,
    register: registerCreateCard,
    reset: resetCreateCard,
    formState: { errors: errorsCreateCard },
    control: controlCreateCard,
  } = useForm<CreateCardValues>({
    resolver: zodResolver(createCardSchema),
    mode: "onChange",
    defaultValues: { front: [], back: [] },
  });

  const {
    handleSubmit: handleSubmitUpdateDesk,
    register: registerUpdateDesk,
    reset: resetUpdateDesk,
    formState: { errors: errorsUpdateDesk },
  } = useForm<UpdateDeskValues>({
    resolver: zodResolver(updateDeskSchema),
    mode: "onChange",
    defaultValues: { title: "", description: "" },
  });

  const {
    handleSubmit: handleSubmitUpdateCard,
    register: registerUpdateCard,
    reset: resetUpdateCard,
    formState: { errors: errorsUpdateCard },
    control: controlUpdateCard,
  } = useForm<UpdateCardValues>({
    resolver: zodResolver(updateCardSchema),
    mode: "onChange",
    defaultValues: { front: [], back: [] },
  });

  const onCreateSubmit = (data: CreateCardValues) => {
    createCardMutation.mutate({ data, token: accessToken! });
  };

  const onUpdateDeskSubmit = (data: UpdateDeskValues) => {
    updateDeskMutation.mutate({ data, token: accessToken! });
  };

  const onUpdateCardSubmit = (data: UpdateCardValues) => {
    updateCardMutation.mutate({ data, token: accessToken! });
  };

  const onArchiveDeskSubmit = () => {
    archiveDeskMutation.mutate({ token: accessToken! });
  };

  const onDeleteCardSubmit = (cardSub: string) => {
    deleteCardMutation.mutate({ token: accessToken!, cardSub });
  };

  const onUpdateSettingsSubmit = (data: DeskSettings) => {
    updateDeskSettingsMutation.mutate({ data, token: accessToken! });
  };

  const { notifySuccess, notifyError } = useNotification();

  const createCardMutation = useMutation({
    mutationFn: (payload: { data: CreateCardValues; token: string }) => {
      const values = {
        front: payload.data.front.map((item) => item.value),
        back: payload.data.back.map((item) => item.value),
      };

      const data = { desk_sub: sub, ...values };

      return call(() => createCardRequest(data, payload.token));
    },
    onSuccess: (card: { sub: string }) => {
      resetCreateCard();
      notifySuccess(`Card created successfully`);

      queryClient.invalidateQueries({ queryKey: [USER_DESK, sub] });

      if (!accessToken) return;

      const pollInterval = setInterval(async () => {
        const updatedCard = await call((token) => fetchCardRequest(card.sub, token));
        if (updatedCard.examples.length > 0) {
          clearInterval(pollInterval);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          queryClient.setQueryData([USER_DESK, sub], (old: any) => ({
            ...old,
            cards: old.cards.map((c: { sub: string }) =>
              c.sub === card.sub ? { ...c, examples: updatedCard.examples } : c
            ),
          }));
        }
      }, 4000);

      setTimeout(() => clearInterval(pollInterval), 32000);
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const [isNavigating, setIsNavigating] = useState(false);

  const updateDeskSettingsMutation = useMutation({
    mutationFn: (payload: { data: DeskSettings; token: string }) => {
      const data = { desk_sub: sub, settings: payload.data };

      return call(() => updateDeskSettingsRequest(data, payload.token));
    },
    onSuccess: () => {
      notifySuccess(`Deck settings updated successfully`);

      queryClient.invalidateQueries({ queryKey: [USER_DESK, sub] });
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const updateDeskMutation = useMutation({
    mutationFn: (payload: { data: UpdateDeskValues; token: string }) => {
      const data = { desk_sub: sub, payload: payload.data };

      return call(() => updateDeskRequest(data, payload.token));
    },
    onSuccess: (_data, variables) => {
      resetUpdateDesk();
      setUpdateDeskModal(false);
      notifySuccess(`Deck updated successfully`);

      patchDeskMetadataInCaches(queryClient, sub, variables.data);
      if (variables.data.visibility) {
        queryClient.setQueryData<FetchDeskResponse>([USER_DESK, sub], (old) =>
          old ? { ...old, visibility: variables.data.visibility! } : old
        );
      }
      void invalidateDeskListQueries(queryClient);
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const updateVisibilityMutation = useMutation({
    mutationFn: (visibility: DeskVisibility) =>
      call((token) =>
        updateDeskRequest(
          {
            desk_sub: sub,
            payload: {
              title: desk!.title,
              description: desk!.description,
              visibility,
            },
          },
          token
        )
      ),
    onSuccess: (_data, visibility) => {
      setOpenSheet(null);
      notifySuccess("Sharing settings updated");
      queryClient.setQueryData<FetchDeskResponse>([USER_DESK, sub], (old) =>
        old ? { ...old, visibility } : old
      );
    },
    onError: (err) => {
      notifyError(err.message);
    },
  });

  const updateCardMutation = useMutation({
    mutationFn: (payload: { data: UpdateCardValues; token: string }) => {
      const values = {
        front: payload.data.front.map((item) => item.value),
        back: payload.data.back.map((item) => item.value),
      };

      const data = { card_sub: updateCardModalSub, payload: values };

      return call(() => updateCardRequest(data, payload.token));
    },
    onSuccess: () => {
      resetUpdateCard();
      setUpdateCardModalSub("");
      setEditCardImageUrl(null);
      notifySuccess(`Card updated successfully`);

      queryClient.invalidateQueries({ queryKey: [USER_DESK, sub] });
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const patchCardImageInDesk = (cardSub: string, imageUrl: string | null) => {
    queryClient.setQueryData<FetchDeskResponse>([USER_DESK, sub], (old) =>
      old
        ? {
            ...old,
            cards: old.cards.map((card) =>
              card.sub === cardSub ? { ...card, image_url: imageUrl } : card
            ),
          }
        : old
    );
  };

  const uploadCardImageMutation = useMutation({
    mutationFn: (file: File) =>
      call((token) => uploadCardImageRequest(updateCardModalSub, file, token)),
    onSuccess: (data) => {
      setEditCardImageUrl(data.image_url);
      patchCardImageInDesk(updateCardModalSub, data.image_url);
      notifySuccess("Photo uploaded");
    },
    onError: (err) => {
      notifyError(err.message);
    },
  });

  const deleteCardImageMutation = useMutation({
    mutationFn: () =>
      call((token) => deleteCardImageRequest(updateCardModalSub, token)),
    onSuccess: () => {
      setEditCardImageUrl(null);
      patchCardImageInDesk(updateCardModalSub, null);
      notifySuccess("Photo removed");
    },
    onError: (err) => {
      notifyError(err.message);
    },
  });

  const archiveDeskMutation = useMutation({
    mutationFn: (payload: { token: string }) => {
      const data = { desk_sub: sub };

      return call(() => archiveDeskRequest(data, payload.token));
    },
    onSuccess: () => {
      setUpdateDeskModal(false);

      navigate(ROUTES.HOME, { replace: true });

      notifySuccess(`Deck archived successfully`);

      queryClient.invalidateQueries({ queryKey: [USER_DESK, sub] });
      void invalidateDeskListQueries(queryClient);
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: (payload: { token: string; cardSub: string }) => {
      const data = { cardSub: payload.cardSub };

      return call(() => deleteCardRequest(data, payload.token));
    },
    onSuccess: () => {
      notifySuccess(`Card deleted successfully`);

      queryClient.invalidateQueries({ queryKey: [USER_DESK, sub] });
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const regenerateExamplesMutation = useMutation({
    mutationFn: (payload: { cardSub: string; token: string }) =>
      call(() => regenerateCardExamplesRequest(payload.cardSub, payload.token)),
    onSuccess: (data) => {
      setEditCardExamples(data.examples);
      notifySuccess(
        data.examples.length > 0
          ? `Generated ${data.examples.length} examples`
          : "No examples could be generated"
      );
      queryClient.invalidateQueries({ queryKey: [USER_DESK, sub] });
      queryClient.invalidateQueries({ queryKey: [USER_CARDS, sub] });
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const cardOrientation =
    desk &&
    desk.settings &&
    desk.settings.card_orientation &&
    desk.settings.card_orientation.charAt(0).toUpperCase() +
      desk.settings.card_orientation.slice(1);

  const languagesLabel =
    desk?.settings?.front_language && desk?.settings?.back_language
      ? formatLanguagePair(
          desk.settings.front_language,
          desk.settings.back_language
        )
      : "English → Russian";

  const studyModeLabel =
    desk?.settings?.study_mode != null
      ? STUDY_MODE_LABELS[desk.settings.study_mode]
      : STUDY_MODE_LABELS[DEFAULT_DESK_STUDY_MODE];

  const settingsItems = [
    {
      key: "cardsPerSession",
      icon: <SettingsIcon />,
      title: "Cards per session",
      subtitle: "How many cards to show each session",
      value: desk?.settings.cards_per_session,
    },
    {
      key: "studyMode",
      icon: <MenuBookIcon />,
      title: "Study mode",
      subtitle: "How you practice cards in this deck",
      value: studyModeLabel,
    },
    {
      key: "cardOrientation",
      icon: <ScreenRotationIcon />,
      title: "Card orientation",
      subtitle: "How cards should be displayed",
      value: cardOrientation,
    },
    {
      key: "languages",
      icon: <TranslateIcon />,
      title: "Languages",
      subtitle: "Front, back, and example sentence languages",
      value: languagesLabel,
    },
  ];

  useEffect(() => {
    if (scrollRef.current && desk && desk.cards.length) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [desk?.cards, desk]);

  useEffect(() => {
    if (desk && updateDeskModal) {
      resetUpdateDesk({
        title: desk.title,
        description: desk.description,
      });
    }
  }, [desk, updateDeskModal, resetUpdateDesk]);

  useEffect(() => {
    if (desk && updateCardModalSub) {
      const el = desk.cards.filter(
        (item) => item.sub === updateCardModalSub
      )[0];

      resetUpdateCard({
        front: el.front_variants.map((item) => ({ value: item })),
        back: el.back_variants.map((item) => ({ value: item })),
      });
      setEditCardExamples(el.examples ?? []);
      setEditCardImageUrl(el.image_url ?? null);
    }
  }, [desk, updateCardModalSub, resetUpdateCard]);

  if (!loading && !authenticated) return null;

  return (
    <>
      <WithBottomNav>
        <Box
          sx={{
            position: "relative",
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Header
            title="Decks"
            onBack={() => navigate(-1)}
            RightButton={
              <>
                <IconButton onClick={(e) => handleMenuOpen(e)}>
                  <MoreHorizIcon sx={{ color: "white", fontSize: 30 }} />
                </IconButton>

                <Menu
                  anchorEl={anchorMenu}
                  open={openMenu}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                    }}
                    onClick={() => {
                      setAnchorMenu(null);
                      setCreateCardModal(true);
                    }}
                  >
                    <AddIcon sx={{ fontSize: 20 }} />
                    <Typography>Add card</Typography>
                  </MenuItem>

                  <MenuItem
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                    }}
                    onClick={() => {
                      setAnchorMenu(null);
                      setUpdateDeskModal(true);
                    }}
                  >
                    <EditIcon sx={{ fontSize: 18 }} />
                    <Typography>Edit desk</Typography>
                  </MenuItem>

                  <MenuItem
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                    }}
                    onClick={() => {
                      setAnchorMenu(null);
                      setOpenSheet("share");
                    }}
                  >
                    <ShareIcon sx={{ fontSize: 18 }} />
                    <Typography>Share</Typography>
                  </MenuItem>

                  <MenuItem
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      color: "red",
                    }}
                    onClick={() => {
                      setAnchorMenu(null);
                      setDeleteDeskModal(true);
                    }}
                  >
                    <ArchiveIcon sx={{ fontSize: 18 }} />
                    <Typography>Archive desk</Typography>
                  </MenuItem>
                </Menu>
              </>
            }
          />
          {!desk && (loading || isDeskLoading) ? (
            <SectionLoader />
          ) : (
            <>
          {desk && (
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              paddingBottom: `calc(${PLAY_BUTTON_HEIGHT + 16}px + ${BOTTOM_NAV_HEIGHT})`,
            }}
          >
              <Grid container spacing={2} sx={{ pt: 2, px: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      width: "100%",
                    }}
                  >
                    <Grid size={{ xs: 12 }} mb={desk.cards.length ? 1 : 2}>
                      <Typography variant="h4" fontWeight={600}>
                        {desk.title}
                      </Typography>
                    </Grid>

                    {(!!desk.cards.length || desk.stats.total_cards > 0) && (
                      <Grid size={{ xs: 12 }}>
                        <AnkiStyleStats stats={desk.stats} />
                      </Grid>
                    )}

                    <Grid
                      size={{ xs: 12 }}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignContent: "center",
                      }}
                    >
                      <Typography variant="h6" fontWeight={600}>
                        Cards
                      </Typography>

                      {!!desk.cards.length && (
                        <KeyboardArrowRightIcon
                          fontSize="large"
                          sx={{ cursor: "pointer" }}
                          onClick={() => navigate(`/desk/${sub}/cards`)}
                        />
                      )}
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      {isPlaceholderData && (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                          <CircularProgress size={28} />
                        </Box>
                      )}

                      {!isPlaceholderData && !desk.cards?.length && (
                        <Typography sx={{ display: "inline" }}>
                          You don&apos;t have any cards yet.{" "}
                          <Typography
                            component="span"
                            sx={{
                              display: "inline",
                              cursor: "pointer",
                              color: "primary.main",
                            }}
                            fontWeight={700}
                            onClick={() => {
                              setAnchorMenu(null);
                              setCreateCardModal(true);
                            }}
                          >
                            Add one?
                          </Typography>
                        </Typography>
                      )}

                      {!isPlaceholderData && (
                      <Box
                        ref={scrollRef}
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          overflowY: "hidden",
                          py: 1,
                          pb: 2,
                          px: 0.5,
                          scrollSnapType: "x proximity",
                          width: "100%",
                          boxSizing: "border-box",
                          "&::-webkit-scrollbar": { display: "none" },
                          overscrollBehaviorX: "contain",

                          flexWrap: {
                            xs: "nowrap",
                            md: "wrap",
                          },
                          overflowX: {
                            xs: "auto",
                            md: "hidden",
                          },
                        }}
                      >
                        {desk.cards?.map((card) => (
                          <Card
                            key={card.sub}
                            sx={{
                              flex: {
                                xs: "0 0 44vw",
                                sm: "0 0 40vw",
                                md: "0 0 calc(33.333% - 8px)",
                                lg: "0 0 calc(25% - 8px)",
                              },
                              maxWidth: {
                                xs: "44vw",
                                sm: "40vw",
                                md: "200px",
                                lg: "220px",
                              },
                              height: {
                                xs: "44vw",
                                sm: "40vw",
                                md: "200px",
                                lg: "220px",
                              },
                              scrollSnapAlign: "start",
                              boxShadow: 3,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              px: 2,
                              py: 3,
                              textAlign: "center",
                              transition: "0.25s ease",
                              position: "relative",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: 6,
                              },
                            }}
                            onClick={() => setUpdateCardModalSub(card.sub)}
                          >
                            <IconButton
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                bgcolor: "background.paper",
                                "&:hover": { bgcolor: "error.light" },
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteCardSubmit(card.sub);
                              }}
                            >
                              <DeleteIcon fontSize="small" color="error" />
                            </IconButton>
                            {card.image_url && (
                              <Box sx={{ mb: 1 }}>
                                <CardImage url={card.image_url} size="thumb" />
                              </Box>
                            )}
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 600, mb: 1 }}
                            >
                              {card.front_variants[0]}
                              {card.front_variants.length > 1 && (
                                <Box
                                  component="span"
                                  sx={{
                                    fontWeight: 400,
                                    color: "text.secondary",
                                    ml: 0.5,
                                  }}
                                >
                                  +{card.front_variants.length - 1} more
                                </Box>
                              )}
                            </Typography>

                            <Box
                              sx={{
                                width: "60%",
                                height: "2px",
                                bgcolor: "divider",
                                my: 1,
                                borderRadius: 1,
                              }}
                            />

                            <Typography
                              variant="body2"
                              sx={{ color: "text.primary" }}
                            >
                              {card.back_variants[0]}
                              {card.back_variants.length > 1 && (
                                <Box
                                  component="span"
                                  sx={{
                                    fontWeight: 400,
                                    color: "text.secondary",
                                    ml: 0.5,
                                  }}
                                >
                                  +{card.back_variants.length - 1} more
                                </Box>
                              )}
                            </Typography>
                          </Card>
                        ))}

                        {desk.stats.total_cards > desk.cards.length && (
                          <Box
                            key="empty"
                            sx={{
                              flex: "0 0 44vw",
                              maxWidth: "44vw",
                              height: "44vw",
                              scrollSnapAlign: "start",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              px: 2,
                              py: 3,
                              textAlign: "center",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/desk/${sub}/cards`);
                            }}
                          >
                            <IconButton size="large">
                              <ArrowForwardIcon fontSize="large" />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                      )}
                    </Grid>

                    {!isPlaceholderData && (
                    <>
                    <Grid size={{ xs: 12 }} mb={1}>
                      <Typography variant="h6" fontWeight={600}>
                        Settings
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <List
                        sx={{
                          width: "100%",
                          bgcolor: "background.paper",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        {settingsItems.map((item, index) => (
                          <React.Fragment key={item.key}>
                            <ListItemButton
                              onClick={() => setOpenSheet(item.key)}
                              sx={{
                                py: 2,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
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
                                  item.key === "studyMode"
                                    ? studyModeLabelSx
                                    : undefined
                                }
                              >
                                {item.value}
                              </Typography>
                            </ListItemButton>

                            {index !== settingsItems.length - 1 && <Divider component="li" />}
                          </React.Fragment>
                        ))}
                      </List>
                    </Grid>
                    </>
                    )}
                  </Box>
                </Grid>
          </Box>
          )}

          {desk && !!desk.cards.length && (
            <Box
              sx={{
                position: "fixed",
                bottom: BOTTOM_NAV_HEIGHT,
                left: 0,
                right: 0,
                px: 2,
                pb: 1,
                zIndex: 1200,
              }}
            >
              <Card
                sx={{
                  py: 1.5,
                  textAlign: "center",
                  fontWeight: 700,
                  boxShadow: 4,
                  borderRadius: 2,
                  bgcolor: desk?.cards.length ? "primary.main" : "#5a5a5a",
                  color: "white",
                  "&:active": {
                    transform: desk?.cards.length ? "scale(0.98)" : "scale(1)",
                  },
                  cursor: desk?.cards.length ? "pointer" : "not-allowed",
                }}
                onClick={() => {
                  if (!desk?.cards.length) return;

                  setIsNavigating(true);
                  navigate(`/desk/${sub}/play`, {
                    replace: true,
                    state: { from: `/desk/${sub}` },
                  });
                }}
              >
                {isNavigating ? (
                  <CircularProgress
                    size={20}
                    thickness={4}
                    sx={{
                      color: "white",
                    }}
                  />
                ) : (
                  "Play"
                )}
              </Card>
            </Box>
          )}
            </>
          )}
        </Box>
      </WithBottomNav>

      {createCardModal && (
        <NewCardModal
          open={createCardModal}
          onClose={() => {
            resetCreateCard();
            setCreateCardModal(false);
          }}
          errors={errorsCreateCard}
          control={controlCreateCard}
          register={registerCreateCard}
          onSubmit={handleSubmitCreateCard(onCreateSubmit)}
          isSubmitting={createCardMutation.isPending}
        />
      )}

      {desk && updateDeskModal && (
        <EditDeskModal
          open={updateDeskModal}
          onClose={() => setUpdateDeskModal(false)}
          errors={errorsUpdateDesk}
          register={registerUpdateDesk}
          onSubmit={handleSubmitUpdateDesk(onUpdateDeskSubmit)}
        />
      )}

      {desk && updateCardModalSub && (
        <EditCardModal
          open={!!updateCardModalSub}
          onClose={() => setUpdateCardModalSub("")}
          errors={errorsUpdateCard}
          register={registerUpdateCard}
          onSubmit={handleSubmitUpdateCard(onUpdateCardSubmit)}
          control={controlUpdateCard}
          examples={editCardExamples}
          onRegenerateExamples={() =>
            regenerateExamplesMutation.mutate({
              cardSub: updateCardModalSub,
              token: accessToken!,
            })
          }
          isRegeneratingExamples={regenerateExamplesMutation.isPending}
          imageUrl={editCardImageUrl}
          onImageSelected={(file) => uploadCardImageMutation.mutate(file)}
          onImageDelete={() => deleteCardImageMutation.mutate()}
          isImageUploading={uploadCardImageMutation.isPending}
          isImageDeleting={deleteCardImageMutation.isPending}
          onDelete={() => onDeleteCardSubmit(updateCardModalSub)}
        />
      )}

      {desk && deleteDeskModal && (
        <DeleteDeskModal
          open={deleteDeskModal}
          onClose={() => setDeleteDeskModal(false)}
          onSubmit={onArchiveDeskSubmit}
        />
      )}

      {desk && openSheet === "cardsPerSession" && (
        <DeskSettingsCardsPerSessionModal
          setOpenSheet={setOpenSheet}
          currentValue={desk?.settings.cards_per_session}
          onClose={(value: number) => {
            if (value === desk.settings.cards_per_session) return;

            onUpdateSettingsSubmit({
              ...desk.settings,
              cards_per_session: value,
            });
          }}
        />
      )}

      {desk && openSheet === "cardOrientation" && (
        <DeskSettingsCardOrientationModal
          setOpenSheet={setOpenSheet}
          currentValue={desk?.settings.card_orientation}
          onClose={(value: CARD_ORIENTATION) => {
            if (value === desk.settings.card_orientation) return;

            onUpdateSettingsSubmit({
              ...desk.settings,
              card_orientation: value,
            });
          }}
        />
      )}

      {desk && openSheet === "studyMode" && (
        <StudyModeSelectModal
          setOpenSheet={setOpenSheet}
          currentValue={desk.settings.study_mode ?? DEFAULT_DESK_STUDY_MODE}
          onClose={(value) => {
            if (value === (desk.settings.study_mode ?? DEFAULT_DESK_STUDY_MODE)) return;

            onUpdateSettingsSubmit({
              ...desk.settings,
              study_mode: value,
            });
          }}
        />
      )}

      {desk && openSheet === "languages" && (
        <DeskSettingsLanguagesModal
          setOpenSheet={setOpenSheet}
          currentValue={{
            front_language: desk.settings.front_language,
            back_language: desk.settings.back_language,
            example_language: desk.settings.example_language,
          }}
          onClose={(value) => {
            const unchanged =
              value.front_language === desk.settings.front_language &&
              value.back_language === desk.settings.back_language &&
              value.example_language === desk.settings.example_language;

            if (unchanged) return;

            onUpdateSettingsSubmit({
              ...desk.settings,
              ...value,
            });
          }}
        />
      )}

      {desk && openSheet === "share" && (
        <DeskShareModal
          currentVisibility={desk.visibility ?? "private"}
          onClose={() => setOpenSheet(null)}
          onSave={(visibility) => updateVisibilityMutation.mutate(visibility)}
          isSaving={updateVisibilityMutation.isPending}
        />
      )}
    </>
  );
}
