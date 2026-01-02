import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

const images = ["/icons/kitty.png", "/icons/kitty-tongue.png"];
const durations = [500, 250];
const maxDots = 3;

export const Loader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

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
