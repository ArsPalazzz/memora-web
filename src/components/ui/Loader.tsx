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
  <Card variant="outlined" sx={{ height: "153px" }}>
    <CardContent>
      <Skeleton variant="text" width="55%" height={28} />
      <Skeleton variant="text" width="85%" sx={{ mt: 1 }} />
      <Skeleton variant="rounded" height={8} sx={{ mt: 2.5 }} />
      <Skeleton variant="text" width="75%" sx={{ mt: 1 }} />
    </CardContent>
  </Card>
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
