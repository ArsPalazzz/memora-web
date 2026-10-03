import PushPinIcon from "@mui/icons-material/PushPin";
import { Box, Chip, Stack, Typography } from "@mui/material";

export type PinnedFolderItem = {
  sub: string;
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
    <Box sx={{ mb: 1.5 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        sx={{ display: "block", mb: 0.75 }}
      >
        Pinned
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        flexWrap="wrap"
        sx={{ maxHeight: 96, overflowY: "auto" }}
      >
        {folders.map((folder) => (
          <Chip
            key={folder.sub}
            icon={<PushPinIcon sx={{ fontSize: "16px !important" }} />}
            label={folder.title}
            onClick={() => onOpen(folder.sub, folder.title)}
            onDelete={() => onUnpin(folder.sub)}
            variant="outlined"
            sx={{
              maxWidth: "100%",
              "& .MuiChip-label": {
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
