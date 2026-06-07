import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
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
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  desk: any;
  stats: DeskStats;
  priorityColor: string;
  onClick: () => void;
  onPointerDown?: () => void;
}) => (
  <Card
    variant="outlined"
    sx={{
      height: "153px",
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
    <CardContent>
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
        </Box>

        <Chip
          label={`${stats.dueCards} due`}
          size="small"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          color={priorityColor as any}
          variant="outlined"
          sx={{ ml: 1, flexShrink: 0 }}
        />
      </Box>

      {desk.description && (
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
          {desk.description}
        </Typography>
      )}

      <Box>
        <MasteryProgress {...stats} />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
          {stats.masteredCards} mastered • {stats.learningCards} learning •{" "}
          {stats.dueCards} due • {stats.newCards} new
        </Typography>
      </Box>
    </CardContent>
  </Card>
);
