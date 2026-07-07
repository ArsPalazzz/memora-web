import { Inbox, Replay, School } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
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
    <Card
      sx={{
        border: "2px solid",
        borderColor: hasStudyCards ? "primary.main" : "success.main",
        bgcolor: "background.paper",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" fontWeight={700}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <School sx={{ color: hasStudyCards ? "primary.main" : "success.main" }} />
                {hasStudyCards ? "Today's practice" : "All caught up"}
              </Box>
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Due for review: {totalDueCount}
              {" · "}
              From feed: {inboxCount}
            </Typography>
          </Box>

          <Box
            sx={{
              position: "relative",
              display: "inline-flex",
              flexShrink: 0,
            }}
          >
            <CircularProgress
              variant="determinate"
              value={100}
              size={56}
              thickness={4}
              sx={{
                color: "grey.300",
                position: "absolute",
              }}
            />
            <CircularProgress
              variant="determinate"
              value={hasStudyCards ? 100 : 0}
              size={56}
              thickness={4}
              sx={{
                color: hasStudyCards ? "primary.main" : "success.main",
                position: "relative",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Typography variant="body2" fontWeight={700}>
                {totalStudyCount}
              </Typography>
            </Box>
          </Box>
        </Box>

        {(totalDueCount > 0 || inboxCount > 0) && (
          <Box
            sx={{
              mt: 1.5,
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {totalDueCount > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <Replay sx={{ fontSize: 14, color: "warning.main" }} />
                {totalDueCount} due
              </Typography>
            )}
            {inboxCount > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <Inbox sx={{ fontSize: 14, color: "secondary.main" }} />
                {inboxCount} from feed
              </Typography>
            )}
          </Box>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={!hasStudyCards || isStarting}
          onClick={onStartStudy}
        >
          {isStarting ? "Starting..." : `Study (${totalStudyCount})`}
        </Button>
      </CardContent>
    </Card>
  );
}
