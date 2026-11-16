"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { cumulativeGpa, semesterGpa } from "@/lib/calc";
import { formatGpa } from "@/lib/format";
import { useAppData } from "@/lib/store";

/** Shows what the student has saved so far. Renders nothing for first-time visitors. */
export function SavedProgress() {
  const data = useAppData();
  if (data.courses.length === 0 && data.semesters.length === 0) return null;

  const semester = semesterGpa(data.courses, data.settings.gradeScale);
  const overall = cumulativeGpa(
    data.semesters,
    data.settings.includeCurrentSemester ? semester : undefined,
  );

  const stats = [
    { label: "Subjects This Semester", value: String(data.courses.length) },
    { label: "Semester GPA", value: formatGpa(semester.gpa) },
    { label: "CGPA", value: formatGpa(overall.gpa) },
  ];

  return (
    <section aria-label="Saved progress" className="card mt-10">
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
        <h2 className="text-sm font-semibold">Where You Left Off</h2>
        <Link
          href="/internal-marks"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          Continue <Icon name="arrowRight" size={15} />
        </Link>
      </div>
      <dl className="grid grid-cols-3 divide-x divide-line">
        {stats.map((stat) => (
          <div key={stat.label} className="px-5 py-4">
            <dt className="text-xs text-muted">{stat.label}</dt>
            <dd className="mt-1 font-display text-3xl tabular-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
