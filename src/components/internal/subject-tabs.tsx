"use client";

import type { Course } from "@/lib/types";

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
    <div className="flex items-end gap-1 overflow-x-auto border-b border-line">
      {courses.map((course) => {
        const active = course.id === activeId;
        const letter = letters[course.id];
        return (
          <button
            key={course.id}
            type="button"
            onClick={() => onSelect(course.id)}
            aria-current={active ? "true" : undefined}
            className={`relative flex max-w-56 shrink-0 items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors ${
              active ? "text-fg" : "text-muted hover:text-fg"
            }`}
          >
            <span className="truncate">{course.name}</span>
            {letter && (
              <span className="rounded bg-surface-2 px-1.5 py-0.5 text-xs tabular-nums text-muted">
                {letter}
              </span>
            )}
            {active && <span className="absolute inset-x-2 -bottom-px h-0.5 bg-accent" />}
          </button>
        );
      })}
      <button
        type="button"
        onClick={onAdd}
        className="shrink-0 px-3 py-2.5 text-sm font-medium text-accent hover:underline"
      >
        + Add subject
      </button>
    </div>
  );
}
