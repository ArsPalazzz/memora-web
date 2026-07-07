import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { DeskVisibility } from "@/schemas/createDesk.schema";

const VISIBILITY_OPTIONS: {
  value: DeskVisibility;
  label: string;
  description: string;
}[] = [
  {
    value: "private",
    label: "Private",
    description: "Only you can view this deck",
  },
  {
    value: "friends",
    label: "Friends only",
    description: "Accepted friends can view and add to library",
  },
  {
    value: "public",
    label: "Public",
    description: "Appears in Discover for everyone",
  },
];

interface DeskVisibilitySelectProps {
  value: DeskVisibility;
  onChange: (value: DeskVisibility) => void;
}

export function DeskVisibilitySelect({
  value,
  onChange,
}: DeskVisibilitySelectProps) {
  return (
    <RadioGroup
      value={value}
      onChange={(event) => onChange(event.target.value as DeskVisibility)}
    >
      {VISIBILITY_OPTIONS.map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          control={<Radio size="small" />}
          sx={{ alignItems: "flex-start", mx: 0, mb: 1 }}
          label={
            <Box sx={{ pt: 0.25 }}>
              <Typography variant="body2" fontWeight={600}>
                {option.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {option.description}
              </Typography>
            </Box>
          }
        />
      ))}
    </RadioGroup>
  );
}
