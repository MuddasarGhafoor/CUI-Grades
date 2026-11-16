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
  const [editing, setEditing] = useState(false);

  // Saved data only exists in the browser. Show a quiet placeholder until it is read.
  if (!isClient) {
    return <div aria-hidden="true" className="h-72 rounded-lg border border-line bg-surface" />;
  }

  const { courses, settings } = data;
  const scale = settings.gradeScale;
  const fallbackName = `Subject ${courses.length + 1}`;
  const active = courses.find((c) => c.id === data.activeCourseId) ?? courses[0] ?? null;

  if (!active) {
    return (
      <div className="max-w-3xl">
        <h2 className="font-semibold">Add your first subject</h2>
        <p className="mb-4 mt-1 text-sm text-muted">
          Give it a name and its credit hours. Quizzes, assignments and exams come pre-filled with
          their usual totals, so you only type the marks you got.
        </p>
        <AddSubjectForm fallbackName={fallbackName} onDone={() => setAdding(false)} />
      </div>
    );
  }

  const result = courseResult(active, scale);
  const letters = Object.fromEntries(
    courses.map((c) => [c.id, courseResult(c, scale).gradeFromMarks?.letter]),
  );

  return (
    <div>
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
        <div className="mt-4">
          <AddSubjectForm
            fallbackName={fallbackName}
            onDone={() => setAdding(false)}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
        <div className="min-w-0 space-y-6">
          <SubjectHeader
            course={active}
            result={result}
            editing={editing}
            onToggleEditing={() => setEditing((v) => !v)}
          />
          {result.theory && <PartCard course={active} part={result.theory} editing={editing} />}
          {result.lab && <PartCard course={active} part={result.lab} editing={editing} />}
          <p className="text-xs text-muted">
            Press Enter or Tab to move to the next box. Leave a box empty if that mark isn&apos;t out
            yet; it won&apos;t count against you.
          </p>
        </div>
        <SubjectSummary result={result}>
          <FinalTarget key={active.id} course={active} result={result} scale={scale} />
        </SubjectSummary>
      </div>
    </div>
  );
}
