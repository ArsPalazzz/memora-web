import FolderIcon from "@mui/icons-material/Folder";
import PushPinIcon from "@mui/icons-material/PushPin";
import { Box, IconButton, Typography } from "@mui/material";

export type PinnedFolderItem = {
  folderSub: string;
  title: string;
};

interface PinnedFoldersSectionProps {
  folders: PinnedFolderItem[];
  onOpen: (folderSub: string, title: string) => void;
  onUnpin: (folderSub: string) => void;
}

export function PinnedFoldersSection({
  folders,
  onOpen,
  onUnpin,
}: PinnedFoldersSectionProps) {
  if (folders.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 1 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        sx={{ display: "block", mb: 0.5, letterSpacing: 0.2 }}
      >
        Pinned
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 0.75,
          overflowX: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {folders.map((folder) => (
          <Box
            key={folder.folderSub}
            role="button"
            tabIndex={0}
            onClick={() => onOpen(folder.folderSub, folder.title)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpen(folder.folderSub, folder.title);
              }
            }}
            sx={{
              position: "relative",
              flex: "0 0 auto",
              maxWidth: 140,
              px: 0.75,
              py: 0.5,
              pr: 2.75,
              borderRadius: 1.5,
              bgcolor: "action.hover",
              border: "1px solid",
              borderColor: "divider",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              transition: "background-color 0.15s ease, border-color 0.15s ease",
              "&:hover": {
                bgcolor: "action.selected",
                borderColor: "primary.main",
              },
            }}
          >
            <FolderIcon color="primary" sx={{ fontSize: 16, flexShrink: 0 }} />
            <Typography
              variant="caption"
              fontWeight={600}
              noWrap
              sx={{ flex: 1, minWidth: 0, lineHeight: 1.2 }}
            >
              {folder.title}
            </Typography>

            <IconButton
              size="small"
              aria-label={`Unpin ${folder.title}`}
              onClick={(event) => {
                event.stopPropagation();
                onUnpin(folder.folderSub);
              }}
              sx={{
                position: "absolute",
                top: 2,
                right: 2,
                p: 0.25,
                color: "text.secondary",
                "&:hover": { color: "primary.main", bgcolor: "transparent" },
              }}
            >
              <PushPinIcon sx={{ fontSize: 12 }} />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
