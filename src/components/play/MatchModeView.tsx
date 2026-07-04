import { Box, Button, Chip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import LinkIcon from "@mui/icons-material/Link";
import {
  MatchBoardCard,
  MatchBoardRightSlot,
} from "@/services/games/games.types";

interface MatchModeViewProps {
  cards: MatchBoardCard[];
  rightSlots: MatchBoardRightSlot[];
  selectedLeft: string | null;
  pairs: Record<string, number>;
  matchedLeftSubs: Set<string>;
  matchedSlotIds: Set<number>;
  recentMatch: string | null;
  allPaired: boolean;
  isSubmitting: boolean;
  onSelectLeft: (cardSub: string) => void;
  onSelectRight: (slotId: number) => void;
  onSubmit: () => void;
}

function MatchItem({
  label,
  selected,
  matched,
  recent,
  onClick,
  side,
}: {
  label: string;
  selected: boolean;
  matched: boolean;
  recent: boolean;
  onClick: () => void;
  side: "left" | "right";
}) {
  const theme = useTheme();

  return (
    <motion.div
      layout
      initial={false}
      animate={
        recent
          ? { scale: [1, 1.03, 1], transition: { duration: 0.35 } }
          : { scale: 1 }
      }
    >
      <Box
        onClick={matched ? undefined : onClick}
        sx={{
          minHeight: 44,
          px: 1.5,
          py: 1.25,
          borderRadius: 2,
          border: "2px solid",
          borderColor: selected
            ? "primary.main"
            : matched
              ? "success.light"
              : "divider",
          bgcolor: selected
            ? "action.selected"
            : matched
              ? theme.palette.mode === "dark"
                ? "rgba(67, 160, 71, 0.12)"
                : "successBg"
              : "background.paper",
          opacity: matched ? 0.72 : 1,
          cursor: matched ? "default" : "pointer",
          display: "flex",
          alignItems: "center",
          gap: 1,
          boxShadow: selected ? 2 : 0,
          transition: "border-color 0.2s, background-color 0.2s",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {matched && (
          <LinkIcon sx={{ fontSize: 16, color: "success.main", flexShrink: 0 }} />
        )}
        <Typography
          variant="body2"
          fontWeight={selected ? 600 : 500}
          sx={{ flex: 1, lineHeight: 1.35 }}
        >
          {label}
        </Typography>
        {matched && (
          <Chip
            label={side === "left" ? "Matched" : "Taken"}
            size="small"
            color="success"
            variant="outlined"
            sx={{ height: 24, fontSize: "0.7rem" }}
          />
        )}
      </Box>
    </motion.div>
  );
}

function ColumnSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
      <Typography
        variant="overline"
        color="text.secondary"
        fontWeight={700}
        sx={{ mb: 1, letterSpacing: 1.2, px: 0.5 }}
      >
        {title}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {children}
      </Box>
    </Box>
  );
}

export function MatchModeView({
  cards,
  rightSlots,
  selectedLeft,
  pairs,
  matchedLeftSubs,
  matchedSlotIds,
  recentMatch,
  allPaired,
  isSubmitting,
  onSelectLeft,
  onSelectRight,
  onSubmit,
}: MatchModeViewProps) {
  const theme = useTheme();
  const isWide = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        px: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, px: 0.5 }}>
        Tap a term on the left, then its match on the right.
      </Typography>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          display: "flex",
          flexDirection: isWide ? "row" : "column",
          gap: 2,
          pb: 1,
        }}
      >
        <ColumnSection title="Left">
          <AnimatePresence initial={false}>
            {cards.map((card) => (
              <MatchItem
                key={card.sub}
                label={card.front.join(", ")}
                selected={selectedLeft === card.sub}
                matched={matchedLeftSubs.has(card.sub)}
                recent={recentMatch === card.sub}
                onClick={() => onSelectLeft(card.sub)}
                side="left"
              />
            ))}
          </AnimatePresence>
        </ColumnSection>

        <ColumnSection title="Right">
          <AnimatePresence initial={false}>
            {rightSlots.map((slot) => (
              <MatchItem
                key={slot.slotId}
                label={slot.text}
                selected={false}
                matched={matchedSlotIds.has(slot.slotId)}
                recent={false}
                onClick={() => onSelectRight(slot.slotId)}
                side="right"
              />
            ))}
          </AnimatePresence>
        </ColumnSection>
      </Box>

      {matchedLeftSubs.size > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1, mb: 1 }}>
          {cards
            .filter((c) => matchedLeftSubs.has(c.sub))
            .map((card) => {
              const slot = rightSlots.find((s) => s.slotId === pairs[card.sub]);
              return (
                <Chip
                  key={card.sub}
                  size="small"
                  icon={<LinkIcon />}
                  label={`${card.front[0]?.slice(0, 12) ?? "…"} → ${slot?.text.slice(0, 12) ?? "…"}`}
                  variant="outlined"
                  color="primary"
                />
              );
            })}
        </Box>
      )}

      <Box sx={{ mt: "auto", pt: 2, pb: 1 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={!allPaired || isSubmitting}
          onClick={onSubmit}
          sx={{ minHeight: 48 }}
        >
          {isSubmitting ? "Checking…" : `Submit (${matchedLeftSubs.size}/${cards.length})`}
        </Button>
      </Box>
    </Box>
  );
}
