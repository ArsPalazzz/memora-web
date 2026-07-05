/**
 * Anki export replaces [\/?<>:*|"^] with "_" in deck names (file-safe names).
 * The common "Category: Title" pattern becomes "Category_ Title".
 */
export function restoreAnkiSanitizedDeckTitle(title: string): string {
  return title.replace(/([^\s_])_ /g, "$1: ");
}
