import { Box } from "@mui/material";

type CardImageSize = "study" | "thumb";

interface CardImageProps {
  url?: string | null;
  size?: CardImageSize;
  alt?: string;
}

export function CardImage({ url, size = "study", alt = "Card image" }: CardImageProps) {
  if (!url) {
    return null;
  }

  const isThumb = size === "thumb";

  return (
    <Box
      component="img"
      src={url}
      alt={alt}
      sx={{
        display: "block",
        mx: "auto",
        maxWidth: isThumb ? 48 : "100%",
        maxHeight: isThumb ? 48 : 220,
        width: isThumb ? 48 : "auto",
        height: isThumb ? 48 : "auto",
        objectFit: "contain",
        borderRadius: 1,
      }}
    />
  );
}
