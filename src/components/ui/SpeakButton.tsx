import { useEffect, useRef, useState, type MouseEvent } from "react";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import { LanguageCode } from "@/constants/language.const";
import {
  formatSpeechText,
  isSpeechSupported,
  speakText,
  stopSpeech,
} from "@/utils/speech";

type SpeakButtonVariant = "default" | "compact";

interface SpeakButtonProps {
  text: string | string[];
  language: LanguageCode;
  label?: string;
  variant?: SpeakButtonVariant;
  size?: IconButtonProps["size"];
  sx?: IconButtonProps["sx"];
  disabled?: boolean;
}

const VARIANT_SX: Record<
  SpeakButtonVariant,
  { box: number; icon: "small" | "medium" }
> = {
  default: { box: 48, icon: "medium" },
  compact: { box: 40, icon: "small" },
};

export function SpeakButton({
  text,
  language,
  label = "Listen",
  variant = "default",
  size,
  sx,
  disabled = false,
}: SpeakButtonProps) {
  const [supported, setSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const dimensions = VARIANT_SX[variant];

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

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      utteranceRef.current = null;
      return;
    }

    const utterance = speakText(speechText, language);
    if (!utterance) return;

    utteranceRef.current = utterance;
    setIsSpeaking(true);

    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
  };

  return (
    <Tooltip title={isSpeaking ? "Stop" : label}>
      <span>
        <IconButton
          size={size ?? (variant === "compact" ? "small" : "medium")}
          aria-label={label}
          aria-pressed={isSpeaking}
          disabled={disabled}
          onClick={handleClick}
          sx={{
            flexShrink: 0,
            width: dimensions.box,
            height: dimensions.box,
            borderRadius: 2.5,
            border: "1px solid",
            borderColor: isSpeaking ? "primary.main" : "divider",
            bgcolor: isSpeaking ? "primary.main" : "action.hover",
            color: isSpeaking ? "primary.contrastText" : "text.secondary",
            boxShadow: isSpeaking ? 2 : 0,
            transition:
              "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease",
            animation: isSpeaking ? "speakPulse 1.2s ease-in-out infinite" : "none",
            "@keyframes speakPulse": {
              "0%, 100%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.05)" },
            },
            "&:hover": {
              bgcolor: isSpeaking ? "primary.dark" : "action.selected",
              borderColor: isSpeaking ? "primary.dark" : "primary.light",
              color: isSpeaking ? "primary.contrastText" : "primary.main",
              transform: "scale(1.04)",
            },
            "&:active": {
              transform: "scale(0.96)",
            },
            ...sx,
          }}
        >
          <VolumeUpRoundedIcon fontSize={dimensions.icon} />
        </IconButton>
      </span>
    </Tooltip>
  );
}
