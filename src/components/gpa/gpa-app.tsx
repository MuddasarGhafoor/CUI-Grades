"use client";

import Link from "next/link";
import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { courseResult, effectiveGrade, weightedGpa } from "@/lib/calc";
import { useAppData } from "@/lib/store";
import { useIsClient } from "@/lib/use-is-client";
import { AddGradedSubject } from "./add-graded-subject";
import { GpaSummary } from "./gpa-summary";
import { SubjectBars } from "./subject-bars";
import { SubjectRow } from "./subject-row";

export function GpaApp() {
  const isClient = useIsClient();
  const data = useAppData();
  const [adding, setAdding] = useState(false);

  if (!isClient) {
    return <div aria-hidden="true" className="h-72 rounded-lg border border-line bg-surface" />;
  }

  const scale = data.settings.gradeScale;
  const rows = data.courses.map((course) => {
    const result = courseResult(course, scale);
    return { course, result, grade: effectiveGrade(course, result, scale) };
  });
  const gpa = weightedGpa(rows.map((r) => ({ credits: r.result.credits, points: r.grade?.points ?? null })));
  const totalCredits = rows.reduce((sum, r) => sum + r.result.credits, 0);
  const ungraded = rows.filter((r) => !r.grade).length;
  const showForm = adding || rows.length === 0;

  return (
    <div className="space-y-6">
      <GpaSummary gpa={gpa} totalCredits={totalCredits} ungraded={ungraded} />

      <section className="rounded-lg border border-line bg-surface px-4 sm:px-5">
        <header className="flex items-center justify-between gap-3 border-b border-line py-3">
          <h2 className="font-semibold">Subjects this semester</h2>
          {!showForm && (
            <button type="button" onClick={() => setAdding(true)} className={buttonClass("secondary", "sm")}>
              + Add subject
            </button>
          )}
        </header>

        {rows.length > 0 ? (
          <ul className="divide-y divide-line">
            {rows.map((r) => (
              <SubjectRow key={r.course.id} course={r.course} result={r.result} grade={r.grade} scale={scale} />
            ))}
          </ul>
        ) : (
          <p className="pt-4 text-sm text-muted">
            No subjects yet. Add them below with the grade you got, or enter marks on the{" "}
            <Link href="/internal-marks" className="text-accent hover:underline">
              Internal marks
            </Link>{" "}
            page and they will show up here.
          </p>
        )}

        {showForm && (
          <div className={`py-4 ${rows.length > 0 ? "border-t border-line" : ""}`}>
            <AddGradedSubject
              fallbackName={`Subject ${rows.length + 1}`}
              scale={scale}
              onDone={() => setAdding(false)}
              onCancel={rows.length > 0 ? () => setAdding(false) : undefined}
            />
          </div>
        )}
      </section>

      <SubjectBars
        rows={rows.map((r) => ({
          id: r.course.id,
          name: r.course.name,
          percent: r.result.percent,
          letter: r.result.gradeFromMarks?.letter ?? null,
        }))}
      />

      {gpa.gpa !== null && (
        <Link
          href="/cgpa-calculator"
          className="group flex items-center justify-between gap-4 rounded-lg border border-line px-5 py-4 transition-colors hover:border-accent"
        >
          <span>
            <span className="block font-semibold">See your CGPA</span>
            <span className="block text-sm text-muted">
              This semester is added to your past semesters automatically.
            </span>
          </span>
          <Icon name="arrowRight" size={18} className="shrink-0 text-muted group-hover:text-accent" />
        </Link>
      )}
    </div>
  );
}
