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
  selectedDueCount: number;
  selectedInboxCount: number;
  onOpenPicker: () => void;
}

export function ReviewDueCard({
  totalDueCount,
  inboxCount,
  selectedDueCount,
  selectedInboxCount,
  onOpenPicker,
}: ReviewDueCardProps) {
  const totalStudyCount = totalDueCount + inboxCount;
  const selectedStudyCount = selectedDueCount + selectedInboxCount;
  const hasStudyCards = totalStudyCount > 0;
  const hasFilteredSelection = selectedStudyCount > 0;

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
              {hasStudyCards
                ? selectedStudyCount === totalStudyCount
                  ? `Due ${totalDueCount} · Feed ${inboxCount}`
                  : `Selected ${selectedStudyCount} of ${totalStudyCount}`
                : "Due 0 · Feed 0"}
            </Typography>
          </Box>

          <Button
            size="small"
            variant="contained"
            disabled={!hasStudyCards}
            onClick={onOpenPicker}
            sx={{ flexShrink: 0, minWidth: 72 }}
          >
            {hasFilteredSelection ? "Study" : "Choose"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
