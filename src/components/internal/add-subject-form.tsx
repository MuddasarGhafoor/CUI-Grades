"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { CreditSelect } from "@/components/ui/credit-select";
import { MAX_LAB_CREDITS, MAX_THEORY_CREDITS } from "@/lib/assessments";
import { addCourse } from "@/lib/store";

type AddSubjectFormProps = {
  /** Used when the name box is left empty, e.g. "Subject 3". */
  fallbackName: string;
  onDone: () => void;
  onCancel?: () => void;
};

export function AddSubjectForm({ fallbackName, onDone, onCancel }: AddSubjectFormProps) {
  const [name, setName] = useState("");
  const [theory, setTheory] = useState(3);
  const [lab, setLab] = useState(0);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    addCourse(name.trim() || fallbackName, theory, lab);
    onDone();
  }

  return (
    <form
      onSubmit={submit}
      onKeyDown={(e) => e.key === "Escape" && onCancel?.()}
      className="rounded-lg border border-line bg-surface p-4 sm:p-5"
    >
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end">
        <div>
          <label htmlFor="new-subject-name" className="block text-xs text-muted">
            Subject name
          </label>
          <input
            id="new-subject-name"
            autoFocus
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`e.g. Database Systems`}
            className="mt-1 h-9 w-full rounded-md border border-line-strong bg-bg px-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <div className="flex gap-3">
          <CreditSelect
            id="new-subject-theory"
            label="Theory"
            value={theory}
            max={MAX_THEORY_CREDITS}
            disableZero={lab === 0}
            onChange={setTheory}
          />
          <CreditSelect
            id="new-subject-lab"
            label="Lab"
            value={lab}
            max={MAX_LAB_CREDITS}
            disableZero={theory === 0}
            onChange={setLab}
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className={buttonClass("primary")}>
            Add subject
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className={buttonClass("ghost")}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
