import { Box } from "@mui/material";

interface DeskStats {
  learningCards: number;
  dueCards: number;
  newCards: number;
  masteredCards: number;
  lastReviewed?: string;
}

export const MasteryProgress = ({
  learningCards: learning,
  masteredCards: mastered,
  dueCards: due,
  newCards,
}: DeskStats) => {
  const total = mastered + due + newCards + learning;

  const masteredPercentage = total > 0 ? (mastered / total) * 100 : 0;
  const learningPercentage = total > 0 ? (learning / total) * 100 : 0;
  const duePercentage = total > 0 ? (due / total) * 100 : 0;
  const newPercentage = total > 0 ? (newCards / total) * 100 : 0;

  if (total === 0) {
    return (
      <Box
        sx={{
          height: 12,
          borderRadius: 6,
          bgcolor: "grey.200",
        }}
      />
    );
  }

  const segments = [];
  let accumulatedLeft = 0;

  if (mastered > 0) {
    const percentage = masteredPercentage;
    segments.push({
      key: "mastered",
      left: accumulatedLeft,
      width: percentage,
      color: "#96ceb4",
      opacity: 0.9,
    });
    accumulatedLeft += percentage;
  }

  if (learning > 0) {
    const percentage = learningPercentage;
    segments.push({
      key: "learning",
      left: accumulatedLeft,
      width: percentage,
      color: "#45b7d1",
      opacity: 0.9,
    });
    accumulatedLeft += percentage;
  }

  if (due > 0) {
    const percentage = duePercentage;
    segments.push({
      key: "due",
      left: accumulatedLeft,
      width: percentage,
      color: "#ff6b6b",
      opacity: 0.9,
    });
    accumulatedLeft += percentage;
  }

  if (newCards > 0) {
    const percentage = newPercentage;
    segments.push({
      key: "new",
      left: accumulatedLeft,
      width: percentage,
      color: "#4ecdc4",
      opacity: 0.9,
    });
  }

  return (
    <Box
      sx={{
        position: "relative",
        height: 12,
        borderRadius: 6,
        overflow: "hidden",
        bgcolor: "grey.200",
      }}
    >
      {segments.map((segment) => (
        <Box
          key={segment.key}
          sx={{
            position: "absolute",
            left: `${segment.left}%`,
            width: `${segment.width}%`,
            height: "100%",
            bgcolor: segment.color,
            opacity: segment.opacity,
          }}
        />
      ))}
    </Box>
  );
};
