import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import DateRangeIcon from "@mui/icons-material/DateRange";
import FolderIcon from "@mui/icons-material/Folder";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

interface SortSelectorProps {
  sortBy: string;
  onChange: (sortBy: string) => void;
}

export const SortSelector = ({ sortBy, onChange }: SortSelectorProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  const sortOptions = [
    {
      value: "date_desc",
      label: "Newest first",
      icon: <DateRangeIcon sx={{ mr: 1, fontSize: 20 }} />,
    },
    {
      value: "date_asc",
      label: "Oldest first",
      icon: <DateRangeIcon sx={{ mr: 1, fontSize: 20 }} />,
    },
    {
      value: "title_asc",
      label: "A → Z",
      icon: <SortByAlphaIcon sx={{ mr: 1, fontSize: 20 }} />,
    },
    {
      value: "title_desc",
      label: "Z → A",
      icon: <SortByAlphaIcon sx={{ mr: 1, fontSize: 20 }} />,
    },
    {
      value: "folders_first_date_desc",
      label: "Folders first (newest)",
      icon: <FolderIcon sx={{ mr: 1, fontSize: 20 }} />,
    },
    {
      value: "desks_first_date_desc",
      label: "Decks first (newest)",
      icon: <LibraryBooksIcon sx={{ mr: 1, fontSize: 20 }} />,
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <FormControl fullWidth size="small">
        <InputLabel id="sort-select-label">Sort by</InputLabel>
        <Select
          labelId="sort-select-label"
          value={sortBy}
          label="Sort by"
          onChange={handleChange}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {option.icon}
                {option.label}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
