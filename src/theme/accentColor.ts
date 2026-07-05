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

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const parsed = parseColorInput(hex);
  if (!parsed) {
    return null;
  }

  const value = parsed.slice(1);
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((channel) =>
      Math.max(0, Math.min(255, Math.round(channel)))
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;
}

export function rgbToHsv(
  r: number,
  g: number,
  b: number
): { h: number; s: number; v: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rn) {
      h = 60 * (((gn - bn) / delta) % 6);
    } else if (max === gn) {
      h = 60 * ((bn - rn) / delta + 2);
    } else {
      h = 60 * ((rn - gn) / delta + 4);
    }
  }
  if (h < 0) {
    h += 360;
  }

  const s = max === 0 ? 0 : (delta / max) * 100;
  const v = max * 100;

  return { h, s, v };
}

export function hsvToRgb(
  h: number,
  s: number,
  v: number
): { r: number; g: number; b: number } {
  const saturation = Math.max(0, Math.min(100, s)) / 100;
  const value = Math.max(0, Math.min(100, v)) / 100;
  const chroma = value * saturation;
  const huePrime = (h % 360) / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
  const m = value - chroma;

  let rp = 0;
  let gp = 0;
  let bp = 0;

  if (huePrime >= 0 && huePrime < 1) {
    rp = chroma;
    gp = x;
  } else if (huePrime < 2) {
    rp = x;
    gp = chroma;
  } else if (huePrime < 3) {
    gp = chroma;
    bp = x;
  } else if (huePrime < 4) {
    gp = x;
    bp = chroma;
  } else if (huePrime < 5) {
    rp = x;
    bp = chroma;
  } else {
    rp = chroma;
    bp = x;
  }

  return {
    r: (rp + m) * 255,
    g: (gp + m) * 255,
    b: (bp + m) * 255,
  };
}

export function hexToHsv(hex: string): { h: number; s: number; v: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return null;
  }
  return rgbToHsv(rgb.r, rgb.g, rgb.b);
}

export function hsvToHex(h: number, s: number, v: number): string {
  const rgb = hsvToRgb(h, s, v);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
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
