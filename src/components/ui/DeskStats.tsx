
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Box, Typography, Stack, IconButton } from "@mui/material";
import { useMemo, useState } from "react";

interface DeskStatsProps {
  stats: {
    total_cards: number;
    new_cards: number;
    due_today: number;
    mastered_cards: number;
    avg_ease_factor: number;
    weeklyStats: {
      current: {
        mon: number;
        tue: number;
        wed: number;
        thu: number;
        fri: number;
        sat: number;
        sun: number;
      };
      previous: {
        mon: number;
        tue: number;
        wed: number;
        thu: number;
        fri: number;
        sat: number;
        sun: number;
      };
    };
  };
}

const PIE_COLORS = {
  due: "#ff6b6b",
  new: "#4ecdc4",
  learning: "#45b7d1",
  mastered: "#96ceb4",
} as const;

const chartContainerSx = {
  pointerEvents: "none" as const,
  userSelect: "none" as const,
  overflow: "hidden" as const,
};

function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window
  );
}

function EmptyPieRing() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box component="svg" viewBox="0 0 100 100" sx={{ width: 80, height: 80 }}>
        <circle
          cx="50"
          cy="50"
          r="32.5"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="15"
        />
      </Box>
    </Box>
  );
}

const PIE_RADIUS = 32.5;
const PIE_STROKE = 15;
const PIE_CIRCUMFERENCE = 2 * Math.PI * PIE_RADIUS;
const PIE_CENTER = 50;

function describeArcPath(
  startAngleDeg: number,
  endAngleDeg: number,
  radius = PIE_RADIUS,
  cx = PIE_CENTER,
  cy = PIE_CENTER
) {
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const startX = cx + radius * Math.cos(toRad(startAngleDeg));
  const startY = cy + radius * Math.sin(toRad(startAngleDeg));
  const endX = cx + radius * Math.cos(toRad(endAngleDeg));
  const endY = cy + radius * Math.sin(toRad(endAngleDeg));
  const sweep = endAngleDeg - startAngleDeg;
  const largeArc = sweep > 180 ? 1 : 0;

  return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`;
}

function AnimatedDonut({
  segments,
  durationMs,
}: {
  segments: { value: number; color: string }[];
  durationMs: number;
}) {
  const arcs = useMemo(() => {
    const activeSegments = segments.filter((segment) => segment.value > 0);
    const total = activeSegments.reduce((sum, segment) => sum + segment.value, 0);
    if (total === 0) return [];

    if (activeSegments.length === 1) {
      return [
        {
          key: 0,
          color: activeSegments[0].color,
          arcLength: PIE_CIRCUMFERENCE,
          fullCircle: true,
        },
      ];
    }

    let angle = 0;
    return activeSegments.map((segment, index) => {
      const isLast = index === activeSegments.length - 1;
      const sweep = isLast
        ? 360 - angle
        : (segment.value / total) * 360;
      const startAngle = angle;
      const endAngle = angle + sweep;
      angle += sweep;

      return {
        key: index,
        color: segment.color,
        arcLength: (sweep / 360) * PIE_CIRCUMFERENCE,
        fullCircle: false,
        path: describeArcPath(startAngle, endAngle),
      };
    });
  }, [segments]);

  if (arcs.length === 0) return <EmptyPieRing />;

  return (
    <Box
      component="svg"
      viewBox="0 0 100 100"
      sx={{ width: "100%", height: "100%", display: "block" }}
    >
      {arcs.map((arc) => {
        const animationName = `deskStatsPieDraw${arc.key}`;

        if (arc.fullCircle) {
          return (
            <Box
              key={arc.key}
              component="circle"
              cx={PIE_CENTER}
              cy={PIE_CENTER}
              r={PIE_RADIUS}
              fill="none"
              stroke={arc.color}
              strokeWidth={PIE_STROKE}
              sx={{
                strokeDasharray: arc.arcLength,
                strokeDashoffset: arc.arcLength,
                transformOrigin: "50px 50px",
                transform: "rotate(-90deg)",
                animation: `${animationName} ${durationMs}ms ease forwards`,
                [`@keyframes ${animationName}`]: {
                  to: { strokeDashoffset: 0 },
                },
              }}
            />
          );
        }

        if ("path" in arc) {
          return (
            <Box
              key={arc.key}
              component="path"
              d={arc.path}
              fill="none"
              stroke={arc.color}
              strokeWidth={PIE_STROKE}
              strokeLinecap="butt"
              sx={{
                strokeDasharray: arc.arcLength,
                strokeDashoffset: arc.arcLength,
                animation: `${animationName} ${durationMs}ms ease forwards`,
                [`@keyframes ${animationName}`]: {
                  to: { strokeDashoffset: 0 },
                },
              }}
            />
          );
        }

        return null;
      })}
    </Box>
  );
}

function AnimatedBarChart({
  data,
  durationMs,
  animationKey,
}: {
  data: { day: string; count: number }[];
  durationMs: number;
  animationKey: string;
}) {
  const maxCount = Math.max(...data.map((item) => item.count), 1);
  const labelHeight = 12;
  const dayLabelHeight = 14;
  const plotHeight = 64;

  return (
    <Box
      key={animationKey}
      sx={{
        display: "flex",
        height: "100%",
        overflow: "visible",
        "@keyframes deskStatsBarGrow": {
          from: { transform: "scaleY(0)" },
          to: { transform: "scaleY(1)" },
        },
      }}
    >
      {data.map((item) => {
        const barHeight =
          item.count > 0 ? Math.max(2, (item.count / maxCount) * plotHeight) : 0;

        return (
          <Box
            key={item.day}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                height: labelHeight,
                flexShrink: 0,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: 9,
                  lineHeight: 1,
                  color: "#666",
                }}
              >
                {item.count > 0 ? item.count : ""}
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                width: "100%",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                minHeight: 0,
              }}
            >
              <Box
                sx={{
                  width: "70%",
                  height: barHeight,
                  bgcolor: "#5961d3",
                  opacity: 0.6,
                  borderRadius: "2px 2px 0 0",
                  transformOrigin: "bottom",
                  transform: "scaleY(0)",
                  animation:
                    item.count > 0
                      ? `deskStatsBarGrow ${durationMs}ms ease forwards`
                      : "none",
                }}
              />
            </Box>

            <Box
              sx={{
                height: dayLabelHeight,
                flexShrink: 0,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                pt: 0.5,
              }}
            >
              <Typography sx={{ fontSize: 10, lineHeight: 1 }}>
                {item.day}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

export function AnkiStyleStats({ stats }: DeskStatsProps) {
  const [week, setWeek] = useState<"current" | "previous">("current");
  const chartAnimationMs = isTouchDevice() ? 800 : 1200;

  const pieData = [
    { name: "Due", value: stats.due_today, color: PIE_COLORS.due },
    { name: "New", value: stats.new_cards, color: PIE_COLORS.new },
    {
      name: "Learning",
      value: Math.max(
        0,
        stats.total_cards -
          stats.due_today -
          stats.new_cards -
          stats.mastered_cards
      ),
      color: PIE_COLORS.learning,
    },
    { name: "Mastered", value: stats.mastered_cards, color: PIE_COLORS.mastered },
  ];

  const pieTotal = pieData.reduce((sum, item) => sum + item.value, 0);

  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

  const barData = days.map((day, index) => ({
    day: dayLabels[index],
    count:
      stats.weeklyStats[week][day as keyof typeof stats.weeklyStats.current],
  }));

  const handlePrevWeek = () => setWeek("previous");
  const handleNextWeek = () => setWeek("current");

  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Deck Overview
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {stats.total_cards} cards
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ width: "40%", height: 100, ...chartContainerSx }}>
          {pieTotal === 0 ? (
            <EmptyPieRing />
          ) : (
            <AnimatedDonut
              segments={pieData}
              durationMs={chartAnimationMs}
            />
          )}
        </Box>

        <Box sx={{ width: "60%" }}>
          <Stack spacing={0.5}>
            {pieData.map((item, index) => (
              <Stack
                key={index}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: item.color,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {item.name}
                  </Typography>
                </Stack>
                <Typography variant="caption" fontWeight={600}>
                  {item.value}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Stack>

      <Box
        sx={{
          mt: 2,
          height: 90,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <AnimatedBarChart
          data={barData}
          durationMs={pieTotal === 0 ? 0 : chartAnimationMs}
          animationKey={week}
        />
      </Box>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mt={1}
      >
        <Typography variant="caption" color="text.secondary">
          Due today:{" "}
          <Typography component="span" fontWeight={600} color="#ff6b6b">
            {stats.due_today}
          </Typography>
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton
            size="small"
            onClick={handlePrevWeek}
            disabled={week !== "current"}
            sx={{ color: week !== "current" ? "disabled" : "default" }}
          >
            <ArrowBackIos fontSize="small" />
          </IconButton>
          <Typography variant="caption" fontWeight={600}>
            {week === "current" ? "This Week" : "Previous Week"}
          </Typography>
          <IconButton
            size="small"
            onClick={handleNextWeek}
            disabled={week === "current"}
            sx={{ color: week === "current" ? "disabled" : "default" }}
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        </Stack>

        <Typography variant="caption" color="text.secondary">
          Ease:{" "}
          <Typography component="span" fontWeight={600}>
            {stats.avg_ease_factor.toFixed(1)}
          </Typography>
        </Typography>
      </Stack>
    </Box>
  );
}
