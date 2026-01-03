"use client";

import { Box, Typography, Stack } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
} from "recharts";

interface DeskStatsProps {
  stats: {
    total_cards: number;
    new_cards: number;
    due_today: number;
    mastered_cards: number;
    avg_ease_factor: number;
  };
}

export function AnkiStyleStats({ stats }: DeskStatsProps) {
  const pieData = [
    { name: "Due", value: stats.due_today, color: "#ff6b6b" },
    { name: "New", value: stats.new_cards, color: "#4ecdc4" },
    {
      name: "Learning",
      value: Math.max(
        0,
        stats.total_cards -
          stats.due_today -
          stats.new_cards -
          stats.mastered_cards
      ),
      color: "#45b7d1",
    },
    { name: "Mastered", value: stats.mastered_cards, color: "#96ceb4" },
  ];

  const barData = [
    { day: "M", count: stats.due_today },
    { day: "T", count: Math.floor(stats.due_today * 0.7) },
    { day: "W", count: Math.floor(stats.due_today * 0.5) },
    { day: "T", count: Math.floor(stats.due_today * 0.3) },
    { day: "F", count: Math.floor(stats.due_today * 0.4) },
    { day: "S", count: Math.floor(stats.due_today * 0.2) },
    { day: "S", count: Math.floor(stats.due_today * 0.1) },
  ];

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
        <Box sx={{ width: "40%", height: 100 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={40}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
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

      <Box sx={{ mt: 2, height: 50 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barData}
            margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
          >
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
            />
            <Bar
              dataKey="count"
              radius={[2, 2, 0, 0]}
              fill="#5961d3"
              fillOpacity={0.6}
            />
          </BarChart>
        </ResponsiveContainer>
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
