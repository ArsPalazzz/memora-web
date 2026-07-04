function decodeHtmlEntities(value: string): string {
  if (!value.includes("&")) return value;

  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function stripHtmlTags(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|tr|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
}

export function htmlToPlainText(html: string): string {
  if (!html) return "";

  const withoutExtensions = html
    .replace(/<div[^>]*id="simple-translate"[\s\S]*$/i, "")
    .trim();

  const decoded = decodeHtmlEntities(withoutExtensions);
  const doc = new DOMParser().parseFromString(
    `<div>${decoded}</div>`,
    "text/html"
  );

  let text = doc.body.textContent ?? "";

  if (/<[a-z][\s\S]*?>/i.test(text)) {
    text = stripHtmlTags(text);
  }

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
