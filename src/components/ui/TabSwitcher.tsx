import { Box, Tabs, Tab } from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import FolderIcon from "@mui/icons-material/Folder";

interface TabsSwitcherProps {
  activeTab: number;
  onChange: (value: number) => void;
}

export const TabsSwitcher = ({ activeTab, onChange }: TabsSwitcherProps) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
      <Tabs
        value={activeTab}
        onChange={(_, value) => onChange(value)}
        variant="fullWidth"
        centered
      >
        <Tab
          icon={<GridViewIcon />}
          label="Desks"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            minHeight: 48,
          }}
          iconPosition="start"
        />
        <Tab
          icon={<FolderIcon />}
          label="Folders"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            minHeight: 48,
          }}
          iconPosition="start"
        />
      </Tabs>
    </Box>
  );
};
