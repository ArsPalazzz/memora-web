import {
  DEFAULT_BACK_LANGUAGE,
  DEFAULT_FRONT_LANGUAGE,
  LanguageCode,
} from "@/constants/language.const";

const LANGUAGE_BCP47: Record<LanguageCode, string> = {
  en: "en-US",
  ru: "ru-RU",
  de: "de-DE",
  fr: "fr-FR",
  es: "es-ES",
  it: "it-IT",
  pt: "pt-PT",
  ja: "ja-JP",
  zh: "zh-CN",
  ko: "ko-KR",
  uk: "uk-UA",
  pl: "pl-PL",
};

export function languageToBcp47(language: LanguageCode): string {
  return LANGUAGE_BCP47[language] ?? LANGUAGE_BCP47.en;
}

export function normalizeLanguageCode(value?: string | null): LanguageCode {
  if (value && value in LANGUAGE_BCP47) {
    return value as LanguageCode;
  }
  return DEFAULT_FRONT_LANGUAGE;
}

export function resolveCardSpeechLanguages(
  direction: "front_to_back" | "back_to_front",
  frontLanguage?: LanguageCode | null,
  backLanguage?: LanguageCode | null
): { promptLanguage: LanguageCode; answerLanguage: LanguageCode } {
  const front = frontLanguage ?? DEFAULT_FRONT_LANGUAGE;
  const back = backLanguage ?? DEFAULT_BACK_LANGUAGE;

  if (direction === "front_to_back") {
    return { promptLanguage: front, answerLanguage: back };
  }

  return { promptLanguage: back, answerLanguage: front };
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const langPrefix = lang.split("-")[0];
  return (
    voices.find((voice) => voice.lang === lang) ??
    voices.find((voice) => voice.lang.startsWith(langPrefix)) ??
    null
  );
}

export function speakText(text: string, language: LanguageCode): boolean {
  if (!isSpeechSupported()) return false;

  const trimmed = text.trim();
  if (!trimmed) return false;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(trimmed);
  const bcp47 = languageToBcp47(language);
  utterance.lang = bcp47;
  utterance.rate = 0.95;

  const voice = pickVoice(bcp47);
  if (voice) {
    utterance.voice = voice;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeech(): void {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
}

export function formatSpeechText(text: string | string[]): string {
  return (Array.isArray(text) ? text : [text]).filter(Boolean).join(", ");
}
