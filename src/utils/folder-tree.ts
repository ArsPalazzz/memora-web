export type FolderFlat = {
  sub: string;
  title: string;
  parentFolderSub: string | null;
};

export type FolderTreeNode = FolderFlat & {
  depth: number;
  children: FolderTreeNode[];
};

export function getFolderDescendants(
  folders: FolderFlat[],
  rootSub: string
): string[] {
  const result = [rootSub];

  for (const child of folders.filter((folder) => folder.parentFolderSub === rootSub)) {
    result.push(...getFolderDescendants(folders, child.sub));
  }

  return result;
}

export function buildFolderTree(folders: FolderFlat[]): FolderTreeNode[] {
  const buildNode = (folder: FolderFlat, depth: number): FolderTreeNode => ({
    ...folder,
    depth,
    children: folders
      .filter((item) => item.parentFolderSub === folder.sub)
      .map((item) => buildNode(item, depth + 1)),
  });

  return folders
    .filter((folder) => !folder.parentFolderSub)
    .map((folder) => buildNode(folder, 0));
}

export function flattenFolderTree(nodes: FolderTreeNode[]): FolderTreeNode[] {
  const result: FolderTreeNode[] = [];

  for (const node of nodes) {
    result.push(node);
    result.push(...flattenFolderTree(node.children));
  }

  return result;
}

export type DeskFlat = {
  sub: string;
  title: string;
  folderSub: string | null;
};

export type DeckPickerRow =
  | { type: "folder"; label: string; depth: number; folderSub: string }
  | { type: "desk"; sub: string; title: string; depth: number };

function folderHasDesks(
  folderSub: string,
  folders: FolderFlat[],
  desks: DeskFlat[]
): boolean {
  if (desks.some((desk) => desk.folderSub === folderSub)) {
    return true;
  }

  return folders
    .filter((folder) => folder.parentFolderSub === folderSub)
    .some((child) => folderHasDesks(child.sub, folders, desks));
}

function collapseFolderChain(
  folderSub: string,
  folders: FolderFlat[],
  desks: DeskFlat[]
): { label: string; folderSub: string } {
  let currentSub = folderSub;
  const labelParts: string[] = [];

  while (true) {
    const folder = folders.find((item) => item.sub === currentSub);
    if (!folder) {
      break;
    }

    labelParts.push(folder.title);

    const desksHere = desks.filter((desk) => desk.folderSub === currentSub);
    const children = folders.filter(
      (item) => item.parentFolderSub === currentSub
    );

    if (desksHere.length === 0 && children.length === 1) {
      currentSub = children[0].sub;
      continue;
    }

    break;
  }

  return {
    label: labelParts.join(" › "),
    folderSub: currentSub,
  };
}

export function buildDeckPickerRows(
  folders: FolderFlat[],
  desks: DeskFlat[]
): DeckPickerRow[] {
  const rows: DeckPickerRow[] = [];

  const rootDesks = desks
    .filter((desk) => !desk.folderSub)
    .sort((a, b) => a.title.localeCompare(b.title));

  for (const desk of rootDesks) {
    rows.push({ type: "desk", sub: desk.sub, title: desk.title, depth: 0 });
  }

  const appendFolder = (folderSub: string, depth: number) => {
    const { label, folderSub: effectiveSub } = collapseFolderChain(
      folderSub,
      folders,
      desks
    );

    rows.push({ type: "folder", label, depth, folderSub: effectiveSub });

    const desksHere = desks
      .filter((desk) => desk.folderSub === effectiveSub)
      .sort((a, b) => a.title.localeCompare(b.title));

    for (const desk of desksHere) {
      rows.push({
        type: "desk",
        sub: desk.sub,
        title: desk.title,
        depth: depth + 1,
      });
    }

    const childFolders = folders
      .filter((folder) => folder.parentFolderSub === effectiveSub)
      .filter((folder) => folderHasDesks(folder.sub, folders, desks))
      .sort((a, b) => a.title.localeCompare(b.title));

    for (const child of childFolders) {
      appendFolder(child.sub, depth + 1);
    }
  };

  const rootFolders = folders
    .filter((folder) => !folder.parentFolderSub)
    .filter((folder) => folderHasDesks(folder.sub, folders, desks))
    .sort((a, b) => a.title.localeCompare(b.title));

  for (const folder of rootFolders) {
    appendFolder(folder.sub, 0);
  }

  return rows;
}
