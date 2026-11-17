import { weightedGpa, type GpaResult } from "./calc";
import { bandForLetter, bandRanges, sortScale, type GradeBand } from "./grading";
import type { GpaCourse } from "./types";

/** One GPA page course with its grade worked out. */
export type GpaRow = {
  course: GpaCourse;
  band: GradeBand | null;
  /** Percentage range of the grade, e.g. "75-79". */
  range: string | null;
  /** Grade points × credit hours, or null without a grade. */
  qualityPoints: number | null;
  /** Middle of the grade's percentage range, for drawing a bar (B+ 75-79 → 77). */
  barPercent: number | null;
};

export type GpaPageResult = {
  rows: GpaRow[];
  gpa: GpaResult;
  /** Credit hours of every course, graded or not. */
  totalCredits: number;
  /** How many courses got each letter, best grade first; only letters that occur. */
  distribution: { band: GradeBand; count: number }[];
};

/** Semester GPA for the GPA page: grade points × credit hours ÷ credit hours, graded courses only. */
export function gpaPageResult(courses: GpaCourse[], scale: GradeBand[]): GpaPageResult {
  const ranges = bandRanges(scale);
  const sorted = sortScale(scale);
  /** Highest whole percentage a grade covers: one below the next grade up, or 100 for the top. */
  const upperOf = (band: GradeBand) => {
    const i = sorted.findIndex((b) => b.letter === band.letter);
    return i <= 0 ? 100 : sorted[i - 1].min - 1;
  };
  const rows = courses.map((course) => {
    const band = course.grade ? bandForLetter(course.grade, scale) : null;
    return {
      course,
      band,
      range: band ? ranges[band.letter] ?? null : null,
      qualityPoints: band ? band.points * course.credits : null,
      barPercent: band ? (band.min + upperOf(band)) / 2 : null,
    };
  });

  const gpa = weightedGpa(rows.map((r) => ({ credits: r.course.credits, points: r.band?.points ?? null })));
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

  const counts = new Map<string, { band: GradeBand; count: number }>();
  for (const r of rows) {
    if (!r.band) continue;
    const entry = counts.get(r.band.letter);
    if (entry) entry.count += 1;
    else counts.set(r.band.letter, { band: r.band, count: 1 });
  }
  const distribution = [...counts.values()].sort((a, b) => b.band.min - a.band.min);

  return { rows, gpa, totalCredits, distribution };
}
