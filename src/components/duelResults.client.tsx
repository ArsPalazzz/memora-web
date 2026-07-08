import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import PeopleIcon from "@mui/icons-material/People";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import WithBottomNav from "@/components/layout/WithBottomNav";
import { FullPageLoader } from "@/components/ui/Loader";
import { DuelResultsPodium } from "@/components/duel/DuelResultsPodium";
import { DuelResultsStats } from "@/components/duel/DuelResultsStats";
import { DuelCardBreakdown } from "@/components/duel/DuelCardBreakdown";
import { useDuelResults } from "@/hooks/useDuelResults";
import { ROUTES } from "@/routes/paths";

export default function DuelResultsClient() {
  const { id = "" } = useParams();
  const navigate = useNavigate();

  const {
    results,
    duel,
    me,
    opponentEntry,
    opponent,
    outcome,
    headToHead,
    isLoading,
    error,
    hasWrongCards,
    isRematching,
    isAddingWrongCards,
    rematch,
    addWrongCards,
    mySub,
  } = useDuelResults(id);

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (error || !results || !me || !outcome) {
    return (
      <WithBottomNav>
        <Header title="Duel results" onBack={() => navigate(ROUTES.HOME)} />
        <Box sx={{ p: 3 }}>
          <Typography color="error">
            {error?.message ?? "Results not available"}
          </Typography>
        </Box>
      </WithBottomNav>
    );
  }

  return (
    <WithBottomNav>
      <Header title="Duel results" onBack={() => navigate(ROUTES.HOME)} />

      <Box
        sx={{
          pb: 4,
          maxWidth: 560,
          mx: "auto",
          width: "100%",
        }}
      >
        <DuelResultsPodium me={me} opponent={opponentEntry} outcome={outcome} />

        {duel && (
          <Box sx={{ px: 2, pb: 1, textAlign: "center" }}>
            <Typography variant="overline" color="text.secondary">
              {duel.deskTitle}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 0.5 }}>
              <Chip size="small" label={`${duel.config.cardCount} cards`} />
              <Chip size="small" label={duel.config.cardPick} variant="outlined" />
            </Stack>
          </Box>
        )}

        {headToHead && opponent && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Box
              sx={{
                mx: 2,
                mb: 1.5,
                p: 1.5,
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                textAlign: "center",
              }}
            >
              <Typography variant="subtitle2" fontWeight={800}>
                Head-to-head vs @{opponent.nickname}
              </Typography>
              <Typography variant="h6" fontWeight={900}>
                {headToHead.wins}W – {headToHead.losses}L
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {headToHead.totalDuels} duels played
              </Typography>
            </Box>
          </motion.div>
        )}

        <DuelResultsStats me={me} opponent={opponentEntry} />

        <DuelCardBreakdown
          cards={results.cardByCard}
          mySub={mySub ?? me.sub}
          opponentSub={opponentEntry?.sub}
        />

        <Stack spacing={1.25} sx={{ px: 2, pt: 2 }}>
          {opponent && (
            <Button
              fullWidth
              size="large"
              variant="contained"
              startIcon={<ReplayIcon />}
              disabled={isRematching}
              onClick={rematch}
            >
              Rematch
            </Button>
          )}

          {hasWrongCards && (
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LibraryAddIcon />}
              disabled={isAddingWrongCards}
              onClick={addWrongCards}
            >
              Add my wrong cards to review
            </Button>
          )}

          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PeopleIcon />}
              onClick={() => navigate(ROUTES.FRIENDS)}
            >
              Friends
            </Button>
            {duel && (
              <Button
                fullWidth
                variant="outlined"
                startIcon={<MenuBookIcon />}
                onClick={() => navigate(`/desk/${duel.deskSub}`)}
              >
                Desk
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    </WithBottomNav>
  );
}
