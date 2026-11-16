"use client";

import { INTERNAL_OUT_OF } from "@/lib/assessments";
import type { PartResult } from "@/lib/calc";
import { formatCredits, formatMarks } from "@/lib/format";
import type { Course } from "@/lib/types";
import { ComponentBlock } from "./component-block";

type PartCardProps = {
  course: Course;
  part: PartResult;
  editing: boolean;
};

/** Theory or lab: every assessment of that part, in marking order. */
export function PartCard({ course, part, editing }: PartCardProps) {
  return (
    <section className="card overflow-hidden">
      <header className="flex items-center justify-between gap-3 border-b border-line bg-surface-2/40 px-4 py-3 sm:px-5">
        <h2 className="flex items-center gap-2 font-semibold">
          {part.part === "theory" ? "Theory" : "Lab"}
          <span className="rounded-md border border-line px-1.5 py-0.5 text-xs font-medium text-muted">
            {formatCredits(part.credits)}
          </span>
        </h2>
        <p className="text-sm text-muted">
          Internal{" "}
          <span className="font-semibold tabular-nums text-fg">{formatMarks(part.internalMarks)}</span>{" "}
          / {INTERNAL_OUT_OF}
        </p>
      </header>
      {part.components.map((component) => (
        <ComponentBlock
          key={component.def.key}
          course={course}
          def={component.def}
          result={component}
          editing={editing}
        />
      ))}
    </section>
  );
}
