"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icons";
import { LAB_QUIZ_PLACEHOLDER, rowLabel, rowSingular, type ComponentDef } from "@/lib/assessments";
import type { ComponentResult } from "@/lib/calc";
import { formatMarks, titleCase } from "@/lib/format";
import { updateCourse } from "@/lib/store";
import type { Course } from "@/lib/types";
import { MarkField, markProblem } from "./mark-field";
import { TotalsDialog } from "./totals-dialog";

/**
 * Shared row grid, five columns on wider screens:
 *   pencil | name | mark boxes | score | weight
 * Cells carry their own padding so the dividers run the full row height.
 * Phones: pencil, name, score and weight on the first line, boxes underneath.
 */
const COLUMNS = "sm:grid-cols-[3rem_7.5rem_minmax(0,1fr)_5.5rem_4rem]";
const ROW = `grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-3 gap-y-2 border-b border-line px-4 py-2 last:border-0 sm:items-stretch sm:gap-0 sm:p-0 ${COLUMNS}`;
const CELL = "sm:row-start-1 sm:flex sm:min-h-12 sm:items-center";
const DIVIDER = "sm:border-l sm:border-line";
const EDIT = `sm:col-start-1 sm:justify-center ${CELL}`;
const NAME = `text-[13px] font-medium sm:col-start-2 sm:px-3 ${CELL} ${DIVIDER}`;
const BOXES = `col-span-4 flex flex-wrap items-center gap-1.5 sm:col-span-1 sm:col-start-3 sm:px-3 sm:py-2 ${CELL} ${DIVIDER}`;
const SCORE = `whitespace-nowrap text-right text-[13px] font-semibold tabular-nums sm:col-start-4 sm:justify-end sm:px-3 ${CELL} ${DIVIDER}`;
const WEIGHT = `text-right text-xs font-medium tabular-nums text-muted sm:col-start-5 sm:justify-end sm:pl-2 sm:pr-4 ${CELL} ${DIVIDER}`;

/** Column titles above the rows, on wider screens, lined up with the dividers. */
export function ComponentColumnsHeader() {
  const head = "py-1.5 text-[11px] font-medium text-muted";
  return (
    <div aria-hidden="true" className={`hidden border-b border-line bg-surface-2/20 sm:grid ${COLUMNS}`}>
      <span className={head} />
      <span className={`${head} px-3 ${DIVIDER}`}>Assessment</span>
      <span className={`${head} px-3 ${DIVIDER}`}>Marks</span>
      <span className={`${head} px-3 text-right ${DIVIDER}`}>Score</span>
      <span className={`${head} pl-2 pr-4 text-right ${DIVIDER}`}>Weight</span>
    </div>
  );
}

type ComponentBlockProps = {
  course: Course;
  def: ComponentDef;
  result: ComponentResult;
};

/**
 * One assessment on one row: weight, name, mark boxes (each 0 up to its own total),
 * the grading percentage earned out of the weight, and a pencil to change the totals.
 */
export function ComponentBlock({ course, def, result }: ComponentBlockProps) {
  const [editingTotals, setEditingTotals] = useState(false);
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
      <div className={EDIT}>
        <button
          type="button"
          onClick={() => setEditingTotals(true)}
          aria-label={`Change total marks for ${rowLabel(def)}`}
          title="Change total marks"
          className="grid size-8 place-items-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-fg"
        >
          <Icon name="pencil" size={15} />
        </button>
      </div>

      <p className={NAME}>{rowLabel(def)}</p>

      {/* Grading percentage earned so far. The weight it counts towards is in the last column. */}
      <p className={`${SCORE} ${result.marks === null ? "text-muted" : "text-fg"}`}>
        {result.marks === null ? "-" : `${formatMarks(result.marks)}%`}
      </p>

      <span className={WEIGHT}>{def.weight}%</span>

      <div className={BOXES}>
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

      {editingTotals && <TotalsDialog course={course} def={def} onClose={() => setEditingTotals(false)} />}
    </div>
  );
}

/** Greyed-out quizzes row in the lab card. Lab has no quizzes; this keeps both cards aligned. */
export function LabQuizPlaceholder() {
  const { label, count, total } = LAB_QUIZ_PLACEHOLDER;
  return (
    <div className={`${ROW} text-muted`} aria-disabled="true" title="Lab has no quizzes">
      <span className={EDIT} aria-hidden="true" />
      <p className={`${NAME} text-muted`}>{label}</p>
      <p className={`${SCORE} text-muted`}>-</p>
      <span className={WEIGHT}>0%</span>
      <div className={BOXES}>
        {Array.from({ length: count }, (_, i) => (
          <MarkField key={i} label={`Quiz ${i + 1}`} mark={{ obtained: "", total: String(total) }} disabled />
        ))}
      </div>
    </div>
  );
}
