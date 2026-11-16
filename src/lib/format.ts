const DASH = "-";

/** GPA and CGPA to two decimals, as on CUI results: 3.4567 → "3.46". */
export function formatGpa(value: number | null): string {
  return value === null ? DASH : value.toFixed(2);
}

export function formatPercent(value: number | null, digits = 1): string {
  return value === null ? DASH : `${value.toFixed(digits)}%`;
}

/** Marks without trailing zeros: 12 → "12", 12.5 → "12.5", 12.3333 → "12.33". */
export function formatMarks(value: number | null): string {
  return value === null ? DASH : String(Number(value.toFixed(2)));
}

export function formatCredits(credits: number): string {
  return `${credits} Credit${credits === 1 ? "" : "s"}`;
}

/**
 * Colour for a percentage, matching the grade colours: A range green, B range blue,
 * C range amber, D and F rose. Thresholds sit half a mark below each band, like CUI rounding.
 */
export function toneColor(percent: number | null): string {
  if (percent === null) return "var(--line-strong)";
  if (percent >= 79.5) return "var(--tone-green)";
  if (percent >= 67.5) return "var(--tone-blue)";
  if (percent >= 57.5) return "var(--tone-amber)";
  return "var(--tone-rose)";
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const SMALL_WORDS = new Set(["a", "an", "and", "at", "by", "for", "in", "of", "on", "or", "the", "to"]);

/** "lab assignment" → "Lab Assignment". Small joining words stay lower case except at the start. */
export function titleCase(text: string): string {
  return text
    .split(" ")
    .map((word, i) => (i > 0 && SMALL_WORDS.has(word) ? word : capitalize(word)))
    .join(" ");
}
