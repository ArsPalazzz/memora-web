import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

const images = ["/icons/kitty.png", "/icons/kitty-tongue.png"];

export const Loader = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: 128,
          height: 128,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress
          size={64}
          sx={{
            position: "absolute",
          }}
        />
        <Box
          component="img"
          src={images[currentImage]}
          alt="logo"
          sx={{
            width: 64,
            height: 64,
            zIndex: 1,
          }}
        />
      </Box>
    </Box>
  );
};

export const FullPageLoader = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: 128,
          height: 128,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress
          size={64}
          sx={{
            position: "absolute",
          }}
        />
        <Box
          component="img"
          src={images[currentImage]}
          alt="logo"
          sx={{
            width: 64,
            height: 64,
            zIndex: 1,
          }}
        />
      </Box>
    </Box>
  );
};
