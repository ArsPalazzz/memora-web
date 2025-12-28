"use client";

import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ROUTES } from "@/routes/next";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(pathname || ROUTES.HOME);

  useEffect(() => {
    setValue(pathname || ROUTES.HOME);
  }, [pathname]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    router.push(newValue);
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 56,
        zIndex: 1300,
        pb: 20,
      }}
      elevation={3}
    >
      <BottomNavigation value={value} onChange={handleChange}>
        <BottomNavigationAction
          label="Home"
          value={ROUTES.HOME}
          icon={<HomeIcon />}
        />
        <BottomNavigationAction
          label="Profile"
          value={ROUTES.PROFILE}
          icon={<PersonIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}
