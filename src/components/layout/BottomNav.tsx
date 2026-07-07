
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ROUTES } from "@/routes/paths";
import ExploreIcon from "@mui/icons-material/Explore";
import { BOTTOM_NAV_BAR_HEIGHT } from "./bottom-nav.constants";
import { BOTTOM_NAV_Z_INDEX } from "./overlay.constants";

export { BOTTOM_NAV_HEIGHT } from "./bottom-nav.constants";

function getBottomNavValue(pathname: string) {
  if (pathname.startsWith(ROUTES.FRIENDS)) {
    return ROUTES.FRIENDS;
  }

  if (pathname === ROUTES.FEED) {
    return ROUTES.FEED;
  }

  if (pathname === ROUTES.PROFILE) {
    return ROUTES.PROFILE;
  }

  if (pathname === ROUTES.HOME) {
    return ROUTES.HOME;
  }

  return false;
}

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [value, setValue] = useState<string | false>(
    getBottomNavValue(pathname) || ROUTES.HOME
  );

  useEffect(() => {
    setValue(getBottomNavValue(pathname) || false);
  }, [pathname]);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <Box
      component="nav"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: BOTTOM_NAV_Z_INDEX,
        height: BOTTOM_NAV_BAR_HEIGHT,
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
        />

        <BottomNavigationAction
          label="Friends"
          value={ROUTES.FRIENDS}
          icon={<PeopleIcon />}
        />

        <BottomNavigationAction
          label="Profile"
          value={ROUTES.PROFILE}
          icon={<PersonIcon />}
        />
      </BottomNavigation>
    </Box>
  );
}
