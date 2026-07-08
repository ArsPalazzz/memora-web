import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IosShareIcon from "@mui/icons-material/IosShare";
import { copyDuelJoinLink, shareDuelJoinLink } from "@/utils/duelShare";
import { useNotification } from "@/context/NotificationContext";

interface DuelLobbyShareProps {
  code: string;
  deskTitle: string;
}

export function DuelLobbyShare({ code, deskTitle }: DuelLobbyShareProps) {
  const { notifySuccess, notifyError } = useNotification();

  const handleCopy = async () => {
    try {
      await copyDuelJoinLink(code);
      notifySuccess("Invite link copied");
    } catch {
      notifyError("Could not copy invite link");
    }
  };

  const handleShare = async () => {
    try {
      const result = await shareDuelJoinLink({ code, deskTitle });
      if (result === "shared") {
        notifySuccess("Invite shared");
      } else if (result === "copied") {
        notifySuccess("Invite link copied");
      }
    } catch {
      notifyError("Could not share invite link");
    }
  };

  return (
    <Stack spacing={1.5}>
      <Typography
        variant="h2"
        fontWeight={800}
        letterSpacing="0.2em"
        textAlign="center"
        sx={{ fontFamily: "monospace" }}
      >
        {code}
      </Typography>

      <Stack direction="row" spacing={1}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ContentCopyIcon />}
          onClick={handleCopy}
        >
          Copy link
        </Button>
        <Button
          fullWidth
          variant="contained"
          startIcon={<IosShareIcon />}
          onClick={handleShare}
        >
          Share
        </Button>
      </Stack>

      <Box sx={{ textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          Send this code or link to your friend
        </Typography>
      </Box>
    </Stack>
  );
}
