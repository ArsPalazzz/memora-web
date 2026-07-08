import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import { APP_HEADER_HEIGHT } from "@/components/layout/header.constants";
import { FullPageLoader } from "@/components/ui/Loader";
import { DuelRaceView } from "@/components/duel/DuelRaceView";
import { useDuelRace } from "@/hooks/useDuelRace";
import { ROUTES } from "@/routes/paths";
import { VIEWPORT_SHELL_SX } from "@/components/layout/viewport.constants";

export default function DuelRaceClient() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const {
    payload,
    currentCard,
    cardIndex,
    cardCount,
    cardTimerMs,
    scoreState,
    answer,
    setAnswer,
    submitAnswer,
    inputLocked,
    shake,
    isComplete,
    isLoading,
    loadError,
    meTrack,
    opponentTrack,
    disconnectBanner,
    forfeitDialogOpen,
    setForfeitDialogOpen,
    confirmForfeit,
  } = useDuelRace(id);

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (loadError || !payload) {
    return (
      <>
        <Header title="Duel" onBack={() => navigate(ROUTES.HOME)} />
        <Box sx={{ p: 3, pt: APP_HEADER_HEIGHT }}>
          <Typography color="error">
            {loadError?.message ?? "Could not load duel race"}
          </Typography>
        </Box>
      </>
    );
  }

  if (isComplete) {
    return <FullPageLoader />;
  }

  return (
    <>
      <Header
        title="Duel"
        onBack={() => navigate(ROUTES.duelLobby(id))}
        RightButton={
          <IconButton
            aria-label="Race menu"
            onClick={(event) => setMenuAnchor(event.currentTarget)}
            sx={{ color: "white" }}
          >
            <MoreVertIcon />
          </IconButton>
        }
      />

      <Box
        sx={{
          ...VIEWPORT_SHELL_SX,
          pt: APP_HEADER_HEIGHT,
          boxSizing: "border-box",
        }}
      >
        <DuelRaceView
          payload={payload}
          currentCard={currentCard}
          cardIndex={cardIndex}
          cardCount={cardCount}
          cardTimerMs={cardTimerMs}
          scoreState={scoreState}
          answer={answer}
          setAnswer={setAnswer}
          submitAnswer={submitAnswer}
          inputLocked={inputLocked}
          shake={shake}
          meTrack={meTrack}
          opponentTrack={opponentTrack}
          disconnectBanner={disconnectBanner}
        />
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            setForfeitDialogOpen(true);
          }}
          sx={{ color: "error.main" }}
        >
          Forfeit duel
        </MenuItem>
      </Menu>

      <Dialog
        open={forfeitDialogOpen}
        onClose={() => setForfeitDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Forfeit duel?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will lose this race. Your opponent wins by default.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setForfeitDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmForfeit}>
            Forfeit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
