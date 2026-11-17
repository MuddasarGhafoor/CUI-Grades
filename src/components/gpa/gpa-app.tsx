"use client";

import { Icon } from "@/components/ui/icons";
import { gpaPageResult } from "@/lib/gpa";
import { addGpaCourse, useAppData } from "@/lib/store";
import { useIsClient } from "@/lib/use-is-client";
import { GpaColumnsHeader, GpaCourseRow } from "./gpa-course-row";
import { GpaResult } from "./gpa-result";
import { GPA_MAIN_WIDTH } from "./layout";

/**
 * GPA page: its own courses (not linked to Internal Marks), six to start with.
 * Courses on top, the grading section underneath.
 */
export function GpaApp() {
  const isClient = useIsClient();
  const data = useAppData();

  if (!isClient) {
    return <div aria-hidden="true" className="card h-72" />;
  }

  const scale = data.settings.gradeScale;
  const result = gpaPageResult(data.gpaCourses, scale);

  return (
    <div className="space-y-4">
      <section aria-label="Courses" className={`card mx-auto w-full overflow-hidden ${GPA_MAIN_WIDTH}`}>
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-2">
          <h2 className="text-sm font-semibold">
            Courses
            <span className="ml-2 text-xs font-normal text-muted">{data.gpaCourses.length}</span>
          </h2>
          <button
            type="button"
            onClick={addGpaCourse}
            aria-label="Add course"
            title="Add course"
            className="grid size-8 place-items-center rounded-md text-tone-blue transition-colors hover:bg-tone-blue/10"
          >
            <Icon name="plus" size={17} />
          </button>
        </header>

        <GpaColumnsHeader />
        {data.gpaCourses.map((course) => (
          <GpaCourseRow key={course.id} course={course} scale={scale} />
        ))}
        {data.gpaCourses.length === 0 && (
          <p className="px-4 py-6 text-center text-[13px] text-muted">No courses. Press + to add one.</p>
        )}
      </section>

      <GpaResult result={result} />
    </div>
  );
}
