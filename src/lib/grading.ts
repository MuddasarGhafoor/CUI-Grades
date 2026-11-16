/**
 * CUI grading scale for students admitted in Fall 2021 or later.
 * Source: CUI Graduate Handbook 2023, section 2.10 "Grading".
 */

export type GradeBand = {
  letter: string;
  points: number;
  /** Lowest whole-number percentage that earns this grade. */
  min: number;
};

export type Grade = GradeBand & {
  /** The percentage after CUI's rounding rule, used to pick the band. */
  roundedPercent: number;
};

export const CUI_GRADE_SCALE: GradeBand[] = [
  { letter: "A", points: 4.0, min: 85 },
  { letter: "A-", points: 3.66, min: 80 },
  { letter: "B+", points: 3.33, min: 75 },
  { letter: "B", points: 3.0, min: 71 },
  { letter: "B-", points: 2.66, min: 68 },
  { letter: "C+", points: 2.33, min: 64 },
  { letter: "C", points: 2.0, min: 61 },
  { letter: "C-", points: 1.66, min: 58 },
  { letter: "D+", points: 1.3, min: 54 },
  { letter: "D", points: 1.0, min: 50 },
  { letter: "F", points: 0.0, min: 0 },
];

/** Minimum pass for Fall 2021+ admissions is 50% (grade D). */
export const PASS_PERCENT = 50;

const FAIL_BAND: GradeBand = { letter: "F", points: 0, min: 0 };

/**
 * CUI rounds to the nearest whole number by the tenths digit:
 * 70.5 and 70.6 become 71, 70.4 becomes 70.
 * toFixed(6) first removes float noise such as 70.49999999 from 70.5.
 */
export function roundPercent(percent: number): number {
  return Math.round(Number(percent.toFixed(6)));
}

export function sortScale(scale: GradeBand[]): GradeBand[] {
  return [...scale].sort((a, b) => b.min - a.min);
}

export function gradeForPercent(percent: number, scale: GradeBand[] = CUI_GRADE_SCALE): Grade {
  const roundedPercent = roundPercent(percent);
  const sorted = sortScale(scale);
  const band = sorted.find((b) => roundedPercent >= b.min) ?? sorted.at(-1) ?? FAIL_BAND;
  return { ...band, roundedPercent };
}

export function bandForLetter(letter: string, scale: GradeBand[] = CUI_GRADE_SCALE): GradeBand | null {
  const wanted = letter.trim().toUpperCase();
  return scale.find((b) => b.letter.toUpperCase() === wanted) ?? null;
}

export function isPassingPercent(percent: number): boolean {
  return roundPercent(percent) >= PASS_PERCENT;
}
