import { Box, Typography, TypographyProps } from "@mui/material";
import { LanguageCode } from "@/constants/language.const";
import { SpeakButton } from "@/components/ui/SpeakButton";

interface CardPromptWithSpeakProps {
  text: string[];
  language: LanguageCode;
  variant?: TypographyProps["variant"];
  fontWeight?: TypographyProps["fontWeight"];
}

export function CardPromptWithSpeak({
  text,
  language,
  variant = "h4",
  fontWeight = 600,
}: CardPromptWithSpeakProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.5,
        maxWidth: "100%",
      }}
    >
      <Typography variant={variant} fontWeight={fontWeight}>
        {text.join(", ")}
      </Typography>
      <SpeakButton text={text} language={language} size="medium" />
    </Box>
  );
}
