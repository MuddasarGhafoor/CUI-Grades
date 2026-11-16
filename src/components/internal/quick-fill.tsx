"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import type { ListDef } from "@/lib/assessments";
import {
  findQuickEntryProblem,
  mergeQuickEntry,
  parseQuickEntry,
  toQuickEntryText,
} from "@/lib/quick-entry";
import { updateCourse } from "@/lib/store";
import type { Course } from "@/lib/types";

type QuickFillProps = {
  course: Course;
  def: ListDef;
  onClose: () => void;
};

/** One text box that fills every entry of a list, e.g. "8 7 9 6" for four quizzes. */
export function QuickFill({ course, def, onClose }: QuickFillProps) {
  const current = course.marks[def.key];
  const [text, setText] = useState(() => toQuickEntryText(current));
  const [error, setError] = useState<string | null>(null);
  const inputId = `${course.id}-${def.key}-quick`;

  function apply() {
    const parsed = parseQuickEntry(text);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    const next = mergeQuickEntry(current, parsed.tokens, def.defaultTotal);
    const problem = findQuickEntryProblem(next, def.singular);
    if (problem) {
      setError(problem);
      return;
    }
    updateCourse(course.id, (c) => {
      c.marks[def.key] = next;
    });
    onClose();
  }

  return (
    <div className="mb-3 rounded-md border border-line bg-bg p-3">
      <label htmlFor={inputId} className="block text-xs text-muted">
        All {def.label.toLowerCase()} at once
      </label>
      <div className="mt-1 flex gap-2">
        <input
          id={inputId}
          autoFocus
          autoComplete="off"
          spellCheck={false}
          value={text}
          placeholder="e.g. 8 7 9 6"
          aria-invalid={error ? true : undefined}
          aria-describedby={`${inputId}-help`}
          onChange={(e) => {
            setText(e.target.value);
            setError(null);
          }}
          onFocus={(e) => e.currentTarget.select()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              apply();
            } else if (e.key === "Escape") {
              onClose();
            }
          }}
          className={`h-9 min-w-0 flex-1 rounded-md border bg-surface px-3 font-mono text-sm tabular-nums outline-none focus:border-accent ${
            error ? "border-err" : "border-line-strong"
          }`}
        />
        <button type="button" onClick={apply} className={buttonClass("primary")}>
          Fill
        </button>
        <button type="button" onClick={onClose} className={buttonClass("ghost")}>
          Cancel
        </button>
      </div>
      <p id={`${inputId}-help`} className={`mt-1.5 text-xs ${error ? "text-err" : "text-muted"}`}>
        {error ??
          "Separate marks with spaces. Use - to leave one empty, or 8/15 to change that total. Extra marks add new boxes."}
      </p>
    </div>
  );
}
