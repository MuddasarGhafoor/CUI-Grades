"use client";

import { Icon } from "@/components/ui/icons";
import { Select } from "@/components/ui/select";
import { bandRanges, sortScale, type GradeBand } from "@/lib/grading";
import { GPA_MAX_CREDITS, GPA_MIN_CREDITS, removeGpaCourse, updateGpaCourse } from "@/lib/store";
import type { GpaCourse } from "@/lib/types";

/** Columns shared by the header and every row: name (capped) | grade | credit hours | remove. */
export const GPA_COLUMNS = "sm:grid-cols-[minmax(0,1fr)_16rem_8rem_3rem]";
const CELL = "sm:flex sm:min-h-12 sm:items-center sm:px-3";
const DIVIDER = "sm:border-l sm:border-line";

/** Grade dropdown columns: GPA | Grade | Percentage. */
const GRADE_GRID = "grid-cols-[2.75rem_2.5rem_1fr]";

/** Top grade reads "85%+", the rest "80-84%", and F "Below 50%". */
export function rangeText(range: string): string {
  if (range.endsWith("-100")) return `${range.replace("-100", "")}%+`;
  return `${range}%`;
}

export function GpaColumnsHeader() {
  const head = "py-1.5 text-[11px] font-medium text-muted";
  return (
    <div aria-hidden="true" className={`hidden border-b border-line bg-surface-2/20 sm:grid ${GPA_COLUMNS}`}>
      <span className={`${head} pl-4 pr-3`}>Course</span>
      {/* Three titles lined up with the dropdown's own columns (its padding, then the grid, then the arrow). */}
      <span className={`${head} px-3 ${DIVIDER}`}>
        <span className={`grid gap-3 pl-3 pr-[2.2rem] ${GRADE_GRID}`}>
          <span>GPA</span>
          <span>Grade</span>
          <span>Percentage</span>
        </span>
      </span>
      <span className={`${head} px-3 ${DIVIDER}`}>Credit Hours</span>
      <span className={`${head} ${DIVIDER}`} />
    </div>
  );
}

type GpaCourseRowProps = {
  course: GpaCourse;
  scale: GradeBand[];
};

/** One course: editable name, a grade dropdown (GPA, grade, percentage), credit hours, and remove. */
export function GpaCourseRow({ course, scale }: GpaCourseRowProps) {
  const ranges = bandRanges(scale);
  const bands = sortScale(scale);
  const selected = bands.find((b) => b.letter === course.grade) ?? null;

  const removeButton = (
    <button
      type="button"
      onClick={() => removeGpaCourse(course.id)}
      aria-label={`Remove ${course.name}`}
      title="Remove course"
      className="grid size-8 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-err/10 hover:text-err"
    >
      <Icon name="close" size={15} />
    </button>
  );

  return (
    <div
      className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-line px-4 py-2.5 last:border-0 sm:gap-0 sm:p-0 ${GPA_COLUMNS}`}
    >
      <div className={`${CELL} sm:pl-4`}>
        <input
          aria-label="Course name"
          autoComplete="off"
          value={course.name}
          onChange={(e) => {
            const name = e.target.value;
            updateGpaCourse(course.id, (c) => {
              c.name = name;
            });
          }}
          onBlur={(e) => {
            if (e.target.value.trim()) return;
            updateGpaCourse(course.id, (c) => {
              c.name = "Untitled Course";
            });
          }}
          className="field w-full font-medium"
        />
      </div>

      {/* Phones only: remove sits beside the name. */}
      <div className="sm:hidden">{removeButton}</div>

      <div className={`col-span-2 sm:col-span-1 ${CELL} ${DIVIDER}`}>
        <Select
          ariaLabel={`Grade for ${course.name}`}
          className="w-full"
          checkSide="left"
          optionGrid={GRADE_GRID}
          menuColumns={["GPA", "Grade", "Percentage"]}
          value={course.grade ?? ""}
          onChange={(letter) =>
            updateGpaCourse(course.id, (c) => {
              c.grade = letter || null;
            })
          }
          display={
            selected ? (
              <span className={`grid items-center gap-3 tabular-nums ${GRADE_GRID}`}>
                <span className="font-semibold">{selected.points.toFixed(2)}</span>
                <span className="font-semibold">{selected.letter}</span>
                <span className="text-muted">{rangeText(ranges[selected.letter])}</span>
              </span>
            ) : (
              <span className="text-muted">N/A</span>
            )
          }
          options={[
            { value: "", label: "N/A" },
            ...bands.map((b) => ({
              value: b.letter,
              label: b.letter,
              columns: [b.points.toFixed(2), b.letter, rangeText(ranges[b.letter])],
            })),
          ]}
        />
      </div>

      <div className={`col-span-2 sm:col-span-1 ${CELL} ${DIVIDER}`}>
        <Select
          ariaLabel={`Credit hours for ${course.name}`}
          className="w-full"
          value={course.credits}
          onChange={(credits) =>
            updateGpaCourse(course.id, (c) => {
              c.credits = credits;
            })
          }
          options={Array.from({ length: GPA_MAX_CREDITS - GPA_MIN_CREDITS + 1 }, (_, i) => {
            const n = GPA_MIN_CREDITS + i;
            return { value: n, label: `${n} ${n === 1 ? "Credit" : "Credits"}` };
          })}
        />
      </div>

      <div className={`hidden justify-center sm:flex sm:min-h-12 sm:items-center ${DIVIDER}`}>{removeButton}</div>
    </div>
  );
}
