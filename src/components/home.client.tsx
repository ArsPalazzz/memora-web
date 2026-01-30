"use client";

import { Typography, Box, Grid, IconButton, Button } from "@mui/material";
import { useAuth } from "../utils/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FolderIcon from "@mui/icons-material/Folder";
import {
  createDeskRequest,
  createFolderRequest,
  fetchMyDesksRequest,
  getFoldersRequest,
} from "../services/desk/desk";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { useForm } from "react-hook-form";
import NewDeskModal from "@/components/modals/NewDesk/NewDesk.modal";
import {
  createDeskSchema,
  CreateDeskValues,
} from "@/schemas/createDesk.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifyError, notifySuccess } from "@/utils/notification";
import { useAuthContext } from "@/context/AuthContext";
import { USER_DAILY, USER_DESKS, USER_FOLDERS } from "@/routes/react-query";
import { CreateDeskResult } from "@/services/desk/desk.types";
import { useProtectedRequest } from "@/utils/protected";
import { FullPageLoader } from "@/components/ui/Loader";
import Header from "@/components/layout/Header";
import { v4 as uuidV4 } from "uuid";
import { useRouter } from "next/navigation";
import WithBottomNav from "./layout/WithBottomNav";
import { motion } from "framer-motion";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { getUserDailyRequest } from "@/services/user/user";
import { DeskCard } from "./ui/DeskCard";
import { DailyStreakCard } from "./ui/DailyStreakCard";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { FolderCard } from "./ui/FolterCard";
import NewFolderModal from "./modals/NewFolder/NewFolder.modal";
import { TabsSwitcher } from "./ui/TabSwitcher";

export default function HomeClient() {
  const { authenticated } = useAuth();
  const { accessToken } = useAuthContext();
  const queryClient = useQueryClient();
  const { call } = useProtectedRequest();
  const router = useRouter();

  const [openDeskModal, setOpenDeskModal] = useState(false);
  const [openFolderModal, setOpenFolderModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [folderMenuAnchor, setFolderMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const { data: daily } = useQuery({
    queryKey: [USER_DAILY],
    queryFn: async () => call((token) => getUserDailyRequest(token)),
  });

  const { data: desks, isLoading: isDesksLoading } = useQuery({
    queryKey: [USER_DESKS],
    queryFn: async () => call((token) => fetchMyDesksRequest(token)),
  });

  const { data: folders, isLoading: isFoldersLoading } = useQuery({
    queryKey: [USER_FOLDERS],
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
    defaultValues: { isPublic: true },
    mode: "onChange",
  });

  const createDeskMutation = useMutation({
    mutationFn: (payload: { data: CreateDeskValues; token: string }) => {
      const sub = uuidV4();
      const data = { sub, ...payload.data };

      return call(() => createDeskRequest(data, payload.token));
    },
    onSuccess: (payload: CreateDeskResult) => {
      reset();
      setOpenDeskModal(false);
      notifySuccess(`Desk '${payload.title}' created successfully`);

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
      queryClient.invalidateQueries({ queryKey: [USER_FOLDERS] });
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

  const getPriorityColor = (dueCards: number, totalCards: number) => {
    const ratio = dueCards / totalCards;
    if (ratio > 0.3) return "error";
    if (ratio > 0.1) return "warning";
    return "success";
  };

  const handleFolderMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setFolderMenuAnchor(event.currentTarget);
  };

  const handleFolderMenuClose = () => {
    setFolderMenuAnchor(null);
  };

  const handleCreateSubfolder = (parentFolderSub?: string) => {
    handleFolderMenuClose();
  };

  if (isDesksLoading) return <FullPageLoader />;

  if (!authenticated) return null;

  const RightButton = () => {
    if (activeTab === 0) {
      return (
        <IconButton onClick={() => setOpenDeskModal(true)}>
          <AddIcon sx={{ color: "white", fontSize: 30 }} />
        </IconButton>
      );
    } else {
      return (
        <IconButton onClick={() => setOpenFolderModal(true)}>
          <CreateNewFolderIcon sx={{ color: "white", fontSize: 30 }} />
        </IconButton>
      );
    }
  };

  return (
    <WithBottomNav>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <Header
          title={activeTab === 0 ? "Desks" : "Folders"}
          RightButton={<RightButton />}
        />

        <Box
          sx={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ px: 2, pt: 2, flexShrink: 0 }}>
            {daily && (
              <Box sx={{ mb: 3 }}>
                <DailyStreakCard
                  streak={daily.currentStreak}
                  cardsReviewedToday={daily.cardsReviewed}
                  dailyGoal={daily.dailyGoal}
                />
              </Box>
            )}

            <TabsSwitcher activeTab={activeTab} onChange={setActiveTab} />
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto", px: 2, pb: 2 }}>
            {activeTab === 0 ? (
              <>
                {!desks?.length && (
                  <EmptyState
                    onCreate={() => setOpenDeskModal(true)}
                    title="No desks yet"
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
                              onClick={() => router.push(`desk/${desk.sub}`)}
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
                {isFoldersLoading && <FullPageLoader />}

                {(!folders || folders.length === 0) && (
                  <EmptyState
                    onCreate={() => setOpenFolderModal(true)}
                    title="No folders yet"
                    description="Organize your desks into folders for better management"
                    icon={
                      <FolderIcon
                        sx={{ fontSize: 80, color: "grey.400", mb: 2 }}
                      />
                    }
                    buttonText="Create First Folder"
                  />
                )}

                {folders && folders.length > 0 && (
                  <>
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
                                router.push(`/folder/${folder.sub}`)
                              }
                              onMenuClick={(e) => handleFolderMenuClick(e)}
                            />
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>

                    <Grid container spacing={2}>
                      {desks &&
                        desks.map((desk, index) => {
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
                            <Grid
                              size={{ xs: 12, sm: 6, lg: 4 }}
                              key={desk.sub}
                            >
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
                                  onClick={() =>
                                    router.push(`desk/${desk.sub}`)
                                  }
                                />
                              </motion.div>
                            </Grid>
                          );
                        })}
                    </Grid>
                  </>
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
        />
      )}

      {openFolderModal && (
        <NewFolderModal
          open={openFolderModal}
          onClose={() => setOpenFolderModal(false)}
          onSubmit={onSubmitFolder}
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
      height: "100%",
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
