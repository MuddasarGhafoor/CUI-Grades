"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { cumulativeGpa, semesterGpa } from "@/lib/calc";
import { formatGpa } from "@/lib/format";
import { useAppData } from "@/lib/store";

/**
 * A single compact row under the hero tagline: saved subjects, semester GPA and CGPA.
 * Renders nothing for first-time visitors, so the hero stays clean.
 */
export function SavedProgress() {
  const data = useAppData();
  if (data.courses.length === 0 && data.semesters.length === 0) return null;

  const semester = semesterGpa(data.courses, data.settings.gradeScale);
  const overall = cumulativeGpa(
    data.semesters,
    data.settings.includeCurrentSemester ? semester : undefined,
  );

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
