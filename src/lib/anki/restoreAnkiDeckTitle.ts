/**
 * Anki export replaces [\/?<>:*|"^] with "_" in deck names (file-safe names).
 * - Quoted text: "Authenticity" → _Authenticity_
 * - Category separator: "Category: Title" → "Category_ Title"
 */
export function restoreAnkiSanitizedDeckTitle(title: string): string {
  return title
    .replace(/_([^_]+?)_/g, '"$1"')
    .replace(/([^\s_])_ /g, "$1: ");
}
