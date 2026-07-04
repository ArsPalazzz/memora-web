import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";

export const FolderCard = ({
  folder,
  onClick,
  onMove,
}: {
  folder: {
    title: string;
    deskCount: number;
    folderCount: number;
    description: string;
  };
  onClick: () => void;
  onMove?: (event: React.MouseEvent) => void;
}) => (
  <Card
    sx={{
      cursor: "pointer",
      height: "153px",
      "&:hover": { transform: "translateY(-2px)" },
    }}
    onClick={onClick}
  >
    <CardContent sx={{ height: "100%" }}>
      <Box sx={{ display: "flex", gap: 2, height: "100%" }}>
        <FolderIcon color="primary" sx={{ mt: 1 }} />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minWidth: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" noWrap>
                {folder.title}
              </Typography>

            {folder.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                mb={3}
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {folder.description}
              </Typography>
            )}
            </Box>

            {onMove && (
              <IconButton
                size="small"
                aria-label="Move folder"
                onClick={(event) => {
                  event.stopPropagation();
                  onMove(event);
                }}
                sx={{ flexShrink: 0 }}
              >
                <DriveFileMoveOutlinedIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

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
