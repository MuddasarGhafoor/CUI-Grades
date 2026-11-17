"use client";

import { useState } from "react";
import { courseResult } from "@/lib/calc";
import { setActiveCourse, useAppData } from "@/lib/store";
import { useIsClient } from "@/lib/use-is-client";
import { AddSubjectForm } from "./add-subject-form";
import { FinalTarget } from "./final-target";
import { PartCard } from "./part-card";
import { SubjectHeader } from "./subject-header";
import { SubjectSummary } from "./subject-summary";
import { SubjectTabs } from "./subject-tabs";

export function InternalMarksApp() {
  const isClient = useIsClient();
  const data = useAppData();
  const [adding, setAdding] = useState(false);

  // Saved data only exists in the browser. Show a quiet placeholder until it is read.
  if (!isClient) {
    return <div aria-hidden="true" className="card h-72" />;
  }

  const { courses, settings } = data;
  const scale = settings.gradeScale;
  const fallbackName = `Subject ${courses.length + 1}`;
  const active = courses.find((c) => c.id === data.activeCourseId) ?? courses[0] ?? null;

  if (!active) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col justify-center py-10 md:min-h-[50vh]">
        <h2 className="mb-3 text-center text-lg font-semibold">Add Your First Subject</h2>
        <AddSubjectForm fallbackName={fallbackName} onDone={() => setAdding(false)} />
      </div>
    );
  }

  const result = courseResult(active, scale);
  const letters = Object.fromEntries(
    courses.map((c) => [c.id, courseResult(c, scale).gradeFromMarks?.letter]),
  );
  const bothParts = Boolean(result.theory && result.lab);

  // Full width: tabs, subject row, Theory and Lab side by side, the results strip, then the target.
  return (
    <div className="space-y-4">
      <SubjectTabs
        courses={courses}
        activeId={active.id}
        letters={letters}
        onSelect={(id) => {
          setActiveCourse(id);
          setAdding(false);
        }}
        onAdd={() => setAdding(true)}
      />

      {adding && (
        <AddSubjectForm
          fallbackName={fallbackName}
          onDone={() => setAdding(false)}
          onCancel={() => setAdding(false)}
        />
      )}

      <SubjectHeader course={active} />

      <div className={`grid items-start gap-4 ${bothParts ? "lg:grid-cols-2" : ""}`}>
        {result.theory && <PartCard course={active} part={result.theory} />}
        {result.lab && <PartCard course={active} part={result.lab} />}
      </div>

      <SubjectSummary result={result} />

      <FinalTarget key={active.id} course={active} scale={scale} />
    </div>
  );
}
