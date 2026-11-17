import { cgpaTimeline, type GpaResult, type TimelinePoint } from "./calc";
import { gpaPageResult } from "./gpa";
import type { AppData } from "./types";

/**
 * Everything the exported result card and print sheet show, worked out once.
 * Courses and the semester GPA come from the GPA page; the CGPA from the CGPA page's semesters.
 */

export type ResultSubject = {
  id: string;
  name: string;
  credits: number;
  /** Percentage range of the grade, e.g. "75-79", or null without a grade. */
  range: string | null;
  letter: string | null;
  points: number | null;
};

export type ResultSummary = {
  subjects: ResultSubject[];
  semester: GpaResult;
  timeline: TimelinePoint[];
  cgpa: number | null;
  cgpaCredits: number;
  generatedAt: Date;
};

export function buildResultSummary(data: AppData): ResultSummary {
  const page = gpaPageResult(data.gpaCourses, data.settings.gradeScale);
  const subjects = page.rows.map(({ course, band, range }) => ({
    id: course.id,
    name: course.name,
    credits: course.credits,
    range,
    letter: band?.letter ?? null,
    points: band?.points ?? null,
  }));

  // The GPA page is kept separate from the CGPA page, so the CGPA uses its own semesters only.
  const timeline = cgpaTimeline(data.semesters);

  return {
    subjects,
    semester: page.gpa,
    timeline,
    cgpa: timeline.at(-1)?.cgpa ?? null,
    cgpaCredits: timeline.reduce((sum, p) => sum + p.credits, 0),
    generatedAt: new Date(),
  };
}

export function formatResultDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
