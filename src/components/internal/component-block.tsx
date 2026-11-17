"use client";

import { LAB_QUIZ_PLACEHOLDER, rowLabel, rowSingular, type ComponentDef } from "@/lib/assessments";
import type { ComponentResult } from "@/lib/calc";
import { formatMarks, titleCase } from "@/lib/format";
import { updateCourse } from "@/lib/store";
import type { Course } from "@/lib/types";
import { MarkField, markProblem } from "./mark-field";

/** Shared row grid: name and weight, mark boxes, score. Boxes drop below the name on phones. */
const ROW =
  "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 border-b border-line px-4 py-2.5 last:border-0 sm:grid-cols-[7.5rem_minmax(0,1fr)_4rem]";

type ComponentBlockProps = {
  course: Course;
  def: ComponentDef;
  result: ComponentResult;
};

/** One assessment on one compact row: name and weight, small mark boxes, weighted score. */
export function ComponentBlock({ course, def, result }: ComponentBlockProps) {
  const value = course.marks[def.key];
  const entries = Array.isArray(value) ? value : [value];
  const firstError = entries.map(markProblem).find(Boolean);
  const singular = titleCase(rowSingular(def));

  function setObtained(index: number, text: string) {
    updateCourse(course.id, (c) => {
      const current = c.marks[def.key];
      const target = Array.isArray(current) ? current[index] : current;
      if (target) target.obtained = text;
    });
  }

  return (
    <div className={ROW}>
      <p className="text-[13px] font-medium">
        {rowLabel(def)}
        <span className="ml-1.5 text-xs font-normal text-muted">{def.weight}%</span>
      </p>

      <p className="text-right text-[13px] tabular-nums text-muted sm:order-last">
        <span className="font-semibold text-fg">{formatMarks(result.marks)}</span>/{def.weight}
      </p>

      <div className="col-span-2 flex flex-wrap items-center gap-1.5 sm:col-span-1">
        {entries.map((mark, i) => (
          <MarkField
            key={i}
            id={`${course.id}-${def.key}-${i}`}
            label={def.kind === "list" ? `${singular} ${i + 1}` : singular}
            mark={mark}
            onChange={(text) => setObtained(i, text)}
          />
        ))}
        {firstError && <span className="text-xs text-err">{firstError}</span>}
      </div>
    </div>
  );
}

/** Greyed-out quizzes row in the lab card. Lab has no quizzes; this keeps both cards aligned. */
export function LabQuizPlaceholder() {
  const { label, count, total } = LAB_QUIZ_PLACEHOLDER;
  return (
    <div className={ROW} aria-disabled="true" title="Lab has no quizzes">
      <p className="text-[13px] font-medium text-muted">
        {label}
        <span className="ml-1.5 text-xs font-normal">0%</span>
      </p>
      <p className="text-right text-[13px] text-muted sm:order-last">-</p>
      <div className="col-span-2 flex flex-wrap items-center gap-1.5 sm:col-span-1">
        {Array.from({ length: count }, (_, i) => (
          <MarkField key={i} label={`Quiz ${i + 1}`} mark={{ obtained: "", total: String(total) }} disabled />
        ))}
      </div>
    </div>
  );
}
