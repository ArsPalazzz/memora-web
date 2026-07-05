import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import {
  addSavedAccentColor,
  DEFAULT_ACCENT_COLOR,
  loadSavedAccentColors,
  normalizeAccentColor,
  persistSavedAccentColors,
  THEME_ACCENT_STORAGE_KEY,
} from "@/theme/accentColor";

type ThemeMode = "light" | "dark";

interface ThemeContextProps {
  mode: ThemeMode;
  accentColor: string;
  savedAccentColors: string[];
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
  setAccentColor: (color: string, options?: { save?: boolean }) => void;
  removeSavedAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  mode: "light",
  accentColor: DEFAULT_ACCENT_COLOR,
  savedAccentColors: [],
  toggleTheme: () => {},
  setMode: () => {},
  setAccentColor: () => {},
  removeSavedAccentColor: () => {},
});

export const ThemeProviderClient = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>("dark");
  const [accentColor, setAccentColorState] = useState(DEFAULT_ACCENT_COLOR);
  const [savedAccentColors, setSavedAccentColors] = useState<string[]>([]);

  useEffect(() => {
    const savedMode = localStorage.getItem("theme") as ThemeMode | null;
    if (savedMode === "light" || savedMode === "dark") {
      setModeState(savedMode);
    }

    const savedAccent = localStorage.getItem(THEME_ACCENT_STORAGE_KEY);
    if (savedAccent) {
      setAccentColorState(normalizeAccentColor(savedAccent));
    }

    setSavedAccentColors(loadSavedAccentColors());
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    localStorage.setItem("theme", next);
  }, []);

  const toggleTheme = useCallback(() => {
    setMode(mode === "light" ? "dark" : "light");
  }, [mode, setMode]);

  const setAccentColor = useCallback(
    (color: string, options?: { save?: boolean }) => {
      const normalized = normalizeAccentColor(color);
      setAccentColorState(normalized);
      localStorage.setItem(THEME_ACCENT_STORAGE_KEY, normalized);

      if (options?.save) {
        setSavedAccentColors((prev) => addSavedAccentColor(prev, normalized));
      }
    },
    []
  );

  const removeSavedAccentColor = useCallback((color: string) => {
    const normalized = normalizeAccentColor(color);
    setSavedAccentColors((prev) => {
      const next = prev.filter((item) => item !== normalized);
      persistSavedAccentColors(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        accentColor,
        savedAccentColors,
        toggleTheme,
        setMode,
        setAccentColor,
        removeSavedAccentColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
