const DASH = "–";

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
  return `${credits} credit${credits === 1 ? "" : "s"}`;
}
