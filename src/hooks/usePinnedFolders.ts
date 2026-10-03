import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useNotification } from "@/context/NotificationContext";
import { PINNED_FOLDERS } from "@/routes/react-query";
import {
  getPinnedFoldersRequest,
  pinFolderRequest,
  unpinFolderRequest,
} from "@/services/desk/desk";
import { useProtectedRequest } from "@/utils/protected";

export function usePinnedFolders() {
  const { call } = useProtectedRequest();
  const queryClient = useQueryClient();
  const { notifyError } = useNotification();

  const { data: pinnedFolders = [], isLoading } = useQuery({
    queryKey: [PINNED_FOLDERS],
    queryFn: async () => call((token) => getPinnedFoldersRequest(token)),
    staleTime: 5 * 60_000,
  });

  const pinnedSubs = useMemo(
    () => pinnedFolders.map((folder) => folder.folderSub),
    [pinnedFolders]
  );

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: [PINNED_FOLDERS] });
  };

  const pinMutation = useMutation({
    mutationFn: (folderSub: string) =>
      call((token) => pinFolderRequest(folderSub, token)),
    onSuccess: invalidate,
    onError: (err: Error) => {
      notifyError(err.message);
    },
  });

  const unpinMutation = useMutation({
    mutationFn: (folderSub: string) =>
      call((token) => unpinFolderRequest(folderSub, token)),
    onSuccess: invalidate,
    onError: (err: Error) => {
      notifyError(err.message);
    },
  });

  const isPinned = useCallback(
    (folderSub: string) => pinnedSubs.includes(folderSub),
    [pinnedSubs]
  );

  const togglePin = useCallback(
    (folderSub: string) => {
      if (pinnedSubs.includes(folderSub)) {
        unpinMutation.mutate(folderSub);
        return;
      }
      pinMutation.mutate(folderSub);
    },
    [pinMutation, pinnedSubs, unpinMutation]
  );

  return {
    pinnedFolders,
    pinnedSubs,
    isLoading,
    isPinned,
    togglePin,
    unpin: (folderSub: string) => unpinMutation.mutate(folderSub),
  };
}
