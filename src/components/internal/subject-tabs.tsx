"use client";

import { Icon } from "@/components/ui/icons";
import { TONE_CLASS, gradeTone } from "@/lib/tones";
import type { Course } from "@/lib/types";

type SubjectTabsProps = {
  courses: Course[];
  activeId: string;
  /** Letter grade so far for each subject id, shown next to its name. */
  letters: Record<string, string | undefined>;
  onSelect: (id: string) => void;
  onAdd: () => void;
};

/**
 * Subject tabs on the left, wrapping onto new lines when they no longer fit so none are hidden.
 * The add button is a plus icon fixed on the right, behind a thin separator.
 */
export function SubjectTabs({ courses, activeId, letters, onSelect, onAdd }: SubjectTabsProps) {
  return (
    <div className="card flex items-start gap-1 p-1">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
        {courses.map((course) => {
          const active = course.id === activeId;
          const letter = letters[course.id];
          return (
            <button
              key={course.id}
              type="button"
              onClick={() => onSelect(course.id)}
              aria-current={active ? "true" : undefined}
              className={`flex h-8 max-w-56 items-center gap-2 rounded-md px-3 text-[13px] font-medium transition-colors ${
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
      </div>

      <div className="flex shrink-0 items-center self-stretch">
        <span aria-hidden="true" className="mx-1.5 w-px self-stretch bg-line-strong" />
        <button
          type="button"
          onClick={onAdd}
          aria-label="Add subject"
          title="Add subject"
          className="grid size-8 place-items-center self-start rounded-md text-tone-teal transition-colors hover:bg-tone-teal/10"
        >
          <Icon name="plus" size={17} />
        </button>
      </div>
    </div>
  );
}
