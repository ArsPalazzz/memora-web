import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export const FolderCard = ({
  folder,
  onClick,
  onMenuClick,
}: {
  folder: { title: string; deskCount: number; children: { title: string }[] };
  onClick: () => void;
  onMenuClick: (e: React.MouseEvent<HTMLElement>) => void;
}) => (
  <Card
    sx={{
      cursor: "pointer",
      "&:hover": { transform: "translateY(-2px)" },
    }}
    onClick={onClick}
  >
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <FolderIcon color="primary" />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">{folder.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {folder.deskCount} decks
          </Typography>
        </Box>
        <IconButton onClick={onMenuClick}>
          <MoreVertIcon />
        </IconButton>
      </Box>

      {folder.children && folder.children.length > 0 && (
        <Box sx={{ mt: 2, pl: 3 }}>
          <Typography variant="caption" color="text.secondary">
            Subfolders: {folder.children.map((c) => c.title).join(", ")}
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);
