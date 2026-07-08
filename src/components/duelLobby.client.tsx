import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import EditIcon from "@mui/icons-material/Edit";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import WithBottomNav from "@/components/layout/WithBottomNav";
import { FullPageLoader } from "@/components/ui/Loader";
import { DuelLobbyShare } from "@/components/duel/DuelLobbyShare";
import { DuelLobbyBanner } from "@/components/duel/DuelLobbyBanner";
import { DuelHostConfigPanel } from "@/components/duel/DuelHostConfigPanel";
import { DuelPlayerSlot } from "@/components/duel/DuelPlayerSlot";
import { DuelCountdownOverlay } from "@/components/duel/DuelCountdownOverlay";
import { useDuelLobby } from "@/hooks/useDuelLobby";
import { ROUTES } from "@/routes/paths";

function modeLabel(mode: string): string {
  if (mode === "write") {
    return "Write";
  }

  return mode;
}

export default function DuelLobbyClient() {
  const { id = "" } = useParams();
  const navigate = useNavigate();

  const {
    lobby,
    me,
    mySub,
    isHost,
    canStart,
    playerSlots,
    countdownEndsAt,
    banner,
    isInitialLoading,
    fetchError,
    toggleReady,
    updateConfig,
    startDuel,
    leaveLobby,
  } = useDuelLobby(id);

  if (isInitialLoading) {
    return <FullPageLoader />;
  }

  if (fetchError || !lobby) {
    return (
      <WithBottomNav>
        <Header title="Duel lobby" onBack={() => navigate(ROUTES.HOME)} />
        <Box sx={{ p: 3 }}>
          <Typography color="error">
            {(fetchError as Error | undefined)?.message ?? "Duel not found"}
          </Typography>
        </Box>
      </WithBottomNav>
    );
  }

  const showCountdown =
    lobby.status === "countdown" && countdownEndsAt !== null;
  const lobbyLocked = lobby.status !== "waiting";

  return (
    <WithBottomNav>
      <Header
        title="Duel lobby"
        onBack={() => {
          void leaveLobby().finally(() => navigate(ROUTES.HOME));
        }}
      />

      {showCountdown && countdownEndsAt !== null && (
        <DuelCountdownOverlay countdownEndsAt={countdownEndsAt} />
      )}

      <Box
        sx={{
          px: 2,
          py: 2.5,
          pb: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          maxWidth: 480,
          mx: "auto",
          width: "100%",
        }}
      >
        <DuelLobbyBanner banner={banner} />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ letterSpacing: 1.2 }}
            >
              {lobby.deskTitle}
            </Typography>
            <Typography variant="h5" fontWeight={800} sx={{ mt: 0.5 }}>
              {lobby.config.cardCount} cards
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              sx={{ mt: 1.5 }}
            >
              <Chip
                icon={<EditIcon sx={{ fontSize: "16px !important" }} />}
                label={modeLabel(lobby.config.mode)}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                label={lobby.config.cardPick === "random" ? "Random" : "Newest"}
                size="small"
                variant="outlined"
              />
              <Chip
                label={lobby.status}
                size="small"
                color={
                  lobby.status === "waiting"
                    ? "default"
                    : lobby.status === "countdown"
                      ? "warning"
                      : "primary"
                }
              />
            </Stack>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <DuelLobbyShare code={lobby.code} deskTitle={lobby.deskTitle} />
        </motion.div>

        {isHost && lobby.status === "waiting" && (
          <DuelHostConfigPanel config={lobby.config} onChange={updateConfig} />
        )}

        <Stack spacing={1.25}>
          <Typography variant="subtitle2" fontWeight={700}>
            Players
          </Typography>
          {playerSlots.map((player, index) => (
            <DuelPlayerSlot
              key={player?.sub ?? `empty-${index}`}
              player={player}
              slotIndex={index}
              isMe={Boolean(player && mySub && player.sub === mySub)}
              isHost={Boolean(player && player.sub === lobby.hostSub)}
            />
          ))}
        </Stack>

        {me && lobby.status === "waiting" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
          >
            <Button
              fullWidth
              size="large"
              variant={me.ready ? "outlined" : "contained"}
              onClick={toggleReady}
              disabled={lobbyLocked}
              sx={{ py: 1.25 }}
            >
              {me.ready ? "Cancel ready" : "I'm ready"}
            </Button>
          </motion.div>
        )}

        {isHost && lobby.status === "waiting" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
          >
            <Button
              fullWidth
              size="large"
              variant="contained"
              color="secondary"
              startIcon={<SportsEsportsIcon />}
              disabled={!canStart || lobbyLocked}
              onClick={startDuel}
              sx={{ py: 1.25 }}
            >
              Start duel
            </Button>
          </motion.div>
        )}
      </Box>
    </WithBottomNav>
  );
}
