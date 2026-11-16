import type { IconName } from "@/components/ui/icons";

export type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: IconName;
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Home",
    description: "Overview of all calculators",
    icon: "home",
  },
  {
    href: "/internal-marks",
    label: "Internal marks",
    description: "Quizzes, assignments and mids for each subject",
    icon: "clipboard",
  },
  {
    href: "/gpa-calculator",
    label: "GPA calculator",
    description: "Semester GPA from your subjects",
    icon: "calculator",
  },
  {
    href: "/cgpa-calculator",
    label: "CGPA calculator",
    description: "Overall CGPA across semesters",
    icon: "trend",
  },
];
