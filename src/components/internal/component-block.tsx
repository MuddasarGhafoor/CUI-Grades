"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import type { ComponentDef } from "@/lib/assessments";
import type { ComponentResult } from "@/lib/calc";
import { capitalize, formatMarks } from "@/lib/format";
import { createMark, updateCourse } from "@/lib/store";
import type { Course, Mark } from "@/lib/types";
import { MarkField } from "./mark-field";
import { QuickFill } from "./quick-fill";

type ComponentBlockProps = {
  course: Course;
  def: ComponentDef;
  result: ComponentResult;
  editing: boolean;
};

/** One assessment, e.g. Quizzes: a row of mark boxes plus its weighted score. */
export function ComponentBlock({ course, def, result, editing }: ComponentBlockProps) {
  const [quickOpen, setQuickOpen] = useState(false);
  const value = course.marks[def.key];
  const entries = Array.isArray(value) ? value : [value];

  function setField(index: number, field: keyof Mark, text: string) {
    updateCourse(course.id, (c) => {
      const current = c.marks[def.key];
      const target = Array.isArray(current) ? current[index] : current;
      if (target) target[field] = text;
    });
  }

  function addEntry() {
    updateCourse(course.id, (c) => {
      const list = c.marks[def.key];
      if (!Array.isArray(list)) return;
      // A new entry copies the last total, so a teacher's "out of 15" carries over.
      const last = list.at(-1);
      list.push(last ? { obtained: "", total: last.total } : createMark(def));
    });
  }

  function removeLast() {
    updateCourse(course.id, (c) => {
      const list = c.marks[def.key];
      if (Array.isArray(list) && list.length > 1) list.pop();
    });
  }

  return (
    <section className="border-b border-line py-4 last:border-0">
      <header className="mb-2.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-sm font-semibold">
          {def.label}
          <span className="ml-2 font-normal text-muted">{def.weight}%</span>
        </h3>
        <div className="flex items-baseline gap-3">
          {def.kind === "list" && !quickOpen && (
            <button
              type="button"
              onClick={() => setQuickOpen(true)}
              className="text-xs font-medium text-accent hover:underline"
            >
              Type all at once
            </button>
          )}
          <p className="text-sm tabular-nums text-muted">
            <span className="font-semibold text-fg">{formatMarks(result.marks)}</span> / {def.weight}
          </p>
        </div>
      </header>

      {def.kind === "list" && quickOpen && (
        <QuickFill course={course} def={def} onClose={() => setQuickOpen(false)} />
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {entries.map((mark, i) => (
          <MarkField
            key={i}
            id={`${course.id}-${def.key}-${i}`}
            label={def.kind === "list" ? `${capitalize(def.singular)} ${i + 1}` : capitalize(def.singular)}
            mark={mark}
            editingTotal={editing}
            onChange={(field, text) => setField(i, field, text)}
          />
        ))}
      </div>

      {editing && def.kind === "list" && (
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={addEntry} className={buttonClass("secondary", "sm")}>
            + Add {def.singular}
          </button>
          <button
            type="button"
            onClick={removeLast}
            disabled={entries.length <= 1}
            className={buttonClass("ghost", "sm")}
          >
            Remove last
          </button>
        </div>
      )}
    </section>
  );
}
