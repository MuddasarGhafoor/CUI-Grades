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

/** Colour for a percentage: green for A range, teal for good, amber near the pass line, red below it. */
export function toneColor(percent: number | null): string {
  if (percent === null) return "var(--line-strong)";
  if (percent >= 84.5) return "var(--ok)";
  if (percent >= 69.5) return "var(--accent)";
  if (percent >= 49.5) return "var(--warn)";
  return "var(--err)";
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
