import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
  Typography,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { useThemeContext } from "@/context/ThemeContext";

export default function ThemeToggle({ sx }: { sx: SxProps }) {
  const { mode, setMode } = useThemeContext();

  const handleChange = (event: SelectChangeEvent) => {
    setMode(event.target.value as "light" | "dark");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
        gap: 2,
        mb: 3,
        ...sx,
      }}
    >
      <Typography>Change theme:</Typography>
      <FormControl size="small">
        <Select
          labelId="theme-select-label"
          value={mode}
          onChange={handleChange}
        >
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
