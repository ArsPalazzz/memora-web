import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import HomeIcon from "@mui/icons-material/Home";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { getFoldersFlatRequest } from "@/services/desk/desk";
import { useProtectedRequest } from "@/utils/protected";
import { FOLDERS_FLAT } from "@/routes/react-query";
import { Loader } from "@/components/ui/Loader";
import {
  buildFolderTree,
  flattenFolderTree,
  getFolderDescendants,
} from "@/utils/folder-tree";

export interface MoveItemModalProps {
  open: boolean;
  onClose: () => void;
  itemType: "desk" | "folder";
  itemTitle: string;
  itemSub: string;
  currentLocationSub: string | null;
  onSubmit: (targetFolderSub: string | null) => void;
  isPending: boolean;
}

export default function MoveItemModal({
  open,
  onClose,
  itemType,
  itemTitle,
  itemSub,
  currentLocationSub,
  onSubmit,
  isPending,
}: MoveItemModalProps) {
  const { call } = useProtectedRequest();
  const [selectedFolderSub, setSelectedFolderSub] = useState<string | null>(
    currentLocationSub
  );

  useEffect(() => {
    if (open) {
      setSelectedFolderSub(currentLocationSub);
    }
  }, [open, currentLocationSub]);

  const { data: folders, isLoading } = useQuery({
    queryKey: [FOLDERS_FLAT],
    queryFn: async () => call((token) => getFoldersFlatRequest(token)),
    enabled: open,
  });

  const excludedFolderSubs = useMemo(() => {
    if (itemType !== "folder" || !folders) {
      return new Set<string>();
    }

    return new Set(getFolderDescendants(folders, itemSub));
  }, [folders, itemSub, itemType]);

  const folderOptions = useMemo(() => {
    if (!folders) {
      return [];
    }

    return flattenFolderTree(buildFolderTree(folders)).filter(
      (folder) => !excludedFolderSubs.has(folder.sub)
    );
  }, [folders, excludedFolderSubs]);

  const handleSubmit = () => {
    onSubmit(selectedFolderSub);
  };

  const rootLabel = itemType === "desk" ? "Root (no folder)" : "Root level";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Move {itemType === "desk" ? "deck" : "folder"} &ldquo;{itemTitle}&rdquo;
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Choose a new location
        </Typography>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <Loader />
          </Box>
        ) : (
          <List dense sx={{ bgcolor: "background.paper", borderRadius: 1 }}>
            <ListItemButton
              selected={selectedFolderSub === null}
              onClick={() => setSelectedFolderSub(null)}
            >
              <HomeIcon sx={{ mr: 2, color: "primary.main" }} />
              <ListItemText
                primary={rootLabel}
                secondary={
                  currentLocationSub === null ? "Current location" : undefined
                }
              />
            </ListItemButton>

            {folderOptions.map((folder) => (
              <ListItemButton
                key={folder.sub}
                selected={selectedFolderSub === folder.sub}
                onClick={() => setSelectedFolderSub(folder.sub)}
                sx={{ pl: 2 + folder.depth * 2 }}
              >
                <FolderIcon sx={{ mr: 2, color: "primary.main" }} />
                <ListItemText
                  primary={folder.title}
                  secondary={
                    currentLocationSub === folder.sub
                      ? "Current location"
                      : undefined
                  }
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isPending || isLoading}
        >
          Move
        </Button>
      </DialogActions>
    </Dialog>
  );
}
