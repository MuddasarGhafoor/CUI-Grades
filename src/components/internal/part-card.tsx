"use client";

import type { PartResult } from "@/lib/calc";
import { formatCredits } from "@/lib/format";
import { TONE_CLASS } from "@/lib/tones";
import type { Course } from "@/lib/types";
import { ComponentBlock, LabQuizPlaceholder } from "./component-block";

type PartCardProps = {
  course: Course;
  part: PartResult;
};

/** Theory or lab: every assessment of that part, in marking order. Lab shows a greyed quizzes row. */
export function PartCard({ course, part }: PartCardProps) {
  const isLab = part.part === "lab";

  return (
    <section className="card overflow-hidden">
      <header className="flex items-center gap-2 border-b border-line bg-surface-2/40 px-4 py-2">
        <h2 className="text-sm font-semibold">{isLab ? "Lab" : "Theory"}</h2>
        <span
          className={`rounded-md px-1.5 py-px text-[11px] font-medium ${isLab ? TONE_CLASS.violet.soft : TONE_CLASS.blue.soft}`}
        >
          {formatCredits(part.credits)}
        </span>
      </header>
      {isLab && <LabQuizPlaceholder />}
      {part.components.map((component) => (
        <ComponentBlock key={component.def.key} course={course} def={component.def} result={component} />
      ))}
    </section>
  );
}
