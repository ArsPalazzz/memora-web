import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

const images = ["/icons/kitty.png", "/icons/kitty-tongue.png"];
const durations = [500, 250];

export const Loader = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const nextImage = () => {
      setCurrentImage((prev) => (prev + 1) % images.length);
      timeout = setTimeout(nextImage, durations[currentImage]);
    };

    timeout = setTimeout(nextImage, durations[currentImage]);

    return () => clearTimeout(timeout);
  }, [currentImage]);

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
        {/* <CircularProgress
          size={64}
          sx={{
            position: "absolute",
          }}
        /> */}
        <Box
          component="img"
          src={images[currentImage]}
          alt="logo"
          sx={{
            width: 128,
            height: 128,
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
    let timeout: NodeJS.Timeout;

    const nextImage = () => {
      setCurrentImage((prev) => (prev + 1) % images.length);
      timeout = setTimeout(nextImage, durations[currentImage]);
    };

    timeout = setTimeout(nextImage, durations[currentImage]);

    return () => clearTimeout(timeout);
  }, [currentImage]);

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
        {/* <CircularProgress
          size={64}
          sx={{
            position: "absolute",
          }}
        /> */}
        <Box
          component="img"
          src={images[currentImage]}
          alt="logo"
          sx={{
            width: 128,
            height: 128,
            zIndex: 1,
          }}
        />
      </Box>
    </Box>
  );
};
