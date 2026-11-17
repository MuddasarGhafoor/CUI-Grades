"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";
import { courseResult, effectiveGrade, weightedGpa } from "@/lib/calc";
import { useAppData } from "@/lib/store";
import { useIsClient } from "@/lib/use-is-client";
import { AddGradedSubject } from "./add-graded-subject";
import { GpaSummary } from "./gpa-summary";
import { SubjectRow } from "./subject-row";

/** Two sections: subjects on the left, the GPA results panel on the right. */
export function GpaApp() {
  const isClient = useIsClient();
  const data = useAppData();
  const [adding, setAdding] = useState(false);

  if (!isClient) {
    return <div aria-hidden="true" className="card h-72" />;
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
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <SectionCard
        title="Subjects"
        bodyClassName=""
        actions={
          !showForm && (
            <button type="button" onClick={() => setAdding(true)} className={buttonClass("secondary", "sm")}>
              + Add Subject
            </button>
          )
        }
      >
        {rows.length > 0 && (
          <ul className="divide-y divide-line">
            {rows.map((r) => (
              <SubjectRow key={r.course.id} course={r.course} result={r.result} grade={r.grade} scale={scale} />
            ))}
          </ul>
        )}

        {showForm && (
          <div className={`px-4 py-4 sm:px-5 ${rows.length > 0 ? "border-t border-line bg-surface-2/30" : ""}`}>
            <AddGradedSubject
              fallbackName={`Subject ${rows.length + 1}`}
              scale={scale}
              onDone={() => setAdding(false)}
              onCancel={rows.length > 0 ? () => setAdding(false) : undefined}
            />
          </div>
        )}
      </SectionCard>

      <GpaSummary
        gpa={gpa}
        totalCredits={totalCredits}
        ungraded={ungraded}
        bars={rows.map((r) => ({
          id: r.course.id,
          name: r.course.name,
          percent: r.result.percent,
          letter: r.result.gradeFromMarks?.letter ?? null,
        }))}
      />
    </div>
  );
}
