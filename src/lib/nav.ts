export type NavItem = {
  href: string;
  /** Navbar label on wider screens. */
  label: string;
  /** Navbar label in the narrow mobile row. */
  shortLabel: string;
  /** Full name, used on the home page. */
  title: string;
  description: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/internal-marks",
    label: "Internal marks",
    shortLabel: "Internal",
    title: "Internal marks calculator",
    description: "Quizzes, assignments and midterms for each subject, theory and lab.",
  },
  {
    href: "/gpa-calculator",
    label: "GPA",
    shortLabel: "GPA",
    title: "GPA calculator",
    description: "Semester GPA from your internal marks, or from grades you already know.",
  },
  {
    href: "/cgpa-calculator",
    label: "CGPA",
    shortLabel: "CGPA",
    title: "CGPA calculator",
    description: "Overall CGPA across all your semesters so far.",
  },
];
