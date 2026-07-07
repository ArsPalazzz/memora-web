
import { Typography, Box, Grid, IconButton, Button } from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthContext } from "@/context/AuthContext";
import {
  FOLDER_CONTENTS,
  FOLDER_INFO,
  ROOT_FOLDERS,
  USER_DESKS,
  USER_FOLDERS,
  FOLDERS_FLAT,
} from "@/routes/react-query";
import { useProtectedRequest } from "@/utils/protected";
import { SectionLoader } from "@/components/ui/Loader";
import Header, { APP_HEADER_HEIGHT } from "@/components/layout/Header";
import WithBottomNav from "@/components/layout/WithBottomNav";
import { motion } from "framer-motion";
import FolderIcon from "@mui/icons-material/Folder";
import { DeskCard } from "@/components/ui/DeskCard";
import NewDeskModal from "@/components/modals/NewDesk/NewDesk.modal";
import NewFolderModal from "@/components/modals/NewFolder/NewFolder.modal";
import {
  createDeskSchema,
  CreateDeskValues,
} from "@/schemas/createDesk.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidV4 } from "uuid";
import {
  createDeskRequest,
  createFolderRequest,
  getFolderContentsRequest,
  getFolderInfoRequest,
  moveDeskToFolderRequest,
  moveFolderToParentRequest,
} from "@/services/desk/desk";
import { SortSelector } from "@/components/ui/SortSelector";
import { FolderCard } from "./ui/FolterCard";
import { useFolderSortSettings } from "@/hooks/useFolderSort";
import { DEFAULT_DESK_LANGUAGE_SETTINGS } from "@/constants/language.const";
import { useNotification } from "@/context/NotificationContext";
import {
  FolderNavState,
  getFolderPlaceholder,
} from "@/utils/folder-placeholder";
import MoveItemModal from "@/components/modals/MoveItem/MoveItem.modal";

export default function FolderClient() {
  const params = useParams() as { id: string };
  const folderSub = params.id;
  const navigate = useNavigate();
  const location = useLocation();
  const folderTitleFromNav = (location.state as FolderNavState | null)
    ?.folderTitle;
  const { accessToken } = useAuthContext();
  const queryClient = useQueryClient();
  const { call } = useProtectedRequest();
  const { notifySuccess, notifyError } = useNotification();

  const [openDeskModal, setOpenDeskModal] = useState(false);
  const [openFolderModal, setOpenFolderModal] = useState(false);
  const [moveTarget, setMoveTarget] = useState<{
    type: "desk" | "folder";
    sub: string;
    title: string;
    currentLocationSub: string | null;
  } | null>(null);
  const [sortBy, updateSortBy] = useFolderSortSettings(folderSub);

  const { data: folderInfo, isLoading: isFolderInfoLoading } = useQuery({
    queryKey: [FOLDER_INFO, folderSub],
    queryFn: async () =>
      call((token) => getFolderInfoRequest(folderSub, token)),
    enabled: !!folderSub,
    placeholderData: () =>
      getFolderPlaceholder(queryClient, folderSub, folderTitleFromNav),
  });

  const { data: contents, isLoading: isContentsLoading } = useQuery({
    queryKey: [FOLDER_CONTENTS, folderSub],
    queryFn: async () =>
      call((token) => getFolderContentsRequest(folderSub, token)),
    enabled: !!folderSub,
  });

  const sortedContents = useMemo(() => {
    if (!contents) return [];

    const sorted = [...contents];

    switch (sortBy) {
      case "date_desc":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      case "date_asc":
        return sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

      case "title_asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));

      case "title_desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));

      case "folders_first_date_desc":
        return sorted.sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === "folder" ? -1 : 1;
          }

          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

      case "desks_first_date_desc":
        return sorted.sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === "desk" ? -1 : 1;
          }

          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

      default:
        return sorted;
    }
  }, [contents, sortBy]);

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
      const data = { sub, ...payload.data, folder_sub: folderSub };
      return call(() => createDeskRequest(data, payload.token));
    },
    onSuccess: (payload) => {
      reset();
      setOpenDeskModal(false);
      notifySuccess(`Deck '${payload.title}' created successfully`);
      queryClient.invalidateQueries({ queryKey: [FOLDER_CONTENTS, folderSub] });
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: (payload: { title: string; description: string }) => {
      const data = {
        title: payload.title,
        description: payload.description,
        parent_folder_sub: folderSub,
      };
      return call((token) => createFolderRequest(data, token));
    },
    onSuccess: () => {
      setOpenFolderModal(false);
      notifySuccess("Folder created successfully");
      queryClient.invalidateQueries({ queryKey: [FOLDER_CONTENTS, folderSub] });
      queryClient.invalidateQueries({ queryKey: [USER_FOLDERS, folderSub] });
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
    queryClient.invalidateQueries({ queryKey: [FOLDER_CONTENTS] });
    queryClient.invalidateQueries({ queryKey: [FOLDER_INFO] });
    queryClient.invalidateQueries({ queryKey: [ROOT_FOLDERS] });
    queryClient.invalidateQueries({ queryKey: [USER_DESKS] });
    queryClient.invalidateQueries({ queryKey: [USER_FOLDERS] });
    queryClient.invalidateQueries({ queryKey: [FOLDERS_FLAT] });
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
    if (totalCards === 0) return "success";
    const ratio = dueCards / totalCards;
    if (ratio > 0.3) return "error";
    if (ratio > 0.1) return "warning";
    return "success";
  };

  const handleSortChange = (newSortBy: string) => {
    updateSortBy(newSortBy);
  };

  const isLoading = isFolderInfoLoading || isContentsLoading;

  const RightButtons = () => (
    <Box sx={{ display: "flex", gap: 1 }}>
      <IconButton onClick={() => setOpenDeskModal(true)}>
        <AddIcon sx={{ color: "white", fontSize: 24 }} />
      </IconButton>
      <IconButton onClick={() => setOpenFolderModal(true)}>
        <CreateNewFolderIcon sx={{ color: "white", fontSize: 24 }} />
      </IconButton>
    </Box>
  );

  return (
    <WithBottomNav>
      <Header
        title={folderInfo?.title ?? folderTitleFromNav ?? "Folder"}
        RightButton={<RightButtons />}
        onBack={() => navigate(-1)}
      />

      {isLoading ? (
        <SectionLoader minHeight="50vh" />
      ) : (
        <Box sx={{ px: 2, pt: 2, pb: 2 }}>
          {!!contents?.length && (
            <Box
              sx={{
                position: "sticky",
                top: APP_HEADER_HEIGHT,
                zIndex: 1,
                bgcolor: "background.default",
                py: 1,
                mb: 2,
              }}
            >
              <SortSelector sortBy={sortBy} onChange={handleSortChange} />
            </Box>
          )}

          {!sortedContents?.length ? (
            <EmptyState
              onAddDesk={() => setOpenDeskModal(true)}
              onAddFolder={() => setOpenFolderModal(true)}
              title="Folder is empty"
              description="Add decks or subfolders to organize your learning materials"
            />
          ) : (
            <Grid container spacing={2}>
              {sortedContents.map((item, index) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={item.sub}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                    }}
                  >
                    {item.type === "folder" ? (
                      <FolderCard
                        folder={item}
                        onClick={() =>
                          navigate(`/folder/${item.sub}`, {
                            state: { folderTitle: item.title },
                          })
                        }
                        onMove={() =>
                          setMoveTarget({
                            type: "folder",
                            sub: item.sub,
                            title: item.title,
                            currentLocationSub: folderSub,
                          })
                        }
                      />
                    ) : (
                      <DeskCard
                        desk={item}
                        stats={{
                          learningCards: item.learningCards || 0,
                          dueCards: item.dueCards || 0,
                          newCards: item.newCards || 0,
                          masteredCards: item.masteredCards || 0,
                        }}
                        priorityColor={getPriorityColor(
                          item.dueCards || 0,
                          (item.dueCards || 0) +
                            (item.learningCards || 0) +
                            (item.masteredCards || 0) +
                            (item.newCards || 0)
                        )}
                        onClick={() => navigate(`/desk/${item.sub}`)}
                        onMove={() =>
                          setMoveTarget({
                            type: "desk",
                            sub: item.sub,
                            title: item.title,
                            currentLocationSub: folderSub,
                          })
                        }
                      />
                    )}
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

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
  onAddDesk,
  onAddFolder,
  title,
  description,
}: {
  onAddDesk: () => void;
  onAddFolder: () => void;
  title: string;
  description: string;
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
    <FolderIcon sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
    <Typography variant="h6" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
      {description}
    </Typography>
    <Box sx={{ display: "flex", gap: 2 }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddDesk}
        size="large"
      >
        Deck
      </Button>
      <Button
        variant="outlined"
        startIcon={<CreateNewFolderIcon />}
        onClick={onAddFolder}
        size="large"
      >
        Subfolder
      </Button>
    </Box>
  </Box>
);
