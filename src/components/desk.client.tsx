"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/utils/auth";
import { FullPageLoader, Loader } from "./ui/Loader";
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
} from "@mui/material";
import Header from "./layout/Header";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { USER_DESK, USER_DESKS } from "@/routes/react-query";
import { useProtectedRequest } from "@/utils/protected";
import ScreenRotationIcon from "@mui/icons-material/ScreenRotation";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  archiveDeskRequest,
  createCardRequest,
  deleteCardRequest,
  fetchCardRequest,
  fetchDeskRequest,
  updateCardRequest,
  updateDeskRequest,
  updateDeskSettingsRequest,
} from "@/services/desk/desk";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import NewCardModal from "./modals/NewCard/NewCard.modal";
import ArchiveIcon from "@mui/icons-material/Archive";
import { useForm } from "react-hook-form";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  createCardSchema,
  CreateCardValues,
} from "@/schemas/createCard.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "@/context/AuthContext";
import { notifyError, notifySuccess } from "@/utils/notification";
import React from "react";
import DeskSettingsCardsPerSessionModal from "./modals/DeskSettings/DeskSettingsCardsPerSession.modal";
import { DeskSettings } from "@/services/desk/desk.types";
import DeskSettingsCardOrientationModal from "./modals/DeskSettings/DeskSettingsCardOrientation.modal";
import { CARD_ORIENTATION } from "@/services/desk/desk.const";
import {
  updateDeskSchema,
  UpdateDeskValues,
} from "@/schemas/updateDesk.schema";
import EditDeskModal from "./modals/EditDesk/EditDesk.modal";
import DeleteDeskModal from "./modals/DeleteDesk/DeleteDesk.modal";
import { ROUTES } from "@/routes/next";
import EditCardModal from "./modals/EditCard/EditCard.modal";
import {
  updateCardSchema,
  UpdateCardValues,
} from "@/schemas/updateCard.schema";
import { AnkiStyleStats } from "./ui/DeskStats";
import WithBottomNav from "./layout/WithBottomNav";

const BOTTOM_NAV_HEIGHT = 36 + 4 * 10;
const PLAY_BUTTON_HEIGHT = 64;

export default function DeskClient() {
  const params = useParams() as { id: string };
  const { loading, authenticated } = useAuth();
  const { accessToken } = useAuthContext();
  const queryClient = useQueryClient();
  const { call } = useProtectedRequest();

  const sub = params.id;

  const { data: desk, isLoading: isDeskLoading } = useQuery({
    queryKey: [USER_DESK, sub],
    enabled: !!sub,
    queryFn: async () => call((token) => fetchDeskRequest(sub, token)),
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
  const [deleteDeskModal, setDeleteDeskModal] = useState(false);
  const [openSheet, setOpenSheet] = useState<null | string>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

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
        const updatedCard = await fetchCardRequest(card.sub, accessToken);
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
    onSuccess: () => {
      resetUpdateDesk();
      setUpdateDeskModal(false);
      notifySuccess(`Deck updated successfully`);

      queryClient.invalidateQueries({ queryKey: [USER_DESK, sub] });
      queryClient.invalidateQueries({ queryKey: [USER_DESKS] });
    },
    onError: (err) => {
      console.warn(err);
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
      notifySuccess(`Card updated successfully`);

      queryClient.invalidateQueries({ queryKey: [USER_DESK, sub] });
    },
    onError: (err) => {
      console.warn(err);
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

      router.replace(ROUTES.HOME);

      notifySuccess(`Deck archived successfully`);

      queryClient.invalidateQueries({ queryKey: [USER_DESK, sub] });
      queryClient.invalidateQueries({ queryKey: [USER_DESKS] });
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

  const cardOrientation =
    desk &&
    desk.settings &&
    desk.settings.card_orientation &&
    desk.settings.card_orientation.charAt(0).toUpperCase() +
      desk.settings.card_orientation.slice(1);

  const settingsItems = [
    {
      key: "cardsPerSession",
      icon: <SettingsIcon />,
      title: "Cards per session",
      subtitle: "How many cards to show each session",
      value: desk?.settings.cards_per_session,
    },
    {
      key: "cardOrientation",
      icon: <ScreenRotationIcon />,
      title: "Card orientation",
      subtitle: "How cards should be displayed",
      value: cardOrientation,
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
    }
  }, [desk, updateCardModalSub, resetUpdateCard]);

  if (loading) return <FullPageLoader />;

  if (!authenticated) return null;

  return (
    <>
      <WithBottomNav>
        <Box
          sx={{
            position: "relative",
          }}
        >
          <Header
            title="Decks"
            onBack={() => router.push(ROUTES.HOME)}
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
          <Box
            sx={{
              flex: 1,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                paddingBottom: `${
                  BOTTOM_NAV_HEIGHT + PLAY_BUTTON_HEIGHT + 16
                }px`,
                display: isDeskLoading ? "flex" : undefined,
                alignItems: isDeskLoading ? "center" : undefined,
              }}
            >
              {isDeskLoading && <Loader />}

              {desk && (
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

                    {!!desk.cards.length && (
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
                          onClick={() => router.push(`${desk.sub}/cards`)}
                        />
                      )}
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      {!desk.cards?.length && (
                        <Typography sx={{ display: "inline" }}>
                          You don&apos;t have any cards yet.{" "}
                          <Typography
                            component="span"
                            sx={{
                              display: "inline",
                              cursor: "pointer",
                              color: "#5961d3",
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

                      <Box
                        ref={scrollRef}
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          overflowX: "auto",
                          overflowY: "hidden",
                          py: 1,
                          pb: 2,
                          px: 0.5,
                          scrollSnapType: "x proximity",
                          width: "100%",
                          boxSizing: "border-box",
                          "&::-webkit-scrollbar": { display: "none" },
                          overscrollBehaviorX: "contain",
                        }}
                      >
                        {desk.cards?.map((card) => (
                          <Card
                            key={card.sub}
                            sx={{
                              flex: "0 0 44vw",
                              maxWidth: "44vw",
                              height: "44vw",
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
                              router.push(`${desk.sub}/cards`);
                            }}
                          >
                            <IconButton size="large">
                              <ArrowForwardIcon fontSize="large" />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    </Grid>

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
                              >
                                {item.value}
                              </Typography>
                            </ListItemButton>

                            {index !== 1 && <Divider component="li" />}
                          </React.Fragment>
                        ))}
                      </List>
                    </Grid>
                  </Box>
                </Grid>
              )}
            </Box>
          </Box>

          {desk && !!desk.cards.length && (
            <Box
              sx={{
                position: "fixed",
                bottom: `${BOTTOM_NAV_HEIGHT}px`,
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
                  bgcolor: desk?.cards.length ? "#5961d3" : "#5a5a5a",
                  color: "white",
                  "&:active": {
                    transform: desk?.cards.length ? "scale(0.98)" : "scale(1)",
                  },
                  cursor: desk?.cards.length ? "pointer" : "not-allowed",
                }}
                onClick={() => {
                  if (!desk?.cards.length) return;
                  router.push(`/desk/${sub}/play`);
                }}
              >
                Play
              </Card>
            </Box>
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
          examples={
            desk.cards?.find((c) => c.sub === updateCardModalSub)?.examples ||
            []
          }
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
    </>
  );
}
