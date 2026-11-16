import { INTERNAL_OUT_OF, type Part } from "./assessments";
import { parseNumber, type CourseResult } from "./calc";
import { gradeForPercent, sortScale, type Grade, type GradeBand } from "./grading";
import type { Course } from "./types";

/**
 * "What do I need in the final?"
 *
 * Course percentage = Σ credits × (part marks out of 100) ÷ Σ credits.
 * Each final not entered yet is the unknown x (a fraction, 0 to 1) and is worth
 * credits × final weight. When both theory and lab finals are missing, the same
 * x is assumed for both, which is the simplest fair answer for one number.
 *
 * Because CUI rounds the percentage, a grade with minimum m only needs m − 0.5.
 * Internal marks not entered yet count as 0, so the answer is never too optimistic.
 */

export type UnknownFinal = { part: Part; total: number };

export type TargetStatus = "secured" | "possible" | "out-of-reach";

export type TargetRow = {
  band: GradeBand;
  status: TargetStatus;
  /** Raw marks needed in each missing final, rounded up to the next half mark. */
  needed: { part: Part; marks: number; total: number }[];
};

export type TargetResult = {
  unknownFinals: UnknownFinal[];
  /** Passing grades from best to worst. */
  rows: TargetRow[];
  /** Grade with full marks in every missing final. */
  maxGrade: Grade;
  maxPercent: number;
  missingInternal: boolean;
};

const roundUpToHalf = (n: number) => Math.ceil(n * 2 - 1e-9) / 2;

/** Returns null when there is nothing left to aim for: no parts, or every final already entered. */
export function finalTargets(course: Course, result: CourseResult, scale: GradeBand[]): TargetResult | null {
  const parts = [result.theory, result.lab].filter((p) => p !== null);
  if (parts.length === 0) return null;

  const totalCredits = parts.reduce((sum, p) => sum + p.credits, 0);
  let known = 0;
  let unknownWeight = 0;
  const unknownFinals: UnknownFinal[] = [];

  for (const p of parts) {
    const final = p.components.find((c) => !c.def.internal);
    if (!final) continue;
    known += p.credits * p.internalMarks;
    if (final.marks !== null) {
      known += p.credits * final.marks;
    } else {
      unknownWeight += p.credits * final.def.weight;
      const mark = course.marks[final.def.key];
      const total = Array.isArray(mark) ? null : parseNumber(mark.total);
      unknownFinals.push({ part: p.part, total: total && total > 0 ? total : final.def.defaultTotal });
    }
  }

  if (unknownFinals.length === 0 || unknownWeight === 0) return null;

  const rows: TargetRow[] = sortScale(scale)
    .filter((band) => band.min > 0)
    .map((band) => {
      const threshold = Math.max(0, band.min - 0.5);
      const fraction = (threshold * totalCredits - known) / unknownWeight;
      const needed = unknownFinals.map((f) => ({
        part: f.part,
        marks: roundUpToHalf(Math.max(0, fraction) * f.total),
        total: f.total,
      }));
      let status: TargetStatus = "possible";
      if (fraction <= 0) status = "secured";
      else if (needed.some((n) => n.marks > n.total)) status = "out-of-reach";
      return { band, status, needed };
    });

  const maxPercent = (known + unknownWeight) / totalCredits;

  return {
    unknownFinals,
    rows,
    maxGrade: gradeForPercent(maxPercent, scale),
    maxPercent,
    missingInternal: parts.some((p) => p.internalPossible < INTERNAL_OUT_OF),
  };
}
