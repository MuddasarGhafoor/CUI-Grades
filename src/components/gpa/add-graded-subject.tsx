"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { CreditSelect } from "@/components/ui/credit-select";
import { MAX_LAB_CREDITS, MAX_THEORY_CREDITS } from "@/lib/assessments";
import type { GradeBand } from "@/lib/grading";
import { addCourse, updateCourse } from "@/lib/store";
import { GradeSelect } from "./grade-select";

type AddGradedSubjectProps = {
  fallbackName: string;
  scale: GradeBand[];
  onDone: () => void;
  onCancel?: () => void;
};

/** Add a subject by grade alone, for students who already know their result. */
export function AddGradedSubject({ fallbackName, scale, onDone, onCancel }: AddGradedSubjectProps) {
  const [name, setName] = useState("");
  const [theory, setTheory] = useState(3);
  const [lab, setLab] = useState(0);
  const [grade, setGrade] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const course = addCourse(name.trim() || fallbackName, theory, lab);
    if (grade) {
      updateCourse(course.id, (c) => {
        c.manualGrade = grade;
      });
    }
    setName("");
    setGrade("");
    onDone();
  }

  return (
    <form
      onSubmit={submit}
      onKeyDown={(e) => e.key === "Escape" && onCancel?.()}
      className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end"
    >
      <div>
        <label htmlFor="gpa-new-name" className="mb-1 block text-xs font-medium text-muted">
          Subject Name
        </label>
        <input
          id="gpa-new-name"
          autoFocus
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Operating Systems"
          className="field w-full"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <CreditSelect
          label="Theory"
          value={theory}
          max={MAX_THEORY_CREDITS}
          disableZero={lab === 0}
          onChange={setTheory}
        />
        <CreditSelect
          label="Lab"
          value={lab}
          max={MAX_LAB_CREDITS}
          disableZero={theory === 0}
          onChange={setLab}
        />
        <GradeSelect
          label="Grade"
          value={grade}
          scale={scale}
          emptyLabel="Later"
          onChange={setGrade}
          className="w-28"
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className={buttonClass("primary")}>
          Add Subject
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className={buttonClass("ghost")}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
