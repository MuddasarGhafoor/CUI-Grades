/**
 * How a CUI course is assessed. Weights are percentages of that part (theory or lab).
 *   Theory: quizzes 15, assignments 10, midterm 25, final 50
 *   Lab:    lab assignments 25, lab midterm 25, lab final 50
 * Internal (sessional) marks are everything except the final, so 50 per part.
 * Default totals and counts are pre-filled so students only type what they obtained.
 */

export type Part = "theory" | "lab";
export type ListKey = "quizzes" | "assignments" | "labAssignments";
export type SingleKey = "mid" | "final" | "labMid" | "labFinal";
export type ComponentKey = ListKey | SingleKey;

type BaseDef = {
  part: Part;
  label: string;
  /** Name of one entry, used in buttons and voice feedback: "Add quiz". */
  singular: string;
  weight: number;
  defaultTotal: number;
  /** Counts toward internal (sessional) marks. Finals do not. */
  internal: boolean;
};

export type ListDef = BaseDef & { key: ListKey; kind: "list"; defaultCount: number };
export type SingleDef = BaseDef & { key: SingleKey; kind: "single" };
export type ComponentDef = ListDef | SingleDef;

export const THEORY_COMPONENTS: ComponentDef[] = [
  { key: "quizzes", kind: "list", part: "theory", label: "Quizzes", singular: "quiz", weight: 15, defaultTotal: 10, defaultCount: 4, internal: true },
  { key: "assignments", kind: "list", part: "theory", label: "Assignments", singular: "assignment", weight: 10, defaultTotal: 10, defaultCount: 4, internal: true },
  { key: "mid", kind: "single", part: "theory", label: "Midterm", singular: "midterm", weight: 25, defaultTotal: 25, internal: true },
  { key: "final", kind: "single", part: "theory", label: "Final Exam", singular: "final exam", weight: 50, defaultTotal: 50, internal: false },
];

export const LAB_COMPONENTS: ComponentDef[] = [
  { key: "labAssignments", kind: "list", part: "lab", label: "Lab Assignments", singular: "lab assignment", weight: 25, defaultTotal: 10, defaultCount: 4, internal: true },
  { key: "labMid", kind: "single", part: "lab", label: "Lab Midterm", singular: "lab midterm", weight: 25, defaultTotal: 25, internal: true },
  { key: "labFinal", kind: "single", part: "lab", label: "Lab Final", singular: "lab final", weight: 50, defaultTotal: 50, internal: false },
];

export const ALL_COMPONENTS: ComponentDef[] = [...THEORY_COMPONENTS, ...LAB_COMPONENTS];

export const COMPONENT_BY_KEY = Object.fromEntries(
  ALL_COMPONENTS.map((def) => [def.key, def]),
) as Record<ComponentKey, ComponentDef>;

export const COMPONENTS_BY_PART: Record<Part, ComponentDef[]> = {
  theory: THEORY_COMPONENTS,
  lab: LAB_COMPONENTS,
};

/**
 * Label inside a Theory or Lab card, where "Lab" would only repeat the card title:
 * "Lab Assignments" → "Assignments", "Lab Final" → "Final Exam".
 */
export function rowLabel(def: ComponentDef): string {
  if (def.part !== "lab") return def.label;
  const label = def.label.replace(/^Lab /, "");
  return label === "Final" ? "Final Exam" : label;
}

/** Same idea for one entry: "lab assignment" → "assignment", "lab final" → "final exam". */
export function rowSingular(def: ComponentDef): string {
  if (def.part !== "lab") return def.singular;
  const singular = def.singular.replace(/^lab /, "");
  return singular === "final" ? "final exam" : singular;
}

/** Lab has no quizzes. Its card still shows a greyed-out quizzes row so both cards line up. */
export const LAB_QUIZ_PLACEHOLDER = { label: "Quizzes", count: 4, total: 10 };

/** Internal marks per part are out of 50 (everything except the 50-mark final). */
export const INTERNAL_OUT_OF = 50;

export const MAX_THEORY_CREDITS = 4;
export const MAX_LAB_CREDITS = 3;
