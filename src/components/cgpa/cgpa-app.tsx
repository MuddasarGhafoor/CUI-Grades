"use client";

import { cgpaTimeline, semesterGpa } from "@/lib/calc";
import { useAppData } from "@/lib/store";
import { useIsClient } from "@/lib/use-is-client";
import { CgpaSummary } from "./cgpa-summary";
import { SemesterTable } from "./semester-table";

const CURRENT_ID = "current-semester";

/** Two sections: semesters on the left, the CGPA results panel on the right. */
export function CgpaApp() {
  const isClient = useIsClient();
  const data = useAppData();

  if (!isClient) {
    return <div aria-hidden="true" className="card h-72" />;
  }

  const { semesters, settings } = data;
  const current = semesterGpa(data.courses, settings.gradeScale);
  const includeCurrent = settings.includeCurrentSemester;
  const timeline = cgpaTimeline(
    semesters,
    includeCurrent ? { id: CURRENT_ID, label: "This Semester", result: current } : undefined,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
      <SemesterTable
        semesters={semesters}
        timeline={timeline}
        current={current}
        currentId={CURRENT_ID}
        includeCurrent={includeCurrent}
      />
      <CgpaSummary points={timeline} />
    </div>
  );
}
