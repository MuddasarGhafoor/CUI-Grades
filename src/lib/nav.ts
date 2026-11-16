import type { Tone } from "./tones";

export type NavItem = {
  href: string;
  /** Colour of this area: navbar underline, page header mark, hero word and card. */
  tone: Tone;
  /** Navbar label on wider screens. */
  label: string;
  /** Navbar label in the narrow mobile row. */
  shortLabel: string;
  /** Short name shown large in the home page hero. */
  name: string;
  /** Full name, used on the home page cards. */
  title: string;
  description: string;
};

/** The three main pages, shown in the middle of the navbar. */
export const CALCULATORS: NavItem[] = [
  {
    href: "/internal-marks",
    tone: "teal",
    label: "Internal Marks",
    shortLabel: "Internal",
    name: "Marks",
    title: "Internal Marks Calculator",
    description: "Quizzes, assignments and midterms for each subject, theory and lab.",
  },
  {
    href: "/gpa-calculator",
    tone: "blue",
    label: "GPA Calculator",
    shortLabel: "GPA",
    name: "GPA",
    title: "GPA Calculator",
    description: "Semester GPA from your internal marks, or from grades you already know.",
  },
  {
    href: "/cgpa-calculator",
    tone: "violet",
    label: "CGPA Calculator",
    shortLabel: "CGPA",
    name: "CGPA",
    title: "CGPA Calculator",
    description: "Overall CGPA across all your semesters so far.",
  },
];

/** Shown as an icon button on the right of the navbar. */
export const GUIDE: NavItem = {
  href: "/guide",
  tone: "amber",
  label: "Guide",
  shortLabel: "Guide",
  name: "Guide",
  title: "Guide",
  description: "The CUI grade scale, how marks are weighted, and every voice command.",
};
