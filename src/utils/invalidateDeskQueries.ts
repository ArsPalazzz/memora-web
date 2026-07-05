import { QueryClient } from "@tanstack/react-query";
import {
  FOLDER_CONTENTS,
  FOLDER_INFO,
  FOLDERS_FLAT,
  ROOT_FOLDERS,
  USER_DESK,
  USER_DESKS,
  USER_DESKS_SHORT,
  USER_FOLDERS,
} from "@/routes/react-query";
import {
  FetchDeskResponse,
  FetchDesksResponse,
} from "@/services/desk/desk.types";

export type DeskMetadataPatch = Pick<
  FetchDesksResponse,
  "title" | "description"
>;

type FolderContentItem = {
  sub: string;
  title: string;
  description?: string;
  type: "folder" | "desk";
};

const DESK_LIST_QUERY_KEYS = [
  [USER_DESKS],
  [ROOT_FOLDERS],
  [FOLDERS_FLAT],
  [USER_DESKS_SHORT],
  [FOLDER_CONTENTS],
  [FOLDER_INFO],
  [USER_FOLDERS],
] as const;

export function patchDeskMetadataInCaches(
  queryClient: QueryClient,
  deskSub: string,
  patch: DeskMetadataPatch
) {
  queryClient.setQueryData<FetchDeskResponse>([USER_DESK, deskSub], (old) =>
    old ? { ...old, ...patch } : old
  );

  queryClient.setQueryData<FetchDesksResponse[]>([USER_DESKS], (old) =>
    old?.map((desk) =>
      desk.sub === deskSub ? { ...desk, ...patch } : desk
    )
  );

  for (const [queryKey, data] of queryClient.getQueriesData<
    FolderContentItem[]
  >({ queryKey: [FOLDER_CONTENTS] })) {
    if (!data) continue;

    queryClient.setQueryData(
      queryKey,
      data.map((item) =>
        item.sub === deskSub && item.type === "desk"
          ? {
              ...item,
              title: patch.title,
              description: patch.description ?? item.description,
            }
          : item
      )
    );
  }
}

export async function invalidateDeskListQueries(queryClient: QueryClient) {
  await Promise.all(
    DESK_LIST_QUERY_KEYS.map((queryKey) =>
      queryClient.invalidateQueries({ queryKey, refetchType: "all" })
    )
  );
}
