"use client";

import { useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { rowLabel, rowSingular, type ComponentDef } from "@/lib/assessments";
import { parseNumber } from "@/lib/calc";
import { titleCase } from "@/lib/format";
import { updateCourse } from "@/lib/store";
import type { Course } from "@/lib/types";

type TotalsDialogProps = {
  course: Course;
  def: ComponentDef;
  onClose: () => void;
};

const isValidTotal = (text: string) => {
  const n = parseNumber(text);
  return n !== null && n > 0 && n <= 1000;
};

/**
 * Centred pop-up to change what an assessment is marked out of.
 * Lists (quizzes, assignments) can set every total at once or one by one.
 * Only the totals change: the weight (e.g. midterm 25%) stays the same.
 */
export function TotalsDialog({ course, def, onClose }: TotalsDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const value = course.marks[def.key];
  const entries = Array.isArray(value) ? value : [value];
  const [drafts, setDrafts] = useState(() => entries.map((m) => m.total));
  const [all, setAll] = useState("");
  const singular = titleCase(rowSingular(def));
  const valid = drafts.every(isValidTotal);

  // Latest onClose without re-running the open effect on every parent render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Open as a modal once, when mounted. Esc or the backdrop closes it.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    const handleClose = () => onCloseRef.current();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  function save() {
    if (!valid) return;
    updateCourse(course.id, (c) => {
      const current = c.marks[def.key];
      if (Array.isArray(current)) {
        for (let i = 0; i < current.length; i++) current[i].total = drafts[i] ?? current[i].total;
      } else {
        current.total = drafts[0] ?? current.total;
      }
    });
    ref.current?.close();
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${def.key}-totals-title`}
      className="m-auto w-[min(26rem,calc(100%-2rem))] rounded-xl border border-line-strong bg-surface p-0 text-fg shadow-pop backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <header className="border-b border-line px-4 py-3">
          <h2 id={`${def.key}-totals-title`} className="text-sm font-semibold">
            {rowLabel(def)}: Total Marks
          </h2>
          <p className="mt-0.5 text-xs text-muted">Weight stays {def.weight}%. Only the marks it&apos;s out of change.</p>
        </header>

        <div className="space-y-3 px-4 py-4">
          {def.kind === "list" && (
            <div className="flex items-center gap-2 rounded-lg bg-surface-2/50 px-3 py-2">
              <label htmlFor={`${def.key}-all`} className="flex-1 text-[13px] font-medium">
                All {rowLabel(def)} Out Of
              </label>
              <input
                id={`${def.key}-all`}
                inputMode="decimal"
                autoComplete="off"
                placeholder="e.g. 20"
                value={all}
                onChange={(e) => {
                  const text = e.target.value;
                  setAll(text);
                  if (isValidTotal(text)) setDrafts(drafts.map(() => text));
                }}
                className="field w-24 text-center tabular-nums"
              />
            </div>
          )}

          <div className={def.kind === "list" ? "grid grid-cols-2 gap-2" : ""}>
            {drafts.map((draft, i) => {
              const id = `${def.key}-total-${i}`;
              const bad = !isValidTotal(draft);
              return (
                <div key={i} className="flex items-center justify-between gap-2">
                  <label htmlFor={id} className="text-[13px] text-muted">
                    {def.kind === "list" ? `${singular} ${i + 1}` : "Out Of"}
                  </label>
                  <input
                    id={id}
                    inputMode="decimal"
                    autoComplete="off"
                    autoFocus={def.kind === "single" && i === 0}
                    value={draft}
                    aria-invalid={bad || undefined}
                    onChange={(e) => {
                      const next = [...drafts];
                      next[i] = e.target.value;
                      setDrafts(next);
                    }}
                    className={`field w-20 text-center tabular-nums ${bad ? "border-err" : ""}`}
                  />
                </div>
              );
            })}
          </div>

          {!valid && <p className="text-xs text-err">Each total must be a number above 0.</p>}
        </div>

        <footer className="flex justify-end gap-2 border-t border-line px-4 py-3">
          <button type="button" onClick={() => ref.current?.close()} className={buttonClass("ghost")}>
            Cancel
          </button>
          <button type="submit" disabled={!valid} className={buttonClass("primary")}>
            Save
          </button>
        </footer>
      </form>
    </dialog>
  );
}
