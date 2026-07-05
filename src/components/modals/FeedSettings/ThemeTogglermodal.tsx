import {
  Divider,
  Drawer,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import { ThemeTogglerModalProps } from "./FeedSettings.types";
import CheckIcon from "@mui/icons-material/Check";
import React from "react";
import { useThemeContext } from "@/context/ThemeContext";

const PREDEFINED_VALUES = [
  { title: "Light", key: "light" },
  { title: "Dark", key: "dark" },
];

export default function ThemeTogglerModal(props: ThemeTogglerModalProps) {
  const { onClose } = props;
  const { setMode, mode } = useThemeContext();

  return (
    <Drawer
      open={true}
      anchor="bottom"
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          p: 3,
          minHeight: "35vh",
        },
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={2}>
        Theme
      </Typography>

      <List>
        {PREDEFINED_VALUES.map((val, index) => (
          <React.Fragment key={val.key}>
            <ListItemButton
              selected={mode === val.key}
              onClick={() => {
                setMode(val.key as "light" | "dark");
              }}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                px: 2,
                py: 1,
              }}
            >
              <Typography>{val.title}</Typography>
              {mode === val.key && <CheckIcon />}
            </ListItemButton>
            {index < PREDEFINED_VALUES.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}
