export const SUPPORTED_LANGUAGES = [
  "en",
  "ru",
  "de",
  "fr",
  "es",
  "it",
  "pt",
  "ja",
  "zh",
  "ko",
  "uk",
  "pl",
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: "English",
  ru: "Russian",
  de: "German",
  fr: "French",
  es: "Spanish",
  it: "Italian",
  pt: "Portuguese",
  ja: "Japanese",
  zh: "Chinese",
  ko: "Korean",
  uk: "Ukrainian",
  pl: "Polish",
};

export const DEFAULT_FRONT_LANGUAGE: LanguageCode = "en";
export const DEFAULT_BACK_LANGUAGE: LanguageCode = "ru";
export const DEFAULT_EXAMPLE_LANGUAGE: LanguageCode = "en";

export const DEFAULT_DESK_LANGUAGE_SETTINGS = {
  front_language: DEFAULT_FRONT_LANGUAGE,
  back_language: DEFAULT_BACK_LANGUAGE,
  example_language: DEFAULT_EXAMPLE_LANGUAGE,
} as const;

export function formatLanguagePair(
  frontLanguage: LanguageCode,
  backLanguage: LanguageCode
): string {
  return `${LANGUAGE_LABELS[frontLanguage]} → ${LANGUAGE_LABELS[backLanguage]}`;
}
