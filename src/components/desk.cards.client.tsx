
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/utils/auth";
import { FullPageLoader, Loader } from "./ui/Loader";
import { Box, Card, IconButton, Typography } from "@mui/material";
import Header from "./layout/Header";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { USER_CARDS, USER_DESK } from "@/routes/react-query";
import { useProtectedRequest } from "@/utils/protected";
import {
  deleteCardRequest,
  fetchDeskCardsRequest,
  updateCardRequest,
} from "@/services/desk/desk";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "@/context/AuthContext";
import EditCardModal from "./modals/EditCard/EditCard.modal";
import {
  updateCardSchema,
  UpdateCardValues,
} from "@/schemas/updateCard.schema";
import WithBottomNav from "./layout/WithBottomNav";
import { BOTTOM_NAV_HEIGHT } from "./layout/bottom-nav.constants";
import { useNotification } from "@/context/NotificationContext";

const PLAY_BUTTON_HEIGHT = 64;

export default function DeskCardsClient() {
  const params = useParams() as { id: string };
  const { loading, authenticated } = useAuth();
  const { accessToken } = useAuthContext();
  const queryClient = useQueryClient();
  const { call } = useProtectedRequest();

  const sub = params.id;

  const { data: cards, isLoading: isDeskLoading } = useQuery({
    queryKey: [USER_CARDS, sub],
    enabled: !!sub,
    queryFn: async () => call((token) => fetchDeskCardsRequest(sub, token)),
    placeholderData: () => queryClient.getQueryData([USER_CARDS, sub]),
  });

  const [updateCardModalSub, setUpdateCardModalSub] = useState("");

  const navigate = useNavigate();

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

  const onUpdateCardSubmit = (data: UpdateCardValues) => {
    updateCardMutation.mutate({ data, token: accessToken! });
  };

  const onDeleteCardSubmit = (cardSub: string) => {
    deleteCardMutation.mutate({ token: accessToken!, cardSub });
  };

  const { notifySuccess, notifyError } = useNotification();

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
      queryClient.invalidateQueries({ queryKey: [USER_CARDS, sub] });
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
      queryClient.invalidateQueries({ queryKey: [USER_CARDS, sub] });
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  useEffect(() => {
    if (cards && updateCardModalSub) {
      const el = cards.filter((item) => item.sub === updateCardModalSub)[0];

      resetUpdateCard({
        front: el.frontVariants.map((item) => ({ value: item })),
        back: el.backVariants.map((item) => ({ value: item })),
      });
    }
  }, [cards, updateCardModalSub, resetUpdateCard]);

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
          <Header title="Deck Cards" onBack={() => navigate(-1)} />
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
                paddingBottom: `calc(${PLAY_BUTTON_HEIGHT + 16}px + ${BOTTOM_NAV_HEIGHT})`,
                display: isDeskLoading ? "flex" : undefined,
                alignItems: isDeskLoading ? "center" : undefined,
              }}
            >
              {isDeskLoading && <Loader />}

              {cards && !!cards.length && (
                <Box sx={{ pt: 2, px: 2 }}>
                  <Box
                    sx={{
                      display: {
                        xs: "grid",
                        md: "flex",
                      },
                      gridTemplateColumns: {
                        xs: "1fr 1fr",
                      },
                      gap: {
                        xs: 1,
                        md: 2,
                      },
                      width: "100%",

                      flexWrap: {
                        xs: "nowrap",
                        md: "wrap",
                      },
                      justifyContent: "stretch",
                      overflowX: {
                        xs: "visible",
                        md: "hidden",
                      },
                    }}
                  >
                    {cards?.map((card, index) => (
                      <Card
                        key={card.sub}
                        sx={{
                          gridColumn: {
                            xs: (index % 2) + 1,
                            md: "unset",
                          },
                          gridRow: {
                            xs: Math.floor(index / 2) + 1,
                            md: "unset",
                          },
                          flex: {
                            xs: "0 0 auto",
                            md: "0 0 calc(33.333% - 16px)",
                            lg: "0 0 calc(25% - 16px)",
                          },
                          width: {
                            xs: "100%",
                            md: "auto",
                          },
                          maxWidth: {
                            xs: "none",
                            md: "200px",
                            lg: "220px",
                          },
                          minWidth: {
                            md: "180px",
                          },
                          height: {
                            xs: "44vw",
                            sm: "40vw",
                            md: "200px",
                            lg: "220px",
                          },
                          boxShadow: 3,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          px: 2,
                          py: 3,
                          mb: 1,
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
                          {card.frontVariants[0]}
                          {card.frontVariants.length > 1 && (
                            <Box
                              component="span"
                              sx={{
                                fontWeight: 400,
                                color: "text.secondary",
                                ml: 0.5,
                              }}
                            >
                              +{card.frontVariants.length - 1} more
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
                          {card.backVariants[0]}
                          {card.backVariants.length > 1 && (
                            <Box
                              component="span"
                              sx={{
                                fontWeight: 400,
                                color: "text.secondary",
                                ml: 0.5,
                              }}
                            >
                              +{card.backVariants.length - 1} more
                            </Box>
                          )}
                        </Typography>
                      </Card>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </WithBottomNav>

      {cards && updateCardModalSub && (
        <EditCardModal
          open={!!updateCardModalSub}
          onClose={() => setUpdateCardModalSub("")}
          errors={errorsUpdateCard}
          register={registerUpdateCard}
          onSubmit={handleSubmitUpdateCard(onUpdateCardSubmit)}
          control={controlUpdateCard}
          examples={
            cards?.find((c) => c.sub === updateCardModalSub)?.examples || []
          }
          onDelete={() => onDeleteCardSubmit(updateCardModalSub)}
        />
      )}
    </>
  );
}
