import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";
import type { DuelRaceScoreboardEntry } from "@/services/games/duel.types";
import {
  averageAnswerTimeMs,
  formatAccuracy,
  formatRaceDuration,
} from "@/utils/duelResults.utils";

interface DuelResultsStatsProps {
  me: DuelRaceScoreboardEntry;
  opponent: DuelRaceScoreboardEntry | null;
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography fontWeight={800}>{value}</Typography>
    </Box>
  );
}

function PlayerStatsCard({
  entry,
  title,
  delay,
}: {
  entry: DuelRaceScoreboardEntry;
  title: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={800} gutterBottom>
            {title}
          </Typography>
          <Grid container spacing={1.5}>
            <Grid size={6}>
              <StatBlock label="Score" value={String(entry.score)} />
            </Grid>
            <Grid size={6}>
              <StatBlock
                label="Accuracy"
                value={formatAccuracy(entry.correctCount, entry.wrongCount)}
              />
            </Grid>
            <Grid size={6}>
              <StatBlock
                label="Avg time"
                value={formatRaceDuration(averageAnswerTimeMs(entry))}
              />
            </Grid>
            <Grid size={6}>
              <StatBlock label="Max streak" value={String(entry.maxStreak)} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DuelResultsStats({ me, opponent }: DuelResultsStatsProps) {
  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: opponent ? 6 : 12 }}>
          <PlayerStatsCard entry={me} title="You" delay={0.05} />
        </Grid>
        {opponent && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <PlayerStatsCard
              entry={opponent}
              title={`@${opponent.nickname}`}
              delay={0.1}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
