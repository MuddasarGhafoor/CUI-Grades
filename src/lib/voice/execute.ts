import { COMPONENT_BY_KEY, MAX_LAB_CREDITS, MAX_THEORY_CREDITS } from "../assessments";
import { parseNumber } from "../calc";
import { formatMarks, titleCase } from "../format";
import { bandForLetter } from "../grading";
import { findQuickEntryProblem, mergeQuickEntry, parseQuickEntry } from "../quick-entry";
import {
  addCourse,
  addSemester,
  getData,
  replaceData,
  setActiveCourse,
  updateCourse,
} from "../store";
import type { AppData, Course } from "../types";
import { parseVoiceCommand, type VoiceCommand } from "./parse";

export type VoiceOutcome = {
  ok: boolean;
  message: string;
  /** Page to open, for navigation commands. */
  navigate?: string;
  help?: boolean;
  stop?: boolean;
};

const done = (message: string, extra: Partial<VoiceOutcome> = {}): VoiceOutcome => ({ ok: true, message, ...extra });
const fail = (message: string): VoiceOutcome => ({ ok: false, message });

/* ---------- undo ---------- */

type UndoEntry = { before: AppData; afterJson: string; label: string };
const undoStack: UndoEntry[] = [];
const MAX_UNDO = 30;

/** Runs a data-changing command and remembers the state before it, so "undo" can restore it. */
function tracked(label: string, run: () => VoiceOutcome): VoiceOutcome {
  const before = getData();
  const outcome = run();
  const after = getData();
  if (outcome.ok && after !== before) {
    undoStack.push({ before, afterJson: JSON.stringify(after), label });
    if (undoStack.length > MAX_UNDO) undoStack.shift();
  }
  return outcome;
}

export function undoLastVoiceCommand(): VoiceOutcome {
  const entry = undoStack.pop();
  if (!entry) return fail("Nothing to undo.");
  // Never throw away edits typed by hand after the command.
  if (JSON.stringify(getData()) !== entry.afterJson) {
    undoStack.length = 0;
    return fail("You've changed things since that command, so it can't be undone safely.");
  }
  replaceData(entry.before);
  return done(`Undid: ${entry.label}`);
}

/* ---------- helpers ---------- */

function activeCourse(data: AppData): Course | null {
  return data.courses.find((c) => c.id === data.activeCourseId) ?? data.courses[0] ?? null;
}

const NO_SUBJECT = 'Add a subject first. Say "new subject Database Systems".';

/** Best match for a spoken subject name: exact, then contains, then shared words. */
function findCourse(courses: Course[], query: string): Course | null {
  const q = query.toLowerCase().trim();
  const words = q.split(" ").filter((w) => w.length > 2);
  let best: Course | null = null;
  let bestScore = 0;
  for (const course of courses) {
    const name = course.name.toLowerCase();
    let score = 0;
    if (name === q) score = 100;
    else if (name.includes(q) || q.includes(name)) score = 50;
    else for (const w of words) if (name.includes(w)) score += 10;
    if (score > bestScore) {
      bestScore = score;
      best = course;
    }
  }
  return best;
}

/* ---------- each command ---------- */

function runMark(cmd: Extract<VoiceCommand, { type: "mark" }>): VoiceOutcome {
  const course = activeCourse(getData());
  if (!course) return fail(NO_SUBJECT);
  const def = COMPONENT_BY_KEY[cmd.key];
  if (def.part === "lab" && course.labCredits === 0) {
    return fail(`${course.name} has no lab. Say "credits 3 plus 1" to add one.`);
  }
  if (def.part === "theory" && course.theoryCredits === 0) return fail(`${course.name} has no theory part.`);

  if (def.kind === "list") {
    const list = course.marks[def.key];
    let index = cmd.index === null ? list.findIndex((m) => m.obtained.trim() === "") : cmd.index - 1;
    if (index === -1) index = list.length;
    const lastTotal = list.at(-1)?.total ?? String(def.defaultTotal);
    const total = cmd.total ?? parseNumber(list[index]?.total ?? lastTotal) ?? def.defaultTotal;
    if (!(total > 0)) return fail("The total must be above 0.");
    if (cmd.obtained > total) return fail(`${formatMarks(cmd.obtained)} is more than ${formatMarks(total)}. Check the total.`);

    const label = `${titleCase(def.singular)} ${index + 1} in ${course.name}: ${formatMarks(cmd.obtained)} / ${formatMarks(total)}`;
    return tracked(label, () => {
      updateCourse(course.id, (c) => {
        const marks = c.marks[def.key];
        while (marks.length <= index) marks.push({ obtained: "", total: lastTotal });
        marks[index].obtained = String(cmd.obtained);
        if (cmd.total !== null) marks[index].total = String(cmd.total);
      });
      return done(label);
    });
  }

  const current = course.marks[def.key];
  const total = cmd.total ?? parseNumber(current.total) ?? def.defaultTotal;
  if (!(total > 0)) return fail("The total must be above 0.");
  if (cmd.obtained > total) return fail(`${formatMarks(cmd.obtained)} is more than ${formatMarks(total)}. Check the total.`);
  const label = `${titleCase(def.singular)} in ${course.name}: ${formatMarks(cmd.obtained)} / ${formatMarks(total)}`;
  return tracked(label, () => {
    updateCourse(course.id, (c) => {
      c.marks[def.key].obtained = String(cmd.obtained);
      if (cmd.total !== null) c.marks[def.key].total = String(cmd.total);
    });
    return done(label);
  });
}

function runBulk(cmd: Extract<VoiceCommand, { type: "bulk" }>): VoiceOutcome {
  const course = activeCourse(getData());
  if (!course) return fail(NO_SUBJECT);
  const def = COMPONENT_BY_KEY[cmd.key];
  if (def.kind !== "list") return fail("That one only has a single mark.");
  if (def.part === "lab" && course.labCredits === 0) return fail(`${course.name} has no lab.`);

  const parsed = parseQuickEntry(cmd.text);
  if (!parsed.ok) return fail(parsed.error);
  const next = mergeQuickEntry(course.marks[def.key], parsed.tokens, def.defaultTotal);
  const problem = findQuickEntryProblem(next, def.singular);
  if (problem) return fail(problem);

  const label = `${def.label} in ${course.name}: ${cmd.text}`;
  return tracked(label, () => {
    updateCourse(course.id, (c) => {
      c.marks[def.key] = next;
    });
    return done(label);
  });
}

function run(cmd: VoiceCommand): VoiceOutcome {
  const data = getData();
  switch (cmd.type) {
    case "undo":
      return undoLastVoiceCommand();
    case "help":
      return done("Here's what you can say.", { help: true });
    case "stop":
      return done("Stopped listening.", { stop: true });
    case "navigate":
      return done(`Opening ${cmd.label}.`, { navigate: cmd.href });

    case "add-subject":
      return tracked(`Added ${cmd.name}`, () => {
        addCourse(cmd.name, 3, 0);
        return done(`Added ${cmd.name} with 3 theory credits. Say "credits 3 plus 1" if it has a lab.`);
      });

    case "switch-subject": {
      const course = findCourse(data.courses, cmd.query);
      if (!course) return fail(`No subject matches "${cmd.query}".`);
      setActiveCourse(course.id);
      return done(`Switched to ${course.name}.`);
    }

    case "step-subject": {
      if (data.courses.length === 0) return fail(NO_SUBJECT);
      const current = activeCourse(data);
      const i = data.courses.findIndex((c) => c.id === current?.id);
      const next = data.courses[(i + cmd.direction + data.courses.length) % data.courses.length];
      setActiveCourse(next.id);
      return done(`Switched to ${next.name}.`);
    }

    case "credits": {
      const course = activeCourse(data);
      if (!course) return fail(NO_SUBJECT);
      if (cmd.theory > MAX_THEORY_CREDITS) return fail(`Theory credits go up to ${MAX_THEORY_CREDITS}.`);
      if (cmd.lab > MAX_LAB_CREDITS) return fail(`Lab credits go up to ${MAX_LAB_CREDITS}.`);
      if (cmd.theory + cmd.lab === 0) return fail("A subject needs at least 1 credit hour.");
      const label = `${course.name}: ${cmd.theory}+${cmd.lab} credits`;
      return tracked(label, () => {
        updateCourse(course.id, (c) => {
          c.theoryCredits = cmd.theory;
          c.labCredits = cmd.lab;
        });
        return done(label);
      });
    }

    case "mark":
      return runMark(cmd);
    case "bulk":
      return runBulk(cmd);

    case "grade": {
      const course = activeCourse(data);
      if (!course) return fail(NO_SUBJECT);
      if (cmd.letter !== null && !bandForLetter(cmd.letter, data.settings.gradeScale)) {
        return fail(`${cmd.letter} isn't on the grade scale.`);
      }
      const label =
        cmd.letter === null ? `${course.name}: grade from marks` : `${course.name}: grade ${cmd.letter}`;
      return tracked(label, () => {
        updateCourse(course.id, (c) => {
          c.manualGrade = cmd.letter;
        });
        return done(label);
      });
    }

    case "semester": {
      const label = `Semester ${data.semesters.length + 1}: GPA ${cmd.gpa.toFixed(2)}, ${formatMarks(cmd.credits)} credits`;
      return tracked(label, () => {
        addSemester(`Semester ${data.semesters.length + 1}`, String(cmd.gpa), String(cmd.credits));
        return done(`Added ${label}.`);
      });
    }
  }
}

/** Parse and run one sentence. Always returns a message to show the user. */
export function runVoiceCommand(text: string): VoiceOutcome {
  const parsed = parseVoiceCommand(text);
  if (!parsed.ok) return fail(parsed.error);
  return run(parsed.command);
}
