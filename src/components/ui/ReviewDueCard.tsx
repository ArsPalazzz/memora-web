import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

interface ReviewDueCardProps {
  totalDueCount: number;
  inboxCount: number;
  onStartStudy: () => void;
  isStarting: boolean;
}

export function ReviewDueCard({
  totalDueCount,
  inboxCount,
  onStartStudy,
  isStarting,
}: ReviewDueCardProps) {
  const totalStudyCount = totalDueCount + inboxCount;
  const hasStudyCards = totalStudyCount > 0;

  return (
    <Card variant="outlined">
      <CardContent sx={{ py: 1.25, "&:last-child": { pb: 1.25 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" fontWeight={700}>
              {hasStudyCards ? "Today's practice" : "All caught up"}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Due {totalDueCount} · Feed {inboxCount}
            </Typography>
          </Box>

          <Button
            size="small"
            variant="contained"
            disabled={!hasStudyCards || isStarting}
            onClick={onStartStudy}
            sx={{ flexShrink: 0, minWidth: 72 }}
          >
            {isStarting ? "..." : "Study"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
