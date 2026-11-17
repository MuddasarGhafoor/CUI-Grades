import { useSyncExternalStore } from "react";
import { ALL_COMPONENTS, type ComponentDef } from "./assessments";
import { CUI_GRADE_SCALE, type GradeBand } from "./grading";
import type { AppData, Course, CourseMarks, GpaCourse, Mark, Semester, Settings } from "./types";

/**
 * All app data lives in one localStorage entry. Components read it with useAppData()
 * and change it with updateData(), which saves and re-renders every reader.
 * Other tabs stay in sync through the "storage" event.
 */

const STORAGE_KEY = "cui-grades:data";
const DATA_VERSION = 1;

/* ---------- factories ---------- */

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createMark(def: ComponentDef): Mark {
  return { obtained: "", total: String(def.defaultTotal) };
}

/** Pre-filled marks: 4 quizzes, 4 assignments and 4 lab assignments, every total already set. */
export function createCourseMarks(): CourseMarks {
  const marks = {} as Record<string, Mark | Mark[]>;
  for (const def of ALL_COMPONENTS) {
    marks[def.key] =
      def.kind === "list"
        ? Array.from({ length: def.defaultCount }, () => createMark(def))
        : createMark(def);
  }
  return marks as CourseMarks;
}

export function createCourse(name: string, theoryCredits = 3, labCredits = 0): Course {
  return {
    id: newId(),
    name,
    theoryCredits,
    labCredits,
    marks: createCourseMarks(),
    manualGrade: null,
  };
}

export const GPA_DEFAULT_COURSES = 6;
export const GPA_DEFAULT_CREDITS = 3;
export const GPA_MIN_CREDITS = 1;
export const GPA_MAX_CREDITS = 4;

export function createGpaCourse(name: string, credits = GPA_DEFAULT_CREDITS): GpaCourse {
  return { id: newId(), name, credits, grade: null };
}

/** The GPA page starts with six 3-credit courses, ready to pick grades for. */
export function defaultGpaCourses(): GpaCourse[] {
  return Array.from({ length: GPA_DEFAULT_COURSES }, (_, i) => createGpaCourse(`Course ${i + 1}`));
}

export function createSemester(label: string): Semester {
  return { id: newId(), label, gpa: "", credits: "" };
}

export function defaultSettings(): Settings {
  return {
    gradeScale: CUI_GRADE_SCALE.map((band) => ({ ...band })),
    includeCurrentSemester: true,
    voiceMode: "continuous",
    voiceLang: "en-US",
  };
}

export function defaultData(): AppData {
  return {
    version: DATA_VERSION,
    courses: [],
    activeCourseId: null,
    gpaCourses: defaultGpaCourses(),
    semesters: [],
    settings: defaultSettings(),
  };
}

/* ---------- loading saved data safely ---------- */

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const asString = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v : typeof v === "number" ? String(v) : fallback;

function normalizeMark(raw: unknown, def: ComponentDef): Mark {
  if (!isObject(raw)) return createMark(def);
  return {
    obtained: asString(raw.obtained),
    total: asString(raw.total, String(def.defaultTotal)),
  };
}

function normalizeCourse(raw: Record<string, unknown>): Course {
  const base = createCourse(asString(raw.name, "Untitled Subject"));
  const rawMarks = isObject(raw.marks) ? raw.marks : {};
  const marks = {} as Record<string, Mark | Mark[]>;
  for (const def of ALL_COMPONENTS) {
    const value = rawMarks[def.key];
    marks[def.key] =
      def.kind === "list"
        ? Array.isArray(value)
          ? value.map((m) => normalizeMark(m, def))
          : base.marks[def.key]
        : normalizeMark(value, def);
  }
  const credits = (v: unknown, fallback: number) =>
    typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : fallback;
  return {
    id: asString(raw.id) || base.id,
    name: base.name,
    theoryCredits: credits(raw.theoryCredits, 3),
    labCredits: credits(raw.labCredits, 0),
    marks: marks as CourseMarks,
    manualGrade: typeof raw.manualGrade === "string" ? raw.manualGrade : null,
  };
}

function normalizeScale(raw: unknown): GradeBand[] {
  if (!Array.isArray(raw)) return defaultSettings().gradeScale;
  const bands = raw.filter(isObject).flatMap((b) => {
    const points = Number(b.points);
    const min = Number(b.min);
    const letter = asString(b.letter).trim();
    return letter && Number.isFinite(points) && Number.isFinite(min) ? [{ letter, points, min }] : [];
  });
  return bands.length ? bands : defaultSettings().gradeScale;
}

function normalize(raw: unknown): AppData {
  const base = defaultData();
  if (!isObject(raw) || raw.version !== DATA_VERSION) return base;

  const courses = Array.isArray(raw.courses) ? raw.courses.filter(isObject).map(normalizeCourse) : [];
  const semesters = Array.isArray(raw.semesters)
    ? raw.semesters.filter(isObject).map((s) => ({
        id: asString(s.id) || newId(),
        label: asString(s.label, "Semester"),
        gpa: asString(s.gpa),
        credits: asString(s.credits),
      }))
    : [];
  const gpaCourses = Array.isArray(raw.gpaCourses)
    ? raw.gpaCourses.filter(isObject).map((g) => {
        const credits = Number(g.credits);
        return {
          id: asString(g.id) || newId(),
          name: asString(g.name, "Course"),
          credits:
            Number.isInteger(credits) && credits >= GPA_MIN_CREDITS && credits <= GPA_MAX_CREDITS
              ? credits
              : GPA_DEFAULT_CREDITS,
          grade: typeof g.grade === "string" && g.grade ? g.grade : null,
        };
      })
    : defaultGpaCourses();
  const settings: Record<string, unknown> = isObject(raw.settings) ? raw.settings : {};
  const activeId = asString(raw.activeCourseId);

  return {
    version: DATA_VERSION,
    courses,
    activeCourseId: courses.some((c) => c.id === activeId) ? activeId : (courses[0]?.id ?? null),
    gpaCourses,
    semesters,
    settings: {
      gradeScale: normalizeScale(settings.gradeScale),
      includeCurrentSemester: settings.includeCurrentSemester !== false,
      voiceMode: settings.voiceMode === "push-to-talk" ? "push-to-talk" : "continuous",
      voiceLang: asString(settings.voiceLang, base.settings.voiceLang) || base.settings.voiceLang,
    },
  };
}

/* ---------- the store ---------- */

let cache: AppData | null = null;
const listeners = new Set<() => void>();
const SERVER_SNAPSHOT = defaultData();

function load(): AppData {
  if (cache) return cache;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    cache = saved ? normalize(JSON.parse(saved)) : defaultData();
  } catch {
    cache = defaultData();
  }
  return cache;
}

function save(data: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or blocked. Data still works for this visit.
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  cache = null;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export function getData(): AppData {
  return load();
}

/** Change data with plain mutations on a copy, e.g. updateData(d => { d.courses.push(c) }). */
export function updateData(mutate: (draft: AppData) => void) {
  const draft = structuredClone(load());
  mutate(draft);
  cache = draft;
  save(draft);
  emit();
}

export function replaceData(next: unknown) {
  cache = normalize(next);
  save(cache);
  emit();
}

export function resetData() {
  replaceData(defaultData());
}

/** Read app data in a client component. Renders defaults on the server, saved data in the browser. */
export function useAppData(): AppData {
  return useSyncExternalStore(subscribe, load, () => SERVER_SNAPSHOT);
}

/* ---------- common actions ---------- */

export function addCourse(name: string, theoryCredits = 3, labCredits = 0): Course {
  const course = createCourse(name, theoryCredits, labCredits);
  updateData((d) => {
    d.courses.push(course);
    d.activeCourseId = course.id;
  });
  return course;
}

export function removeCourse(id: string) {
  updateData((d) => {
    d.courses = d.courses.filter((c) => c.id !== id);
    if (d.activeCourseId === id) d.activeCourseId = d.courses[0]?.id ?? null;
  });
}

export function setActiveCourse(id: string) {
  updateData((d) => {
    if (d.courses.some((c) => c.id === id)) d.activeCourseId = id;
  });
}

export function updateCourse(id: string, mutate: (course: Course) => void) {
  updateData((d) => {
    const course = d.courses.find((c) => c.id === id);
    if (course) mutate(course);
  });
}

/** New courses take the lowest free number: with Course 2-6 left, the next one is Course 1. */
export function addGpaCourse() {
  updateData((d) => {
    const taken = new Set(d.gpaCourses.map((c) => c.name.trim().toLowerCase()));
    let n = 1;
    while (taken.has(`course ${n}`)) n += 1;
    d.gpaCourses.push(createGpaCourse(`Course ${n}`));
  });
}

export function updateGpaCourse(id: string, mutate: (course: GpaCourse) => void) {
  updateData((d) => {
    const course = d.gpaCourses.find((c) => c.id === id);
    if (course) mutate(course);
  });
}

export function removeGpaCourse(id: string) {
  updateData((d) => {
    d.gpaCourses = d.gpaCourses.filter((c) => c.id !== id);
  });
}

export function addSemester(label: string, gpa = "", credits = ""): Semester {
  const semester = { ...createSemester(label), gpa, credits };
  updateData((d) => {
    d.semesters.push(semester);
  });
  return semester;
}

export function updateSemester(id: string, mutate: (semester: Semester) => void) {
  updateData((d) => {
    const semester = d.semesters.find((s) => s.id === id);
    if (semester) mutate(semester);
  });
}

export function removeSemester(id: string) {
  updateData((d) => {
    d.semesters = d.semesters.filter((s) => s.id !== id);
  });
}
