import { FormControl, MenuItem, Select } from "@mui/material";
import { useThemeContext } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <FormControl size="small">
      <Select
        labelId="theme-select-label"
        value={mode}
        onChange={toggleTheme}
        size="small"
        sx={{ minWidth: 120, fontSize: 12 }}
      >
        <MenuItem value="light">Light</MenuItem>
        <MenuItem value="dark">Dark</MenuItem>
      </Select>
    </FormControl>
  );
}
