"use client";

import { ConfirmButton } from "@/components/ui/confirm-button";
import { CreditSelect } from "@/components/ui/credit-select";
import { MAX_LAB_CREDITS, MAX_THEORY_CREDITS } from "@/lib/assessments";
import { formatCredits } from "@/lib/format";
import { createCourseMarks, removeCourse, updateCourse } from "@/lib/store";
import type { Course } from "@/lib/types";

/** Share of the course, to one decimal and without trailing zeros: 3 of 4 → 75, 2 of 3 → 66.7. */
const sharePercent = (credits: number, total: number) => (total > 0 ? Number(((credits / total) * 100).toFixed(1)) : 0);

/** One compact row: subject name, theory and lab credits, total, weight split, then Clear and Delete. */
export function SubjectHeader({ course }: { course: Course }) {
  const totalCredits = course.theoryCredits + course.labCredits;

  return (
    <div className="card flex flex-wrap items-end gap-x-3 gap-y-3 p-3">
      <div className="min-w-48 flex-1">
        <label htmlFor="subject-name" className="mb-1 block text-xs font-medium text-muted">
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
          className="field w-full font-semibold"
        />
      </div>

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

      {/* Worked out from the two dropdowns, so it is read-only. */}
      <div className="w-28">
        <span className="mb-1 block text-xs font-medium text-muted">Total</span>
        <output
          aria-label="Total credit hours"
          className="flex h-8 items-center rounded-lg border border-line bg-surface-2/50 px-3 text-[13px] font-semibold tabular-nums"
        >
          {formatCredits(totalCredits)}
        </output>
      </div>

      {/* How much theory and lab count, from their credit hours: 3+1 → 75% / 25%. */}
      <div>
        <span className="mb-1 block text-xs font-medium text-muted">Weight</span>
        <output
          aria-label="Theory and lab weight"
          className="flex h-8 items-center gap-2 rounded-lg border border-line bg-surface-2/50 px-3 text-[13px] font-semibold tabular-nums"
        >
          {course.theoryCredits > 0 && <span className="text-tone-blue">Theory {sharePercent(course.theoryCredits, totalCredits)}%</span>}
          {course.theoryCredits > 0 && course.labCredits > 0 && <span className="text-muted">·</span>}
          {course.labCredits > 0 && <span className="text-tone-violet">Lab {sharePercent(course.labCredits, totalCredits)}%</span>}
        </output>
      </div>

      {/* A divider sets the two side actions apart from the subject details. They stack vertically. */}
      <span aria-hidden="true" className="hidden w-px self-stretch bg-line-strong sm:block" />

      <div className="flex flex-col items-stretch gap-0.5 self-center">
        <ConfirmButton
          label="Clear Marks"
          confirmLabel="Clear?"
          variant="quiet"
          onConfirm={() =>
            updateCourse(course.id, (c) => {
              c.marks = createCourseMarks();
            })
          }
        />
        <ConfirmButton
          label="Delete Subject"
          confirmLabel="Delete?"
          variant="quiet-danger"
          onConfirm={() => removeCourse(course.id)}
        />
      </div>
    </div>
  );
}
