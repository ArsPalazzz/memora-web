import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { MasteryProgress } from "./MasteryProgress";
import RestoreIcon from "@mui/icons-material/Restore";

interface DeskStats {
  learningCards: number;
  dueCards: number;
  newCards: number;
  masteredCards: number;
  lastReviewed?: string;
}

export const ArchivedDeskCard = ({
  desk,
  stats,
  onRestore,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  desk: any;
  stats: DeskStats;
  onRestore: () => void;
}) => (
  <Card
    variant="outlined"
    sx={{
      height: "100%",
      transition: "0.3s",
      cursor: "pointer",
      "&:hover": {
        boxShadow: 6,
        transform: "translateY(-4px)",
        borderColor: "primary.main",
      },
    }}
  >
    <CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            lineHeight: 1.2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {desk.title}
        </Typography>

        <Button
          variant="contained"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onRestore();
          }}
          sx={{
            minWidth: 90,
            height: 32,
            bgcolor: "#398f3c",
            "&:hover": {
              bgcolor: "#388e3c",
              transform: "scale(1.05)",
            },
            transition: "all 0.2s",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(76, 175, 80, 0.2)",
          }}
          startIcon={<RestoreIcon sx={{ fontSize: 18 }} />}
        >
          Restore
        </Button>
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
