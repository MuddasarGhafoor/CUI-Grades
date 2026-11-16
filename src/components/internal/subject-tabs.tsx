"use client";

import type { Course } from "@/lib/types";
import { TONE_CLASS, gradeTone } from "@/lib/tones";

type SubjectTabsProps = {
  courses: Course[];
  activeId: string;
  /** Letter grade so far for each subject id, shown next to its name. */
  letters: Record<string, string | undefined>;
  onSelect: (id: string) => void;
  onAdd: () => void;
};

export function SubjectTabs({ courses, activeId, letters, onSelect, onAdd }: SubjectTabsProps) {
  return (
    <div className="card flex items-center gap-1 overflow-x-auto p-1.5">
      {courses.map((course) => {
        const active = course.id === activeId;
        const letter = letters[course.id];
        return (
          <button
            key={course.id}
            type="button"
            onClick={() => onSelect(course.id)}
            aria-current={active ? "true" : undefined}
            className={`flex h-9 max-w-56 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors ${
              active
                ? "bg-surface-2 text-fg shadow-[inset_0_0_0_1px_var(--line-strong)]"
                : "text-muted hover:bg-surface-2/60 hover:text-fg"
            }`}
          >
            <span className="truncate">{course.name}</span>
            {letter && (
              <span
                className={`rounded-md px-1.5 py-px text-xs font-semibold tabular-nums ${
                  TONE_CLASS[gradeTone(letter) ?? "teal"].soft
                } ${active ? "" : "opacity-70"}`}
              >
                {letter}
              </span>
            )}
          </button>
        );
      })}
      <button
        type="button"
        onClick={onAdd}
        className="ml-auto flex h-9 shrink-0 items-center rounded-lg px-3 text-sm font-medium text-tone-teal transition-colors hover:bg-tone-teal/10"
      >
        + Add Subject
      </button>
    </div>
  );
}
