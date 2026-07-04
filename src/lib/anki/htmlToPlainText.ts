export function htmlToPlainText(html: string): string {
  if (!html) return "";

  const withoutExtensions = html.replace(
    /<div[^>]*id="simple-translate"[\s\S]*$/i,
    ""
  );

  const doc = new DOMParser().parseFromString(
    `<div>${withoutExtensions}</div>`,
    "text/html"
  );

  const text = doc.body.textContent ?? "";

  return text
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function splitBackVariants(backText: string): string[] {
  const trimmed = backText.trim();
  if (!trimmed) return [];

  if (!trimmed.includes(",")) {
    return [trimmed];
  }

  return trimmed
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function parseAnkiTagsToFolderPath(tags: string): string[] {
  if (!tags.trim()) return [];

  return tags
    .split("::")
    .map((segment) => segment.trim())
    .filter(Boolean);
}
