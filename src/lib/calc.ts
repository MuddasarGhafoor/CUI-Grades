import {
  LAB_COMPONENTS,
  THEORY_COMPONENTS,
  type ComponentDef,
  type Part,
} from "./assessments";
import { bandForLetter, gradeForPercent, type GradeBand } from "./grading";
import type { Course, Mark, Semester } from "./types";

/* ---------- reading inputs ---------- */

export function parseNumber(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

export type ReadMark = { obtained: number; total: number };

/** A mark counts only when both numbers are valid and obtained is between 0 and the total. */
export function readMark(mark: Mark): ReadMark | null {
  const obtained = parseNumber(mark.obtained);
  const total = parseNumber(mark.total);
  if (obtained === null || total === null) return null;
  if (total <= 0 || obtained < 0 || obtained > total) return null;
  return { obtained, total };
}

export type MarkState = "empty" | "valid" | "invalid";

export function markState(mark: Mark): MarkState {
  if (mark.obtained.trim() === "") return "empty";
  return readMark(mark) ? "valid" : "invalid";
}

/* ---------- one component (quizzes, midterm, ...) ---------- */

export type ComponentResult = {
  def: ComponentDef;
  /** Raw marks added up across entries, e.g. 31 out of 40 for four quizzes. */
  obtained: number;
  total: number;
  /** How many entries have a valid mark. */
  entered: number;
  fraction: number | null;
  /** Weighted marks, out of def.weight. */
  marks: number | null;
};

/**
 * List components add raw marks before dividing (31/40), matching the prototype.
 * With equal totals this is the same as averaging percentages.
 */
export function componentResult(def: ComponentDef, value: Mark | Mark[]): ComponentResult {
  const entries = Array.isArray(value) ? value : [value];
  let obtained = 0;
  let total = 0;
  let entered = 0;
  for (const entry of entries) {
    const mark = readMark(entry);
    if (!mark) continue;
    obtained += mark.obtained;
    total += mark.total;
    entered += 1;
  }
  const fraction = total > 0 ? obtained / total : null;
  return {
    def,
    obtained,
    total,
    entered,
    fraction,
    marks: fraction === null ? null : fraction * def.weight,
  };
}

/* ---------- theory or lab part ---------- */

export type PartResult = {
  part: Part;
  credits: number;
  components: ComponentResult[];
  /** Weighted internal marks earned, and the most that could be earned from what is entered. */
  internalMarks: number;
  internalPossible: number;
  /** Same, counting the final too. Out of 100 once everything is entered. */
  marks: number;
  possible: number;
  /** Percentage on what is entered so far. Equals the real percentage once complete. */
  percent: number | null;
  complete: boolean;
};

function partResult(part: Part, defs: ComponentDef[], course: Course, credits: number): PartResult {
  const components = defs.map((def) => componentResult(def, course.marks[def.key]));
  let internalMarks = 0;
  let internalPossible = 0;
  let marks = 0;
  let possible = 0;
  for (const c of components) {
    if (c.marks === null) continue;
    marks += c.marks;
    possible += c.def.weight;
    if (c.def.internal) {
      internalMarks += c.marks;
      internalPossible += c.def.weight;
    }
  }
  return {
    part,
    credits,
    components,
    internalMarks,
    internalPossible,
    marks,
    possible,
    percent: possible > 0 ? (marks / possible) * 100 : null,
    complete: possible === 100,
  };
}

/* ---------- whole course ---------- */

export type CourseResult = {
  theory: PartResult | null;
  lab: PartResult | null;
  credits: number;
  /** Theory and lab percentages combined by credit hours. */
  percent: number | null;
  gradeFromMarks: ReturnType<typeof gradeForPercent> | null;
  /** 0 to 1: how much of the course's marks have been entered, weighted by credits. */
  coverage: number;
  complete: boolean;
};

export function courseResult(course: Course, scale: GradeBand[]): CourseResult {
  const theory =
    course.theoryCredits > 0
      ? partResult("theory", THEORY_COMPONENTS, course, course.theoryCredits)
      : null;
  const lab =
    course.labCredits > 0 ? partResult("lab", LAB_COMPONENTS, course, course.labCredits) : null;
  const parts = [theory, lab].filter((p): p is PartResult => p !== null);

  const credits = parts.reduce((sum, p) => sum + p.credits, 0);
  let weighted = 0;
  let weight = 0;
  let covered = 0;
  for (const p of parts) {
    covered += (p.possible / 100) * p.credits;
    if (p.percent === null) continue;
    weighted += p.percent * p.credits;
    weight += p.credits;
  }
  const percent = weight > 0 ? weighted / weight : null;

  return {
    theory,
    lab,
    credits,
    percent,
    gradeFromMarks: percent === null ? null : gradeForPercent(percent, scale),
    coverage: credits > 0 ? covered / credits : 0,
    complete: parts.length > 0 && parts.every((p) => p.complete),
  };
}

/** The grade the GPA page uses: a typed letter wins over the grade from marks. */
export function effectiveGrade(
  course: Course,
  result: CourseResult,
  scale: GradeBand[],
): { letter: string; points: number; source: "manual" | "marks" } | null {
  if (course.manualGrade) {
    const band = bandForLetter(course.manualGrade, scale);
    if (band) return { letter: band.letter, points: band.points, source: "manual" };
  }
  if (result.gradeFromMarks) {
    return {
      letter: result.gradeFromMarks.letter,
      points: result.gradeFromMarks.points,
      source: "marks",
    };
  }
  return null;
}

/* ---------- GPA and CGPA ---------- */

export type GpaInput = { credits: number; points: number | null };
export type GpaResult = { gpa: number | null; credits: number; qualityPoints: number };

/** Credit-weighted average of grade points. Items without points are skipped. */
export function weightedGpa(items: GpaInput[]): GpaResult {
  let qualityPoints = 0;
  let credits = 0;
  for (const item of items) {
    if (item.points === null || !(item.credits > 0)) continue;
    qualityPoints += item.points * item.credits;
    credits += item.credits;
  }
  return { gpa: credits > 0 ? qualityPoints / credits : null, credits, qualityPoints };
}

export function semesterGpa(courses: Course[], scale: GradeBand[]): GpaResult {
  return weightedGpa(
    courses.map((course) => {
      const result = courseResult(course, scale);
      const grade = effectiveGrade(course, result, scale);
      return { credits: result.credits, points: grade?.points ?? null };
    }),
  );
}

/** Reads a semester row from the CGPA page. Rows with a bad GPA or credits are skipped. */
export function readSemester(semester: Semester): GpaInput {
  const gpa = parseNumber(semester.gpa);
  const credits = parseNumber(semester.credits);
  const valid = gpa !== null && gpa >= 0 && gpa <= 4 && credits !== null && credits > 0;
  return valid ? { credits, points: gpa } : { credits: 0, points: null };
}

/** CGPA = all quality points / all credit hours, across past semesters plus the current one. */
export function cumulativeGpa(semesters: Semester[], current?: GpaResult): GpaResult {
  const items = semesters.map(readSemester);
  if (current && current.gpa !== null) items.push({ credits: current.credits, points: current.gpa });
  return weightedGpa(items);
}
