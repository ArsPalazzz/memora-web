import { QueryClient } from "@tanstack/react-query";
import { FOLDER_CONTENTS, FOLDER_INFO, ROOT_FOLDERS } from "@/routes/react-query";
import { RootFolder } from "@/services/desk/desk.types";

export type FolderInfoResponse = {
  sub: string;
  title: string;
  description: string;
  parentFolderSub: string | null;
  createdAt: string;
  deskCount: number;
  childCount: number;
};

export type FolderNavState = {
  folderTitle?: string;
};

function folderSummaryToPlaceholder(
  sub: string,
  title: string,
  description = ""
): FolderInfoResponse {
  return {
    sub,
    title,
    description,
    parentFolderSub: null,
    createdAt: "",
    deskCount: 0,
    childCount: 0,
  };
}

export function getFolderPlaceholder(
  queryClient: QueryClient,
  sub: string,
  navTitle?: string
): FolderInfoResponse | undefined {
  const cached = queryClient.getQueryData<FolderInfoResponse>([FOLDER_INFO, sub]);
  if (cached) return cached;

  if (navTitle) {
    return folderSummaryToPlaceholder(sub, navTitle);
  }

  const rootFolders = queryClient.getQueryData<RootFolder[]>([ROOT_FOLDERS]);
  const rootFolder = rootFolders?.find((folder) => folder.sub === sub);
  if (rootFolder) {
    return folderSummaryToPlaceholder(
      sub,
      rootFolder.title,
      rootFolder.description
    );
  }

  for (const [, contents] of queryClient.getQueriesData<
    {
      sub: string;
      title: string;
      description: string;
      type: "folder" | "desk";
    }[]
  >({ queryKey: [FOLDER_CONTENTS] })) {
    const folder = contents?.find(
      (item) => item.sub === sub && item.type === "folder"
    );
    if (folder) {
      return folderSummaryToPlaceholder(sub, folder.title, folder.description);
    }
  }

  return undefined;
}
