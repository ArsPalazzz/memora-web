import { Box, Card, CardContent, Chip, IconButton, Typography } from "@mui/material";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";
import { MasteryProgress } from "./MasteryProgress";

interface DeskStats {
  learningCards: number;
  dueCards: number;
  newCards: number;
  masteredCards: number;
  lastReviewed?: string;
}

export const DeskCard = ({
  desk,
  stats,
  priorityColor,
  onClick,
  onPointerDown,
  onMove,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  desk: any;
  stats: DeskStats;
  priorityColor: string;
  onClick: () => void;
  onPointerDown?: () => void;
  onMove?: (event: React.MouseEvent) => void;
}) => (
  <Card
    variant="outlined"
    sx={{
      height: "153px",
      display: "flex",
      flexDirection: "column",
      transition: "0.3s",
      cursor: "pointer",
      "&:hover": {
        boxShadow: 6,
        transform: "translateY(-4px)",
        borderColor: "primary.main",
      },
    }}
    onClick={onClick}
    onPointerDown={onPointerDown}
  >
    <CardContent
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
        "&:last-child": { pb: 2 },
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1,
          gap: 1,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {desk.title}
          </Typography>
          {desk.sourceCreatorNickname && (
            <Chip
              size="small"
              label={`from @${desk.sourceCreatorNickname}`}
              variant="outlined"
              sx={{
                mt: 0.75,
                maxWidth: "100%",
                height: 22,
                "& .MuiChip-label": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />
          )}
        </Box>

        <Chip
          label={`${stats.dueCards} due`}
          size="small"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          color={priorityColor as any}
          variant="outlined"
          sx={{ ml: 1, flexShrink: 0 }}
        />

        {onMove && (
          <IconButton
            size="small"
            aria-label="Move deck"
            onClick={(event) => {
              event.stopPropagation();
              onMove(event);
            }}
            sx={{ flexShrink: 0, ml: 0.5 }}
          >
            <DriveFileMoveOutlinedIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {desk.description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mt: 0.5,
          }}
        >
          {desk.description}
        </Typography>
      )}

      <Box sx={{ mt: "auto", pt: 1 }}>
        <MasteryProgress {...stats} />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
          {stats.masteredCards} mastered • {stats.learningCards} learning •{" "}
          {stats.dueCards} due • {stats.newCards} new
        </Typography>
      </Box>
    </CardContent>
  </Card>
);
