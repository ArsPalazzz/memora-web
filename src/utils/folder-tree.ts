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
