import { useEffect, useState } from "react";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { LanguageCode } from "@/constants/language.const";
import {
  formatSpeechText,
  isSpeechSupported,
  speakText,
  stopSpeech,
} from "@/utils/speech";

interface SpeakButtonProps {
  text: string | string[];
  language: LanguageCode;
  label?: string;
  size?: IconButtonProps["size"];
  sx?: IconButtonProps["sx"];
  disabled?: boolean;
}

export function SpeakButton({
  text,
  language,
  label = "Listen",
  size = "small",
  sx,
  disabled = false,
}: SpeakButtonProps) {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(isSpeechSupported());

    if (!isSpeechSupported()) return;

    const refreshVoices = () => {
      window.speechSynthesis.getVoices();
    };

    window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
    refreshVoices();

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", refreshVoices);
      stopSpeech();
    };
  }, []);

  if (!supported) {
    return null;
  }

  const speechText = formatSpeechText(text);
  if (!speechText) {
    return null;
  }

  return (
    <Tooltip title={label}>
      <span>
        <IconButton
          size={size}
          aria-label={label}
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            speakText(speechText, language);
          }}
          sx={{
            color: "text.secondary",
            ...sx,
          }}
        >
          <VolumeUpIcon fontSize={size === "large" ? "medium" : "small"} />
        </IconButton>
      </span>
    </Tooltip>
  );
}
