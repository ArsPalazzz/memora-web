
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ROUTES } from "@/routes/paths";
import ExploreIcon from "@mui/icons-material/Explore";
import {
  BOTTOM_NAV_BAR_HEIGHT,
  BOTTOM_NAV_HEIGHT,
} from "./bottom-nav.constants";

export { BOTTOM_NAV_HEIGHT };

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [value, setValue] = useState(pathname || ROUTES.HOME);

  useEffect(() => {
    setValue(pathname || ROUTES.HOME);
  }, [pathname]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    navigate(newValue);
  };

  const handleFeedClick = () => {
    navigate(ROUTES.FEED);
  };

  return (
    <Box
      component="nav"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        sx={{
          height: BOTTOM_NAV_BAR_HEIGHT,
          padding: 0,
          bgcolor: "background.paper",
        }}
      >
        <BottomNavigationAction
          label="Home"
          value={ROUTES.HOME}
          icon={<HomeIcon />}
        />

        <BottomNavigationAction
          label="Discover"
          value={ROUTES.FEED}
          icon={<ExploreIcon />}
          onClick={handleFeedClick}
        />

        <BottomNavigationAction
          label="Profile"
          value={ROUTES.PROFILE}
          icon={<PersonIcon />}
        />
      </BottomNavigation>

      <Box
        aria-hidden
        sx={{
          height: "env(safe-area-inset-bottom, 0px)",
          bgcolor: "background.paper",
        }}
      />
    </Box>
  );
}
