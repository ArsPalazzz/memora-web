import {
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
  Box,
  alpha,
} from "@mui/material";
import { CardExamplesModalProps } from "./CardExamples.types";

export default function CardExamplesModal(props: CardExamplesModalProps) {
  const { open, onClose, examples } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {examples && examples.length > 0 && (
          <Box sx={{ mb: 2 }}>
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
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
