import { Box, Button, Typography } from "@mui/material";
import { FullPageLoader } from "@/components/ui/Loader";

interface FeedStudyStatePanelProps {
  title: string;
  message: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

function FeedStudyStatePanel({
  title,
  message,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: FeedStudyStatePanelProps) {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        py: 6,
        textAlign: "center",
        gap: 2,
      }}
    >
      <Typography variant="h6" fontWeight={700}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
      <Button variant="contained" onClick={onPrimary} sx={{ minHeight: 44, mt: 1 }}>
        {primaryLabel}
      </Button>
      {secondaryLabel && onSecondary && (
        <Button variant="text" onClick={onSecondary} sx={{ minHeight: 44 }}>
          {secondaryLabel}
        </Button>
      )}
    </Box>
  );
}

export function FeedStudyEmpty({ onRetry }: { onRetry: () => void }) {
  return (
    <FeedStudyStatePanel
      title="No cards to study"
      message="There are no recommended cards right now. Try again later or change feed settings."
      primaryLabel="Try again"
      onPrimary={onRetry}
    />
  );
}

export function FeedStudyError({ onRetry }: { onRetry: () => void }) {
  return (
    <FeedStudyStatePanel
      title="Could not load session"
      message="Something went wrong while starting your study session."
      primaryLabel="Retry"
      onPrimary={onRetry}
    />
  );
}

export function FeedStudyLoading() {
  return <FullPageLoader />;
}
