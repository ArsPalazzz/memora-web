import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  useMediaQuery,
  useTheme,
  Box,
  alpha,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { CardExamplesModalProps } from "./CardExamples.types";

export default function CardExamplesModal(props: CardExamplesModalProps) {
  const {
    open,
    onClose,
    examples,
    canRegenerate = false,
    isRegenerating = false,
    onRegenerate,
  } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const hasFewExamples = examples.length < 3;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          maxWidth: isMobile ? "80vw" : "40vw",
          width: isMobile ? "80vw" : "40vw",
          maxHeight: "90vh",
          bgcolor: "background.default",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Card Examples
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {examples.length > 0 ? (
          <Box
            sx={{
              maxHeight: 250,
              overflowY: "auto",
              bgcolor: alpha(theme.palette.background.default, 0.25),
              borderRadius: 1,
              p: 2,
              fontSize: "1rem",
              lineHeight: 1.5,
            }}
          >
            {examples.map((example, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                {index + 1}. {example}
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No examples yet.
          </Typography>
        )}

        {canRegenerate && hasFewExamples && !isRegenerating && (
          <Typography variant="body2" color="text.secondary">
            Examples are missing or incomplete. You can regenerate them.
          </Typography>
        )}
      </DialogContent>

      {(canRegenerate && onRegenerate) && (
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: "space-between" }}>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
          <Button
            onClick={onRegenerate}
            variant="contained"
            disabled={isRegenerating}
            startIcon={
              isRegenerating ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <AutorenewIcon />
              )
            }
          >
            {isRegenerating ? "Generating..." : "Regenerate examples"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
