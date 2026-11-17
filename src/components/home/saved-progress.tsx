"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { cumulativeGpa } from "@/lib/calc";
import { formatGpa } from "@/lib/format";
import { gpaPageResult } from "@/lib/gpa";
import { useAppData } from "@/lib/store";

/**
 * A single compact row under the hero tagline: Internal Marks subjects, the GPA page's
 * semester GPA, and the CGPA page's CGPA. Each page keeps its own data.
 * Renders nothing for first-time visitors, so the hero stays clean.
 */
export function SavedProgress() {
  const data = useAppData();
  const hasGpaGrades = data.gpaCourses.some((c) => c.grade);
  if (data.courses.length === 0 && data.semesters.length === 0 && !hasGpaGrades) return null;

  const semester = gpaPageResult(data.gpaCourses, data.settings.gradeScale).gpa;
  const overall = cumulativeGpa(data.semesters);

  const stats = [
    { label: "Subjects", value: String(data.courses.length), tone: "text-tone-teal" },
    { label: "Semester GPA", value: formatGpa(semester.gpa), tone: "text-tone-blue" },
    { label: "CGPA", value: formatGpa(overall.gpa), tone: "text-tone-violet" },
  ];

  return (
    <section aria-label="Saved progress" className="mt-6 flex max-w-xl flex-col items-start gap-3 border-t border-line pt-5">
      <dl className="flex divide-x divide-line">
        {stats.map((stat) => (
          <div key={stat.label} className="px-4 first:pl-0">
            <dt className="text-xs text-muted">{stat.label}</dt>
            <dd className={`font-display text-2xl leading-tight tabular-nums ${stat.tone}`}>{stat.value}</dd>
          </div>
        ))}
      </dl>
      <Link
        href="/internal-marks"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-fg"
      >
        Continue Where You Left Off <Icon name="arrowRight" size={15} />
      </Link>
    </section>
  );
}
