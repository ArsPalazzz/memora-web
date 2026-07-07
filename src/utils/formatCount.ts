/** Compact number for social proof (e.g. 1200 → "1.2k"). */
export function formatCount(value: number): string {
  if (value < 1000) {
    return String(value);
  }

  if (value < 1_000_000) {
    const compact = value / 1000;
    const formatted = compact >= 10 ? Math.round(compact).toString() : compact.toFixed(1);
    return `${formatted.replace(/\.0$/, "")}k`;
  }

  const compact = value / 1_000_000;
  const formatted = compact >= 10 ? Math.round(compact).toString() : compact.toFixed(1);
  return `${formatted.replace(/\.0$/, "")}M`;
}
