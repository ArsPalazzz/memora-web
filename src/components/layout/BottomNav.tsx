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
        height: "calc(56px + 20px + env(safe-area-inset-bottom, 0px))",
        zIndex: 1300,
        transition: "padding-bottom 0.3s ease",
        display: "flex",
        flexDirection: "column",
        padding: 0,
      }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        sx={{
          height: 56,
          flexShrink: 0,
          padding: 0,
          backgroundColor: "background.paper",
        }}
      >
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

      <div
        style={{
          flex: 1,
          backgroundColor: "inherit",
        }}
      />
    </Paper>
  );
}
