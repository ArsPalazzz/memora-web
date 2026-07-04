
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
  Fade,
  Collapse,
  CircularProgress,
  ListItemIcon,
  ListItem,
  List,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useProtectedRequest } from "@/utils/protected";
import { FullPageLoader } from "@/components/ui/Loader";
import {
  Favorite,
  ArrowUpward,
  Translate,
  MenuBook,
} from "@mui/icons-material";
import {
  startFeedSessionRequest,
  getFeedNextCardRequest,
  shownCardRequest,
  answerCardFeedRequest,
  gradeCardFeedRequest,
} from "@/services/games/games";
import { MY_PROFILE, USER_DESKS_SHORT } from "@/routes/react-query";
import { getMyProfileRequest } from "@/services/user/user";
import { DEFAULT_FEED_STUDY_MODE } from "@/constants/studyMode.const";
import FeedStudyPlay from "@/components/feedStudyPlay.client";
import {
  invalidateUserDaily,
  shouldInvalidateDailyAfterWriteAnswer,
} from "@/utils/invalidateUserDaily";
import {
  addCardToDeskFeedRequest,
  fetchMyDesksShortRequest,
} from "@/services/desk/desk";
import WithBottomNav from "@/components/layout/WithBottomNav";
import Header from "./layout/Header";
import { VIEWPORT_SHELL_SX } from "./layout/viewport.constants";
import { ROUTES } from "@/routes/paths";
import { useSwipeable } from "react-swipeable";
import CardExamplesModal from "./modals/CardExamples/CardExamples.modal";
import { useAuthContext } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";

interface FeedCard {
  sub: string;
  text: string[];
  backVariants: string[];
  imageUuid?: string;
  deskTitle: string;
  deskSub: string;
  globalStats: {
    shown: number;
    liked: number;
    answered: number;
  };
  examples: string[];
}

const GRADE_COLORS: Record<number, string> = {
  0: "#e53935",
  1: "#fb8c00",
  2: "#fbc02d",
  3: "#43a047",
  4: "#2e7d32",
};

const GRADE_OPTIONS = [
  { quality: 0, label: "Forgot" },
  { quality: 1, label: "Hard" },
  { quality: 2, label: "Okay" },
  { quality: 3, label: "Good" },
  { quality: 4, label: "Easy" },
] as const;

const SWIPE_THRESHOLD = 140;
const SWIPE_EXIT_MS = 360;
const SWIPE_TRANSITION =
  "transform 0.42s cubic-bezier(0.34, 1.35, 0.64, 1), opacity 0.32s ease";
const SWIPE_EXIT_TRANSITION =
  "transform 0.36s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.28s ease";

function cardRotate(offset: number) {
  return offset * 0.012;
}

export default function FeedPage() {
  const { call } = useProtectedRequest();

  const { data: feedStudyMode, isLoading: profileLoading } = useQuery({
    queryKey: [MY_PROFILE],
    queryFn: () => call((token) => getMyProfileRequest(token)),
    select: (data) => data.settings.study_mode ?? DEFAULT_FEED_STUDY_MODE,
  });

  if (profileLoading) {
    return <FullPageLoader />;
  }

  const studyMode = feedStudyMode ?? DEFAULT_FEED_STUDY_MODE;

  if (studyMode === "swipe") {
    return <FeedSwipePage />;
  }

  return <FeedStudyPlay preferredMode={studyMode} />;
}

function FeedSwipePage() {
  const navigate = useNavigate();
  const { call } = useProtectedRequest();
  const { accessToken } = useAuthContext();
  const queryClient = useQueryClient();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [cards, setCards] = useState<FeedCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [addedToDesks, setAddedToDesks] = useState<{
    [cardSub: string]: string[];
  }>({});
  const [result, setResult] = useState<{
    isCorrect: boolean;
    correctVariants: string[];
  } | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [showGrades, setShowGrades] = useState(false);
  const [addToDeskDialog, setAddToDeskDialog] = useState(false);
  const [selectedDesks, setSelectedDesks] = useState<string[]>([]);
  const [selectedDesk, setSelectedDesk] = useState<string>("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    severity: "success" as any,
  });
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isGradingRequired, setIsGradingRequired] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isGradingPending, setGradingPending] = useState(false);

  const exitTimerRef = useRef<number | null>(null);

  const cardsLengthRef = useRef(cards.length);

  const [showTranslation, setShowTranslation] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const currentCard = cards[currentIndex];
  const initialLoadedRef = useRef(false);
  const shownRef = useRef<Set<string>>(new Set());

  const { data: myDesks, isLoading: isDesksLoading } = useQuery({
    queryKey: [USER_DESKS_SHORT],
    queryFn: async () => call((token) => fetchMyDesksShortRequest(token)),
  });

  const startSession = useCallback(async () => {
    try {
      const { sessionId } = await call((token) =>
        startFeedSessionRequest(token)
      );
      setSessionId(sessionId);

      const data = await call((token) =>
        getFeedNextCardRequest({ sessionId }, token)
      );

      setCards(data.cards);
      setCurrentIndex(0);

      await call((token) =>
        shownCardRequest({ sessionId, cardSub: data.cards[0].sub }, token)
      );
    } catch (err) {
      console.error("Failed to start session:", err);
    } finally {
      setLoading(false);
    }
  }, [call]);

  useEffect(() => {
    if (!initialLoadedRef.current) {
      initialLoadedRef.current = true;
      startSession();
    }
  }, [startSession]);

  const resetCardState = () => {
    setShowAnswer(false);
    setUserAnswer("");
    setResult(null);
    setIsAnswering(false);
    setShowGrades(false);
    setIsGradingRequired(false);
    setSwipeOffset(0);
    setIsSwiping(false);
    setIsAnimatingOut(false);
  };

  const clearExitTimer = () => {
    if (exitTimerRef.current !== null) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
  };

  const snapBack = useCallback(() => {
    setIsSwiping(false);
    requestAnimationFrame(() => {
      setSwipeOffset(0);
    });
  }, []);

  const animateSwipeExit = useCallback(
    (targetOffset: number, onComplete: () => void) => {
      clearExitTimer();
      setIsSwiping(false);
      setIsAnimatingOut(true);
      setShowTranslation(false);
      setSwipeOffset(targetOffset);

      exitTimerRef.current = window.setTimeout(() => {
        setIsAnimatingOut(false);
        setSwipeOffset(0);
        exitTimerRef.current = null;
        onComplete();
      }, SWIPE_EXIT_MS);
    },
    []
  );

  useEffect(() => {
    return () => clearExitTimer();
  }, []);

  const markShownOnce = async (cardSub: string) => {
    if (!sessionId) return;

    if (shownRef.current.has(cardSub)) {
      return;
    }

    shownRef.current.add(cardSub);

    await call((token) =>
      shownCardRequest(
        {
          sessionId,
          cardSub,
        },
        token
      )
    );
  };

  useEffect(() => {
    cardsLengthRef.current = cards.length;
  }, [cards.length]);

  const goToNextCard = async () => {
    if (!sessionId) return;

    const nextIndex = currentIndex + 1;
    const nextCard = cards[nextIndex];
    if (!nextCard) return;

    setCurrentIndex(nextIndex);
    resetCardState();

    await markShownOnce(nextCard.sub);

    if (nextIndex === cardsLengthRef.current - 4) {
      const data = await call((token) =>
        getFeedNextCardRequest({ sessionId }, token)
      );

      if (data?.cards?.[0]) {
        setCards((prev) => {
          const newCards = [...prev, data.cards[0]];
          cardsLengthRef.current = newCards.length;
          return newCards;
        });
      }
    }
  };

  const goToPrevCard = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((i) => i - 1);
    resetCardState();
  };

  const swipeHandlers = useSwipeable({
    onSwiping: (e) => {
      if (isAnimatingOut || isGradingRequired) return;

      if (e.dir !== "Up" && e.dir !== "Down") return;

      let delta = e.deltaY;

      if (e.dir === "Down" && currentIndex === 0) {
        delta = e.deltaY * 0.28;
      }

      if (e.dir === "Up" && currentIndex === cards.length - 1) {
        delta = e.deltaY * 0.28;
      }

      setIsSwiping(true);
      setSwipeOffset(delta);
    },
    onSwiped: (e) => {
      if (isAnimatingOut || isGradingRequired) return;

      if (e.dir === "Down" && currentIndex === 0) {
        snapBack();
        return;
      }

      if (e.dir === "Up" && currentIndex === cards.length - 1) {
        snapBack();
        return;
      }

      if (e.dir === "Up" && -e.deltaY > SWIPE_THRESHOLD) {
        animateSwipeExit(-window.innerHeight, goToNextCard);
        return;
      }

      if (e.dir === "Down" && e.deltaY > SWIPE_THRESHOLD && currentIndex > 0) {
        animateSwipeExit(window.innerHeight, goToPrevCard);
        return;
      }

      snapBack();
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
    delta: 10,
  });

  const handleSubmitAnswer = async () => {
    if (!sessionId || !userAnswer.trim() || !currentCard) return;

    setIsAnswering(true);

    try {
      const response = await call((token) =>
        answerCardFeedRequest(
          {
            sessionId,
            answer: userAnswer,
            cardSub: currentCard.sub,
          },
          token
        )
      );

      setResult({
        isCorrect: response.isCorrect,
        correctVariants: response.correctVariants,
      });
      if (shouldInvalidateDailyAfterWriteAnswer(response.isCorrect)) {
        invalidateUserDaily(queryClient);
      }
      setShowAnswer(true);

      setShowGrades(true);
      setIsGradingRequired(true);
    } catch (error) {
      console.error("Answer failed:", error);
    } finally {
      setIsAnswering(false);
    }
  };

  const handleGrade = async (quality: number) => {
    if (!sessionId || !currentCard || isGradingPending) return;

    setGradingPending(true);

    try {
      await call((token) =>
        gradeCardFeedRequest(
          {
            sessionId,
            quality,
            cardSub: currentCard.sub,
          },
          token
        )
      );

      setShowGrades(false);
      setIsGradingRequired(false);
      setShowTranslation(false);
      setTimeout(() => {
        goToNextCard();
      }, 300);
    } catch (error) {
      console.error("Grade failed:", error);
    }

    setGradingPending(false);
  };

  const progress = Math.min(Math.max(-swipeOffset / SWIPE_THRESHOLD, 0), 1);
  const cardTransition = isSwiping
    ? "none"
    : isAnimatingOut
      ? SWIPE_EXIT_TRANSITION
      : SWIPE_TRANSITION;

  const { notifySuccess, notifyError } = useNotification();

  const addCardToDeskMutation = useMutation({
    mutationFn: (payload: {
      data: { cardSub: string; deskSubs: string[] };
      token: string;
    }) => {
      return call(() => addCardToDeskFeedRequest(payload.token, payload.data));
    },
    onSuccess: (_, variables) => {
      setAddedToDesks((prev) => ({
        ...prev,
        [variables.data.cardSub]: variables.data.deskSubs,
      }));

      setAddToDeskDialog(false);
      setSelectedDesk("");
      notifySuccess(`Card added successfully`);
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  if (loading) return <FullPageLoader />;

  if (!currentCard && cards.length === 0) {
    return (
      <WithBottomNav>
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            No more cards to discover right now
          </Typography>
          <Typography color="text.secondary">
            Come back later for more learning!
          </Typography>
        </Box>
      </WithBottomNav>
    );
  }

  const cardColor =
    result === null
      ? "background.paper"
      : result.isCorrect
      ? "successBg"
      : "errorBg";

  return (
    <Box sx={VIEWPORT_SHELL_SX}>
      <Header title="Feed" onBack={() => navigate(ROUTES.HOME)} />
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          touchAction: "none",
        }}
      >
        <Box
          sx={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {cards.map((card, index) => {
            const isCurrent = index === currentIndex;
            const isNext = index === currentIndex + 1;
            const isPrev = index === currentIndex - 1;

            const isSwipingDown = swipeOffset > 0;
            const isSwipingUp = swipeOffset < 0;

            const clampedOffset = Math.max(
              Math.min(swipeOffset, window.innerHeight),
              -window.innerHeight
            );

            const downProgress = Math.min(clampedOffset / SWIPE_THRESHOLD, 1);
            const rotate = cardRotate(clampedOffset);

            return (
              <Box
                key={card.sub}
                {...(isCurrent ? swipeHandlers : {})}
                sx={{
                  position: "absolute",
                  inset: 0,
                  px: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: isPrev ? 5 : isCurrent ? 3 : isNext ? 2 : 1,
                  pointerEvents:
                    isCurrent && isGradingRequired ? "none" : "auto",
                  cursor: isCurrent && isGradingRequired ? "default" : "grab",
                  willChange: isCurrent && (isSwiping || isAnimatingOut)
                    ? "transform, opacity"
                    : undefined,

                  transform: isCurrent
                    ? isSwipingUp
                      ? `translateY(${clampedOffset}px) rotate(${rotate}deg)`
                      : `translateY(0px) rotate(0deg)`
                    : isPrev
                      ? isSwipingDown
                        ? `translateY(${-window.innerHeight + clampedOffset}px) scale(${1.04 - downProgress * 0.04}) rotate(${-rotate * 0.5}deg)`
                        : `translateY(-${window.innerHeight}px) scale(1)`
                      : isNext
                        ? `translateY(0px) scale(${0.94 + progress * 0.06})`
                        : "translateY(100%)",
                  opacity: isPrev
                    ? 1
                    : isCurrent
                      ? 1 - Math.min(Math.abs(clampedOffset) / (window.innerHeight * 0.85), 0.15)
                      : isNext
                        ? 0.88 + progress * 0.12
                        : 0,
                  transition: cardTransition,
                }}
              >
                <Card
                  sx={{
                    width: "100%",
                    height: "94%",
                    borderRadius: 4,
                    boxShadow: 6,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "auto",
                    bgcolor: cardColor,
                  }}
                >
                  {isCurrent && !showAnswer && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 72,
                        right: 40,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2.5,
                        zIndex: 2,
                        pointerEvents: "none",
                        "@keyframes feedActionFadeIn": {
                          from: { opacity: 0.55, transform: "translateX(8px)" },
                          to: { opacity: 1, transform: "translateX(0)" },
                        },
                      }}
                    >
                      <IconButton
                        onClick={() => {
                          setShowTranslation(!showTranslation);
                          setShowExamples(false);
                        }}
                        sx={{
                          width: 64,
                          height: 64,
                          pointerEvents: "auto",
                          animation: "feedActionFadeIn 0.18s ease-out both",
                          bgcolor: showTranslation
                            ? "primary.main"
                            : "action.hover",
                          color: showTranslation
                            ? "primary.contrastText"
                            : "text.secondary",
                          "&:hover": {
                            bgcolor: showTranslation
                              ? "primary.dark"
                              : "action.selected",
                          },
                        }}
                      >
                        <Translate fontSize="medium" />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setShowExamples(!showExamples);
                          setShowTranslation(false);
                        }}
                        sx={{
                          width: 64,
                          height: 64,
                          pointerEvents: "auto",
                          animation: "feedActionFadeIn 0.18s ease-out 0.04s both",
                          bgcolor: showExamples
                            ? "secondary.main"
                            : "action.hover",
                          color: showExamples
                            ? "secondary.contrastText"
                            : "text.secondary",
                          "&:hover": {
                            bgcolor: showExamples
                              ? "secondary.dark"
                              : "action.selected",
                          },
                        }}
                      >
                        <MenuBook fontSize="medium" />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          const alreadyAdded =
                            addedToDesks[currentCard.sub] || [];
                          setSelectedDesks(alreadyAdded);
                          setAddToDeskDialog(true);
                        }}
                        sx={{
                          width: 64,
                          height: 64,
                          pointerEvents: "auto",
                          animation: "feedActionFadeIn 0.18s ease-out 0.08s both",
                          bgcolor: "action.hover",
                          color: "text.secondary",
                          "&:hover": {
                            bgcolor: "action.selected",
                          },
                        }}
                      >
                        <Favorite fontSize="medium" />
                      </IconButton>
                    </Box>
                  )}

                  <CardContent
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      py: 4,
                      pt: 8,
                    }}
                  >
                    <Typography
                      variant="h3"
                      fontWeight={600}
                      gutterBottom
                      sx={{
                        userSelect: "none",
                        pointerEvents: "none",
                      }}
                    >
                      {card.text.join(", ")}
                    </Typography>
                    {isCurrent && (showAnswer || showTranslation) && (
                      <Collapse
                        in={showAnswer || showTranslation}
                        sx={{ width: "100%", userSelect: "none" }}
                      >
                        <Box
                          sx={{
                            height: "2px",
                            width: "60%",
                            mx: "auto",
                            my: 3,
                            bgcolor: "divider",
                          }}
                        />{" "}
                        <Typography
                          variant="h5"
                          color="text.secondary"
                          sx={{
                            mt: 2,
                            userSelect: "none",
                            pointerEvents: "none",
                          }}
                        >
                          {showTranslation && !showAnswer
                            ? card.backVariants.join(", ")
                            : result?.correctVariants.join(", ")}
                        </Typography>{" "}
                      </Collapse>
                    )}{" "}
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>

        {currentCard && !showGrades && (
          <Fade in={true}>
            <Box
              sx={{
                flexShrink: 0,
                p: 2,
                bgcolor: "background.paper",
                borderTop: "1px solid",
                borderColor: "divider",
                bottom: 0,
                pb: 2,
              }}
            >
              <TextField
                fullWidth
                placeholder="Type your answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && userAnswer.trim()) {
                    handleSubmitAnswer();
                  }
                }}
                disabled={isAnswering || isSwiping}
                sx={{
                  "& .MuiInputBase-root": {
                    height: 48,
                    minHeight: 48,
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                  },
                  "& .MuiInputBase-input": {
                    padding: 0,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleSubmitAnswer}
                        disabled={
                          !userAnswer.trim() || isAnswering || isSwiping
                        }
                      >
                        <ArrowUpward
                          fontSize="small"
                          color={
                            userAnswer.trim() && !isAnswering
                              ? "primary"
                              : "disabled"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Fade>
        )}

        {showGrades && (
          <Fade in={showGrades}>
            <Box
              sx={{
                flexShrink: 0,
                p: 2,
                bgcolor: "background.paper",
                borderTop: "1px solid",
                borderColor: "divider",
                bottom: 0,
                pb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  overflow: "hidden",
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  boxShadow: 1,
                }}
              >
                {GRADE_OPTIONS.map(({ quality, label }) => (
                  <Box
                    key={quality}
                    onClick={() => {
                      if (isGradingPending) return;
                      handleGrade(quality);
                    }}
                    sx={{
                      flex: 1,
                      cursor: isGradingPending ? "not-allowed" : "pointer",
                      textAlign: "center",
                      py: 1.5,
                      position: "relative",
                      transition: "background-color 0.2s",
                      "&:hover": {
                        bgcolor: isGradingPending
                          ? "transparent"
                          : "action.hover",
                      },
                      opacity: isGradingPending ? 0.6 : 1,
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        bgcolor: isGradingPending
                          ? "#9e9e9e"
                          : GRADE_COLORS[quality],
                      }}
                    />

                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{
                        fontSize: "1.05rem",
                        userSelect: "none",
                        color: isGradingPending
                          ? "#9e9e9e"
                          : GRADE_COLORS[quality],
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Fade>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>

      <Dialog
        open={addToDeskDialog}
        onClose={() => setAddToDeskDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add to Decks</DialogTitle>
        <DialogContent>
          {isDesksLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress />
            </Box>
          ) : myDesks?.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 2 }}>
              You don&apos;t have any decks yet. Create one first!
            </Typography>
          ) : (
            <List sx={{ pt: 2 }}>
              {myDesks?.map((desk) => {
                const alreadyAdded =
                  addedToDesks[currentCard.sub]?.includes(desk.sub) || false;
                const isSelected = selectedDesks.includes(desk.sub);

                return (
                  <ListItem
                    key={desk.sub}
                    disablePadding
                    onClick={() => {
                      setSelectedDesks((prev) =>
                        prev.includes(desk.sub)
                          ? prev.filter((sub) => sub !== desk.sub)
                          : [...prev, desk.sub]
                      );
                    }}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={isSelected}
                        tabIndex={-1}
                        disableRipple
                        sx={{
                          "&.Mui-checked": {
                            color:
                              alreadyAdded && !isSelected
                                ? "grey.500"
                                : "primary.main",
                          },
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {desk.title}
                        </Box>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddToDeskDialog(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              if (!accessToken || !currentCard) return;

              await addCardToDeskMutation.mutateAsync({
                data: {
                  cardSub: currentCard.sub,
                  deskSubs: selectedDesks,
                },
                token: accessToken,
              });
            }}
            disabled={
              !selectedDesks ||
              addCardToDeskMutation.isPending ||
              JSON.stringify(selectedDesks.sort()) ===
                JSON.stringify((addedToDesks[currentCard.sub] || []).sort())
            }
            variant="contained"
          >
            {addCardToDeskMutation.isPending ? (
              <CircularProgress size={24} />
            ) : (
              `Save Changes`
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {showExamples && (
        <CardExamplesModal
          examples={currentCard.examples}
          open={showExamples}
          onClose={() => setShowExamples(false)}
        />
      )}
    </Box>
  );
}
