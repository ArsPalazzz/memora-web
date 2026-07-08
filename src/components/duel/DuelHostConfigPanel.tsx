import {
  Box,
  Slider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import { motion } from "framer-motion";
import type { DuelCardPick, DuelConfig } from "@/services/games/duel.types";

const CARD_COUNT_MARKS = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 15, label: "15" },
  { value: 20, label: "20" },
];

interface DuelHostConfigPanelProps {
  config: DuelConfig;
  onChange: (partial: Partial<DuelConfig>) => void;
}

export function DuelHostConfigPanel({ config, onChange }: DuelHostConfigPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Duel settings
        </Typography>

        <Stack spacing={2.5} sx={{ mt: 1.5 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Cards · {config.cardCount}
            </Typography>
            <Slider
              value={config.cardCount}
              min={5}
              max={20}
              step={null}
              marks={CARD_COUNT_MARKS}
              onChange={(_, value) => {
                const cardCount = value as DuelConfig["cardCount"];
                onChange({ cardCount });
              }}
              valueLabelDisplay="off"
              sx={{ px: 0.5 }}
            />
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Card selection
            </Typography>
            <ToggleButtonGroup
              exclusive
              fullWidth
              size="small"
              value={config.cardPick}
              onChange={(_, value: DuelCardPick | null) => {
                if (value) {
                  onChange({ cardPick: value });
                }
              }}
            >
              <ToggleButton value="random">
                <ShuffleIcon sx={{ mr: 0.75, fontSize: 18 }} />
                Random
              </ToggleButton>
              <ToggleButton value="newest">
                <NewReleasesIcon sx={{ mr: 0.75, fontSize: 18 }} />
                Newest
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Stack>
      </Box>
    </motion.div>
  );
}
