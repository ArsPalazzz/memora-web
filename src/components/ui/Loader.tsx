import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { useEffect, useState } from "react";

const images = ["/icons/kitty.png", "/icons/kitty-tongue.png"];
const durations = [500, 250];
const maxDots = 3;

export const Loader = ({ size }: { size?: number }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
      }}
    >
      <CircularProgress size={size || 40} />
    </Box>
  );
};

export const DeskCardSkeleton = () => (
  <Card variant="outlined" sx={{ height: 153 }}>
    <CardContent>
      <Skeleton variant="text" width="65%" height={28} />
      <Skeleton variant="text" width="40%" height={20} sx={{ mt: 0.5 }} />
      <Skeleton variant="rounded" height={8} sx={{ mt: 2 }} />
      <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
        <Skeleton variant="rounded" width={56} height={22} />
        <Skeleton variant="rounded" width={56} height={22} />
      </Box>
    </CardContent>
  </Card>
);

export const DailyStreakSkeleton = () => (
  <Skeleton variant="rounded" height={100} sx={{ borderRadius: 2 }} />
);

export const CardPreviewSkeleton = () => (
  <Skeleton
    variant="rounded"
    sx={{
      flex: "0 0 44vw",
      maxWidth: 220,
      height: { xs: "44vw", md: 200 },
    }}
  />
);

export const FullPageLoader = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [dots, setDots] = useState(1);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const nextImage = () => {
      setCurrentImage((prev) => (prev + 1) % images.length);
      timeout = setTimeout(nextImage, durations[currentImage]);
    };

    timeout = setTimeout(nextImage, durations[currentImage]);

    return () => clearTimeout(timeout);
  }, [currentImage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev % maxDots) + 1);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
      }}
    >
      <Box
        component="img"
        src={images[currentImage]}
        sx={{
          width: 96,
          height: 96,
          zIndex: 1,
        }}
      />
      <Box sx={{ mt: 2, fontSize: 18, fontWeight: 500 }}>
        Loading{".".repeat(dots)}
      </Box>
    </Box>
  );
};
