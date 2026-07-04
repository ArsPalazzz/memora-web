import { QueryClient } from "@tanstack/react-query";
import {
  FOLDER_CONTENTS,
  FOLDER_INFO,
  FOLDERS_FLAT,
  ROOT_FOLDERS,
  USER_DESKS,
  USER_DESKS_SHORT,
  USER_FOLDERS,
} from "@/routes/react-query";

const DESK_LIST_QUERY_KEYS = [
  [USER_DESKS],
  [ROOT_FOLDERS],
  [FOLDERS_FLAT],
  [USER_DESKS_SHORT],
  [FOLDER_CONTENTS],
  [FOLDER_INFO],
  [USER_FOLDERS],
] as const;

export async function invalidateDeskListQueries(queryClient: QueryClient) {
  await Promise.all(
    DESK_LIST_QUERY_KEYS.map((queryKey) =>
      queryClient.invalidateQueries({ queryKey, refetchType: "all" })
    )
  );
}
