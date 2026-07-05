import {
  darken,
  getContrastRatio,
  lighten,
} from "@mui/material/styles";

export const DEFAULT_ACCENT_COLOR = "#5961d3";

export const ACCENT_PRESETS = [
  { name: "Purple", value: "#5961d3" },
  { name: "Blue", value: "#1e88e5" },
  { name: "Teal", value: "#00897b" },
  { name: "Green", value: "#43a047" },
  { name: "Orange", value: "#fb8c00" },
  { name: "Red", value: "#e53935" },
  { name: "Pink", value: "#d81b60" },
  { name: "Indigo", value: "#3949ab" },
  { name: "Cyan", value: "#00acc1" },
  { name: "Amber", value: "#ffb300" },
] as const;

export const MAX_SAVED_ACCENT_COLORS = 12;

export const THEME_ACCENT_STORAGE_KEY = "theme-accent";
export const THEME_ACCENT_SAVED_STORAGE_KEY = "theme-accent-saved";

export function parseColorInput(input: string): string | null {
  const trimmed = input.trim();

  const hexMatch = trimmed.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }
    return `#${hex.toLowerCase()}`;
  }

  const rgbMatch = trimmed.match(
    /^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i
  );
  if (rgbMatch) {
    const r = Number(rgbMatch[1]);
    const g = Number(rgbMatch[2]);
    const b = Number(rgbMatch[3]);
    if ([r, g, b].some((value) => value < 0 || value > 255)) {
      return null;
    }
    return `#${[r, g, b]
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("")}`;
  }

  return null;
}

export function normalizeAccentColor(color: string): string {
  return parseColorInput(color) ?? DEFAULT_ACCENT_COLOR;
}

export function getContrastText(background: string): string {
  const whiteContrast = getContrastRatio(background, "#ffffff");
  const blackContrast = getContrastRatio(background, "#000000");
  return whiteContrast >= blackContrast ? "#ffffff" : "#000000";
}

export function buildPrimaryPalette(
  accentColor: string,
  mode: "light" | "dark"
) {
  const main = normalizeAccentColor(accentColor);

  return {
    main,
    light: lighten(main, mode === "light" ? 0.24 : 0.16),
    dark: darken(main, mode === "light" ? 0.18 : 0.12),
    contrastText: getContrastText(main),
  };
}

export function loadSavedAccentColors(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(THEME_ACCENT_SAVED_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((value): value is string => typeof value === "string")
      .map(normalizeAccentColor)
      .filter(
        (value, index, array) => array.indexOf(value) === index
      )
      .slice(0, MAX_SAVED_ACCENT_COLORS);
  } catch {
    return [];
  }
}

export function persistSavedAccentColors(colors: string[]) {
  localStorage.setItem(
    THEME_ACCENT_SAVED_STORAGE_KEY,
    JSON.stringify(colors.slice(0, MAX_SAVED_ACCENT_COLORS))
  );
}

export function addSavedAccentColor(
  colors: string[],
  color: string
): string[] {
  const normalized = normalizeAccentColor(color);
  const next = [
    normalized,
    ...colors.filter((item) => item !== normalized),
  ].slice(0, MAX_SAVED_ACCENT_COLORS);

  persistSavedAccentColors(next);
  return next;
}
