import { COMPONENTS_BY_PART, type ComponentDef, type Part } from "./assessments";
import { parseNumber, readMark } from "./calc";
import { gradeForPercent, sortScale, type Grade, type GradeBand } from "./grading";
import type { Course } from "./types";

/**
 * Target grade, tracked live against the marks typed in.
 *
 * Every box of every assessment is listed. Filled boxes keep their real marks; empty boxes
 * are "still to come" and all get the same score x (0 to 1), the lowest that reaches the grade.
 *
 * Each component counts all its boxes, so four quizzes are always out of all four totals:
 *   fraction = (obtained + x × empty totals) ÷ all totals
 * Theory and lab are combined by credit hours (3+1 → 75% / 25%, 2+1 → 66.7% / 33.3%):
 *   course % = Σ credits × weight × fraction ÷ Σ credits = (known + x × open) ÷ Σ credits
 *
 * Because CUI rounds the percentage, a grade with minimum m only needs m - 0.5.
 */

export type TargetEntry = {
  /** done: a valid mark; todo: still empty; invalid: typed but not counted (e.g. above the total). */
  state: "done" | "todo" | "invalid";
  obtained: number | null;
  total: number;
};

export type TargetComponent = { def: ComponentDef; entries: TargetEntry[] };
export type TargetPart = { part: Part; credits: number; components: TargetComponent[] };

/**
 * achieved: every box is filled and this is the grade.
 * secured: reached even with 0 in every empty box.
 * possible: reachable with score x in every empty box.
 * out-of-reach: not reachable any more (or, once complete, not the grade achieved).
 */
export type TargetStatus = "achieved" | "secured" | "possible" | "out-of-reach";

export type TargetRow = {
  band: GradeBand;
  status: TargetStatus;
  /** Score needed in every empty box, 0 to 1 (can be below 0 or above 1 before clamping). */
  x: number;
};

export type TargetResult = {
  parts: TargetPart[];
  /** Passing grades from best to worst. */
  rows: TargetRow[];
  /** Number of empty boxes still to come. */
  remaining: number;
  complete: boolean;
  /** Course percentage counting empty boxes as 0. Once complete, this is the final result. */
  currentPercent: number;
  currentGrade: Grade;
  /** With full marks in every empty box. */
  maxPercent: number;
  maxGrade: Grade;
};

export const roundUpToHalf = (n: number) => Math.ceil(n * 2 - 1e-9) / 2;

/** Marks needed in one empty box of the given total for this target, rounded up to a half mark. */
export function neededMarks(row: TargetRow, total: number): number {
  return roundUpToHalf(Math.max(0, row.x) * total);
}

/** Returns null only when the subject has no credit hours at all. */
export function finalTargets(course: Course, scale: GradeBand[]): TargetResult | null {
  const credited: { part: Part; credits: number }[] = [];
  if (course.theoryCredits > 0) credited.push({ part: "theory", credits: course.theoryCredits });
  if (course.labCredits > 0) credited.push({ part: "lab", credits: course.labCredits });
  if (credited.length === 0) return null;

  const totalCredits = credited.reduce((sum, p) => sum + p.credits, 0);
  let known = 0;
  let open = 0;
  const emptyTotals: number[] = [];

  const parts: TargetPart[] = credited.map(({ part, credits }) => ({
    part,
    credits,
    components: COMPONENTS_BY_PART[part].map((def) => {
      const value = course.marks[def.key];
      const marks = Array.isArray(value) ? value : [value];
      let obtained = 0;
      let allTotals = 0;
      let emptySum = 0;

      const entries: TargetEntry[] = marks.map((mark) => {
        const parsedTotal = parseNumber(mark.total);
        const total = parsedTotal !== null && parsedTotal > 0 ? parsedTotal : def.defaultTotal;
        const read = readMark(mark);
        if (read) {
          obtained += read.obtained;
          allTotals += read.total;
          return { state: "done", obtained: read.obtained, total: read.total };
        }
        if (mark.obtained.trim() === "") {
          allTotals += total;
          emptySum += total;
          emptyTotals.push(total);
          return { state: "todo", obtained: null, total };
        }
        // A typo is left out until it is fixed, exactly like the main calculation.
        return { state: "invalid", obtained: parseNumber(mark.obtained), total };
      });

      if (allTotals > 0) {
        known += (credits * def.weight * obtained) / allTotals;
        open += (credits * def.weight * emptySum) / allTotals;
      }
      return { def, entries };
    }),
  }));

  const complete = emptyTotals.length === 0;
  const currentPercent = known / totalCredits;
  const currentGrade = gradeForPercent(currentPercent, scale);
  const maxPercent = (known + open) / totalCredits;
  const bands = sortScale(scale).filter((band) => band.min > 0);

  const rows: TargetRow[] = bands.map((band) => {
    if (complete) {
      return { band, status: band.letter === currentGrade.letter ? "achieved" : "out-of-reach", x: 0 };
    }
    const threshold = Math.max(0, band.min - 0.5);
    const x = (threshold * totalCredits - known) / open;
    let status: TargetStatus = "possible";
    if (x <= 0) status = "secured";
    else if (emptyTotals.some((total) => roundUpToHalf(x * total) > total)) status = "out-of-reach";
    return { band, status, x };
  });

  return {
    parts,
    rows,
    remaining: emptyTotals.length,
    complete,
    currentPercent,
    currentGrade,
    maxPercent,
    maxGrade: gradeForPercent(maxPercent, scale),
  };
}
