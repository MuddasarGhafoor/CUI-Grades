"use client";

import { buttonClass } from "@/components/ui/button";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { CreditSelect } from "@/components/ui/credit-select";
import { MAX_LAB_CREDITS, MAX_THEORY_CREDITS } from "@/lib/assessments";
import type { CourseResult } from "@/lib/calc";
import { formatPercent } from "@/lib/format";
import { createCourseMarks, removeCourse, updateCourse } from "@/lib/store";
import type { Course } from "@/lib/types";

type SubjectHeaderProps = {
  course: Course;
  result: CourseResult;
  editing: boolean;
  onToggleEditing: () => void;
};

export function SubjectHeader({ course, result, editing, onToggleEditing }: SubjectHeaderProps) {
  const grade = result.gradeFromMarks;

  return (
    <div className="card">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:p-5">
        <div className="min-w-0 flex-1">
          <label htmlFor="subject-name" className="block text-xs font-medium text-muted">
            Subject Name
          </label>
          <input
            id="subject-name"
            autoComplete="off"
            value={course.name}
            onChange={(e) => {
              const name = e.target.value;
              updateCourse(course.id, (c) => {
                c.name = name;
              });
            }}
            onBlur={(e) => {
              if (e.target.value.trim()) return;
              updateCourse(course.id, (c) => {
                c.name = "Untitled Subject";
              });
            }}
            className="-mx-2 mt-0.5 w-[calc(100%+1rem)] rounded-lg border border-transparent bg-transparent px-2 py-1 text-xl font-semibold outline-none transition-colors hover:border-line focus:border-accent focus:bg-field"
          />
        </div>
        <div className="flex gap-3">
          <CreditSelect
            label="Theory"
            value={course.theoryCredits}
            max={MAX_THEORY_CREDITS}
            disableZero={course.labCredits === 0}
            onChange={(v) =>
              updateCourse(course.id, (c) => {
                c.theoryCredits = v;
              })
            }
          />
          <CreditSelect
            label="Lab"
            value={course.labCredits}
            max={MAX_LAB_CREDITS}
            disableZero={course.theoryCredits === 0}
            onChange={(v) =>
              updateCourse(course.id, (c) => {
                c.labCredits = v;
              })
            }
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-line bg-surface-2/40 px-4 py-2.5 sm:px-5">
        <button
          type="button"
          onClick={onToggleEditing}
          aria-pressed={editing}
          className={buttonClass(editing ? "primary" : "secondary", "sm")}
        >
          {editing ? "Done Editing" : "Edit Totals and Counts"}
        </button>
        <span className="text-sm text-muted lg:hidden">
          {result.percent === null
            ? "No Marks Yet"
            : `${result.complete ? "Result" : "So Far"}: ${formatPercent(result.percent)}${grade ? ` · ${grade.letter}` : ""}`}
        </span>
        <div className="ml-auto flex gap-1">
          <ConfirmButton
            label="Clear Marks"
            confirmLabel="Click Again to Clear"
            onConfirm={() =>
              updateCourse(course.id, (c) => {
                c.marks = createCourseMarks();
              })
            }
          />
          <ConfirmButton
            label="Delete Subject"
            confirmLabel="Click Again to Delete"
            onConfirm={() => removeCourse(course.id)}
          />
        </div>
      </div>
      {editing && (
        <p className="border-t border-line px-4 py-2.5 text-xs text-muted sm:px-5">
          Change any total, or add and remove quizzes and assignments. Press Done Editing when finished.
        </p>
      )}
    </div>
  );
}
