
import { Typography, Box, Grid, IconButton, Button } from "@mui/material";
import { useAuth } from "../utils/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FolderIcon from "@mui/icons-material/Folder";
import {
  createDeskRequest,
  createFolderRequest,
  fetchDeskRequest,
  fetchMyDesksRequest,
  getFoldersRequest,
  moveDeskToFolderRequest,
  moveFolderToParentRequest,
} from "../services/desk/desk";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import NewDeskModal from "@/components/modals/NewDesk/NewDesk.modal";
import {
  createDeskSchema,
  CreateDeskValues,
} from "@/schemas/createDesk.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "@/context/AuthContext";
import {
  USER_DAILY,
  USER_DESKS,
  USER_DESK,
  ROOT_FOLDERS,
  USER_REVIEW_SUMMARY,
  USER_INBOX_SUMMARY,
  FRIENDS_ACTIVITY,
  FRIENDS_LEAGUE,
  CURRENT_CHALLENGE,
} from "@/routes/react-query";
import { CreateDeskResult } from "@/services/desk/desk.types";
import { useProtectedRequest } from "@/utils/protected";
import { DeskCardSkeleton, Loader } from "@/components/ui/Loader";
import Header from "@/components/layout/Header";
import { v4 as uuidV4 } from "uuid";
import { useNavigate, useSearchParams } from "react-router-dom";
import WithBottomNav from "./layout/WithBottomNav";
import { motion } from "framer-motion";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { getUserDailyRequest } from "@/services/user/user";
import {
  getReviewSummaryRequest,
  getInboxSummaryRequest,
  startReviewRequest,
} from "@/services/review/review";
import { DeskCard } from "./ui/DeskCard";
import { DailyStreakCard } from "./ui/DailyStreakCard";
import { ReviewDueCard } from "./ui/ReviewDueCard";
import { SocialHomeCard } from "./ui/SocialHomeCard";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { FolderCard } from "./ui/FolterCard";
import NewFolderModal from "./modals/NewFolder/NewFolder.modal";
import MoveItemModal from "@/components/modals/MoveItem/MoveItem.modal";
import { TabsSwitcher } from "./ui/TabSwitcher";
import { DEFAULT_DESK_LANGUAGE_SETTINGS } from "@/constants/language.const";
import { useNotification } from "@/context/NotificationContext";
import { invalidateDeskListQueries } from "@/utils/invalidateDeskQueries";
import { getFriendsActivityRequest, getFriendsLeagueRequest } from "@/services/friends/friends";
import { getCurrentChallengeRequest } from "@/services/challenge/challenge";
import { ROUTES } from "@/routes/paths";

export default function HomeClient() {
  const { authenticated } = useAuth();
  const { accessToken } = useAuthContext();
  const queryClient = useQueryClient();
  const { call } = useProtectedRequest();
  const navigate = useNavigate();

  const [openDeskModal, setOpenDeskModal] = useState(false);
  const [openFolderModal, setOpenFolderModal] = useState(false);
  const [moveTarget, setMoveTarget] = useState<{
    type: "desk" | "folder";
    sub: string;
    title: string;
    currentLocationSub: string | null;
  } | null>(null);

  const handleTabChange = (newTab: number) => {
    setActiveTab(newTab);
  };

  const [searchParams] = useSearchParams();

  const urlTab = searchParams.get("tab");
  const initialTab = urlTab === "folders" ? 1 : 0;

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentTabParam = params.get("tab");

    if (
      !currentTabParam ||
      (activeTab === 0 && currentTabParam === "folders")
    ) {
      navigate({ pathname: "/home", search: "tab=desks" }, { replace: true });
      return;
    }

    if (activeTab === 1 && currentTabParam === "desks") {
      navigate({ pathname: "/home", search: "tab=folders" }, { replace: true });
    }
  }, [activeTab, navigate, searchParams]);

  const { notifySuccess, notifyError } = useNotification();

  const { data: daily } = useQuery({
    queryKey: [USER_DAILY],
    queryFn: async () => call((token) => getUserDailyRequest(token)),
  });

  const { data: reviewSummary } = useQuery({
    queryKey: [USER_REVIEW_SUMMARY],
    queryFn: async () => call((token) => getReviewSummaryRequest(token)),
  });

  const { data: inboxSummary } = useQuery({
    queryKey: [USER_INBOX_SUMMARY],
    queryFn: async () => call((token) => getInboxSummaryRequest(token)),
  });

  const { data: friendsActivity } = useQuery({
    queryKey: [FRIENDS_ACTIVITY],
    queryFn: async () => call((token) => getFriendsActivityRequest(token)),
  });

  const { data: friendsLeague } = useQuery({
    queryKey: [FRIENDS_LEAGUE],
    queryFn: async () => call((token) => getFriendsLeagueRequest(token)),
  });

  const { data: currentChallenge } = useQuery({
    queryKey: [CURRENT_CHALLENGE],
    queryFn: async () => call((token) => getCurrentChallengeRequest(token)),
    retry: false,
  });

  const startStudyMutation = useMutation({
    mutationFn: () => call((token) => startReviewRequest(token)),
    onSuccess: ({ batchId }) => {
      navigate(`/review?batchId=${batchId}`);
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const { data: desks, isLoading: isDesksLoading } = useQuery({
    queryKey: [USER_DESKS],
    queryFn: async () => call((token) => fetchMyDesksRequest(token)),
    staleTime: 5 * 60_000,
  });

  const prefetchDesk = (sub: string) => {
    void queryClient.prefetchQuery({
      queryKey: [USER_DESK, sub],
      queryFn: async () => call((token) => fetchDeskRequest(sub, token)),
      staleTime: 5 * 60_000,
    });
  };

  const { data: folders, isLoading: isFoldersLoading } = useQuery({
    queryKey: [ROOT_FOLDERS],
    queryFn: async () => call((token) => getFoldersRequest(token)),
    enabled: activeTab === 1,
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    control,
  } = useForm<CreateDeskValues>({
    resolver: zodResolver(createDeskSchema),
    defaultValues: { visibility: "private", ...DEFAULT_DESK_LANGUAGE_SETTINGS },
    mode: "onChange",
  });

  const createDeskMutation = useMutation({
    mutationFn: (payload: { data: CreateDeskValues; token: string }) => {
      const sub = uuidV4();
      const data = { sub, ...payload.data, folder_sub: null };

      return call(() => createDeskRequest(data, payload.token));
    },
    onSuccess: (payload: CreateDeskResult) => {
      reset();
      setOpenDeskModal(false);
      notifySuccess(`Deck '${payload.title}' created successfully`);

      queryClient.invalidateQueries({ queryKey: [USER_DESKS] });
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: (payload: {
      title: string;
      description: string;
      parentFolderSub?: string | null;
    }) => {
      const data = {
        title: payload.title,
        description: payload.description,
        parent_folder_sub: payload.parentFolderSub || null,
      };
      return call((token) => createFolderRequest(data, token));
    },
    onSuccess: () => {
      setOpenFolderModal(false);
      notifySuccess("Folder created successfully");
      queryClient.invalidateQueries({ queryKey: [ROOT_FOLDERS] });
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const onSubmitDesk = (data: CreateDeskValues) => {
    createDeskMutation.mutate({ data, token: accessToken! });
  };

  const onSubmitFolder = (data: { title: string; description: string }) => {
    createFolderMutation.mutate(data);
  };

  const invalidateMoveQueries = () => {
    void invalidateDeskListQueries(queryClient);
  };

  const moveDeskMutation = useMutation({
    mutationFn: (payload: {
      deskSub: string;
      folderSub: string | null;
    }) =>
      call((token) =>
        moveDeskToFolderRequest(payload.deskSub, payload.folderSub, token)
      ),
    onSuccess: () => {
      setMoveTarget(null);
      invalidateMoveQueries();
      notifySuccess("Deck moved successfully");
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const moveFolderMutation = useMutation({
    mutationFn: (payload: {
      folderSub: string;
      parentFolderSub: string | null;
    }) =>
      call((token) =>
        moveFolderToParentRequest(
          payload.folderSub,
          payload.parentFolderSub,
          token
        )
      ),
    onSuccess: () => {
      setMoveTarget(null);
      invalidateMoveQueries();
      notifySuccess("Folder moved successfully");
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const handleMoveSubmit = (targetFolderSub: string | null) => {
    if (!moveTarget) {
      return;
    }

    if (moveTarget.type === "desk") {
      moveDeskMutation.mutate({
        deskSub: moveTarget.sub,
        folderSub: targetFolderSub,
      });
      return;
    }

    moveFolderMutation.mutate({
      folderSub: moveTarget.sub,
      parentFolderSub: targetFolderSub,
    });
  };

  const getPriorityColor = (dueCards: number, totalCards: number) => {
    const ratio = dueCards / totalCards;
    if (ratio > 0.3) return "error";
    if (ratio > 0.1) return "warning";
    return "success";
  };

  if (!authenticated) return null;

  const RightButton = () => {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton
          aria-label="Import from Anki"
          onClick={() => navigate("/import/anki")}
        >
          <UploadFileIcon sx={{ color: "white", fontSize: 28 }} />
        </IconButton>

        {activeTab === 0 ? (
          <IconButton onClick={() => setOpenDeskModal(true)}>
            <AddIcon sx={{ color: "white", fontSize: 30 }} />
          </IconButton>
        ) : (
          <IconButton onClick={() => setOpenFolderModal(true)}>
            <CreateNewFolderIcon sx={{ color: "white", fontSize: 30 }} />
          </IconButton>
        )}
      </Box>
    );
  };

  return (
    <WithBottomNav>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
          overflow:
            (activeTab === 0 && desks && !desks.length) ||
            (activeTab === 1 && folders && !folders.length)
              ? "hidden"
              : "inherit",
        }}
      >
        <Header
          title={activeTab === 0 ? "Decks" : "Folders"}
          RightButton={<RightButton />}
        />

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            mb: desks?.length || folders?.length ? 2 : 0,
          }}
        >
          <Box sx={{ px: 2, pt: 2, flexShrink: 0 }}>
            {daily && (
              <Box sx={{ mb: 2 }}>
                <DailyStreakCard
                  streak={daily.currentStreak}
                  cardsReviewedToday={daily.cardsReviewed}
                  dailyGoal={daily.dailyGoal}
                />
              </Box>
            )}

            {reviewSummary && inboxSummary && (
              <Box sx={{ mb: 2 }}>
                <ReviewDueCard
                  totalDueCount={reviewSummary.totalDueCount}
                  inboxCount={inboxSummary.count}
                  onStartStudy={() => startStudyMutation.mutate()}
                  isStarting={startStudyMutation.isPending}
                />
              </Box>
            )}

            {(friendsActivity || friendsLeague || currentChallenge) && (
              <Box sx={{ mb: 2 }}>
                <SocialHomeCard
                  friends={friendsActivity}
                  league={friendsLeague}
                  challenge={currentChallenge}
                  onFriendClick={(nickname) =>
                    navigate(ROUTES.userProfile(nickname))
                  }
                  onChallengeOpen={() => {
                    if (!currentChallenge) return;
                    const myEntry = currentChallenge.leaderboard.find(
                      (entry) => entry.isMe
                    );
                    if (myEntry) {
                      navigate(`/desk/${myEntry.localDeskSub}`);
                      return;
                    }
                    navigate(
                      ROUTES.publicDeskBySub(currentChallenge.desk.sub)
                    );
                  }}
                />
              </Box>
            )}

            <TabsSwitcher activeTab={activeTab} onChange={handleTabChange} />
          </Box>

          <Box
            sx={{
              flex: 1,
              px: 2,
              pb: 2,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            {activeTab === 0 ? (
              <>
                {isDesksLoading && !desks && (
                  <Grid container spacing={2}>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                        <DeskCardSkeleton />
                      </Grid>
                    ))}
                  </Grid>
                )}

                {!isDesksLoading && desks && !desks.length && (
                  <EmptyState
                    onCreate={() => setOpenDeskModal(true)}
                    title="No decks yet"
                    description="Start your learning journey by creating your first deck of flashcards"
                    icon={
                      <LibraryBooksIcon
                        sx={{ fontSize: 80, color: "grey.400", mb: 2 }}
                      />
                    }
                    buttonText="Create First Deck"
                  />
                )}

                {desks && desks.length > 0 && (
                  <Grid container spacing={2}>
                    {desks.map((desk, index) => {
                      const stats = {
                        learningCards: desk.learningCards,
                        dueCards: desk.dueCards,
                        newCards: desk.newCards,
                        masteredCards: desk.masteredCards,
                      };

                      const priorityColor = getPriorityColor(
                        stats.dueCards,
                        stats.dueCards +
                          stats.learningCards +
                          stats.masteredCards +
                          stats.newCards
                      );

                      return (
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={desk.sub}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: Number(`0.${index + 1}`),
                            }}
                          >
                            <DeskCard
                              desk={desk}
                              stats={stats}
                              priorityColor={priorityColor}
                              onPointerDown={() => prefetchDesk(desk.sub)}
                              onClick={() => navigate(`/desk/${desk.sub}`)}
                              onMove={() =>
                                setMoveTarget({
                                  type: "desk",
                                  sub: desk.sub,
                                  title: desk.title,
                                  currentLocationSub: null,
                                })
                              }
                            />
                          </motion.div>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </>
            ) : (
              <>
                {isFoldersLoading && <Loader />}

                {(!folders || folders.length === 0) && !isFoldersLoading && (
                  <EmptyState
                    onCreate={() => setOpenFolderModal(true)}
                    title="No folders yet"
                    description="Organize your decks into folders for better management"
                    icon={
                      <FolderIcon
                        sx={{ fontSize: 80, color: "grey.400", mb: 2 }}
                      />
                    }
                    buttonText="Create First Folder"
                  />
                )}

                {folders && folders.length > 0 && (
                  <Grid container spacing={2}>
                    {folders.map((folder, index) => (
                      <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={folder.sub}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: Number(`0.${index + 1}`),
                          }}
                        >
                          <FolderCard
                            folder={folder}
                            onClick={() =>
                              navigate(`/folder/${folder.sub}`, {
                                state: { folderTitle: folder.title },
                              })
                            }
                            onMove={() =>
                              setMoveTarget({
                                type: "folder",
                                sub: folder.sub,
                                title: folder.title,
                                currentLocationSub: null,
                              })
                            }
                          />
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>

      {openDeskModal && (
        <NewDeskModal
          open={openDeskModal}
          onClose={() => setOpenDeskModal(false)}
          errors={errors}
          register={register}
          onSubmit={handleSubmit(onSubmitDesk)}
          control={control}
          isPending={createDeskMutation.isPending}
        />
      )}

      {openFolderModal && (
        <NewFolderModal
          open={openFolderModal}
          onClose={() => setOpenFolderModal(false)}
          onSubmit={onSubmitFolder}
          isPending={createFolderMutation.isPending}
        />
      )}

      {moveTarget && (
        <MoveItemModal
          open={!!moveTarget}
          onClose={() => setMoveTarget(null)}
          itemType={moveTarget.type}
          itemTitle={moveTarget.title}
          itemSub={moveTarget.sub}
          currentLocationSub={moveTarget.currentLocationSub}
          onSubmit={handleMoveSubmit}
          isPending={
            moveDeskMutation.isPending || moveFolderMutation.isPending
          }
        />
      )}
    </WithBottomNav>
  );
}

const EmptyState = ({
  onCreate,
  title,
  description,
  icon,
  buttonText,
}: {
  onCreate: () => void;
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
}) => (
  <Box
    sx={{
      flex: 1,
      minHeight: "300px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      px: 2,
    }}
  >
    {icon}
    <Typography variant="h6" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
      {description}
    </Typography>
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={onCreate}
      size="large"
    >
      {buttonText}
    </Button>
  </Box>
);
