export type NavItem = {
  href: string;
  /** Navbar label on wider screens. */
  label: string;
  /** Navbar label in the narrow mobile row. */
  shortLabel: string;
  /** Full name, used on the home page cards. */
  title: string;
  description: string;
  /** Short points shown on the home page card. */
  highlights: string[];
};

export const CALCULATORS: NavItem[] = [
  {
    href: "/internal-marks",
    label: "Internal Marks",
    shortLabel: "Internal",
    title: "Internal Marks Calculator",
    description: "Quizzes, assignments and midterms for each subject, theory and lab.",
    highlights: ["Totals already filled in", "Type 8 7 9 6 to fill all quizzes", "What you need in the final"],
  },
  {
    href: "/gpa-calculator",
    label: "GPA Calculator",
    shortLabel: "GPA",
    title: "GPA Calculator",
    description: "Semester GPA from your internal marks, or from grades you already know.",
    highlights: ["Grades straight from your marks", "Pick any grade by hand", "Compare subjects at a glance"],
  },
  {
    href: "/cgpa-calculator",
    label: "CGPA Calculator",
    shortLabel: "CGPA",
    title: "CGPA Calculator",
    description: "Overall CGPA across all your semesters so far.",
    highlights: ["This semester added on its own", "Running CGPA after each semester", "Trend chart over time"],
  },
];

export const GUIDE: NavItem = {
  href: "/guide",
  label: "Guide",
  shortLabel: "Guide",
  title: "Guide",
  description: "The CUI grade scale, how marks are weighted, and every voice command.",
  highlights: [],
};

/** Everything in the navbar, in order. */
export const NAV_ITEMS: NavItem[] = [...CALCULATORS, GUIDE];
