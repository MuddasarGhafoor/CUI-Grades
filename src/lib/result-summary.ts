import {
  cgpaTimeline,
  courseResult,
  effectiveGrade,
  semesterGpa,
  type GpaResult,
  type TimelinePoint,
} from "./calc";
import type { AppData } from "./types";

/** Everything the exported result card and print sheet show, worked out once. */

export type ResultSubject = {
  id: string;
  name: string;
  credits: number;
  /** "3+1" style. */
  creditSplit: string;
  percent: number | null;
  letter: string | null;
  points: number | null;
  manual: boolean;
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
  const scale = data.settings.gradeScale;
  const subjects = data.courses.map((course) => {
    const result = courseResult(course, scale);
    const grade = effectiveGrade(course, result, scale);
    return {
      id: course.id,
      name: course.name,
      credits: result.credits,
      creditSplit: `${course.theoryCredits}+${course.labCredits}`,
      percent: result.percent,
      letter: grade?.letter ?? null,
      points: grade?.points ?? null,
      manual: grade?.source === "manual",
    };
  });

  const semester = semesterGpa(data.courses, scale);
  const timeline = cgpaTimeline(
    data.semesters,
    data.settings.includeCurrentSemester
      ? { id: "current-semester", label: "This Semester", result: semester }
      : undefined,
  );

  return {
    subjects,
    semester,
    timeline,
    cgpa: timeline.at(-1)?.cgpa ?? null,
    cgpaCredits: timeline.reduce((sum, p) => sum + p.credits, 0),
    generatedAt: new Date(),
  };
}

export function formatResultDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
