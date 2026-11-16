import type { ListKey, SingleKey } from "./assessments";
import type { GradeBand } from "./grading";

/** Kept as strings so inputs can hold partial text like "" or "7." while typing. */
export type Mark = {
  obtained: string;
  total: string;
};

export type CourseMarks = Record<ListKey, Mark[]> & Record<SingleKey, Mark>;

export type Course = {
  id: string;
  name: string;
  theoryCredits: number;
  labCredits: number;
  marks: CourseMarks;
  /** Letter grade typed on the GPA page. When set, it replaces the grade from marks. */
  manualGrade: string | null;
};

/** A finished semester on the CGPA page. */
export type Semester = {
  id: string;
  label: string;
  gpa: string;
  credits: string;
};

export type VoiceMode = "continuous" | "push-to-talk";

export type Settings = {
  gradeScale: GradeBand[];
  /** Count the GPA page's semester in the CGPA. */
  includeCurrentSemester: boolean;
  voiceMode: VoiceMode;
  voiceLang: string;
};

export type AppData = {
  version: 1;
  courses: Course[];
  activeCourseId: string | null;
  semesters: Semester[];
  settings: Settings;
};
