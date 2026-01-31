import { Box, Card, CardContent, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";

export const FolderCard = ({
  folder,
  onClick,
}: {
  folder: { title: string; deskCount: number; folderCount: number };
  onClick: () => void;
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
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {folder.folderCount} folders
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {folder.deskCount} decks
            </Typography>
          </Box>
        </Box>
      </Box>
    </CardContent>
  </Card>
);
