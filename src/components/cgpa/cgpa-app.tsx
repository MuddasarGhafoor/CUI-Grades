"use client";

import { cgpaTimeline, semesterGpa } from "@/lib/calc";
import { useAppData } from "@/lib/store";
import { useIsClient } from "@/lib/use-is-client";
import { CgpaSummary } from "./cgpa-summary";
import { SemesterTable } from "./semester-table";
import { TrendChart } from "./trend-chart";

const CURRENT_ID = "current-semester";

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
  const countsCurrent = timeline.some((p) => p.id === CURRENT_ID);

  return (
    <div className="space-y-6">
      <CgpaSummary points={timeline} includesCurrent={countsCurrent} />
      <SemesterTable
        semesters={semesters}
        timeline={timeline}
        current={current}
        currentId={CURRENT_ID}
        includeCurrent={includeCurrent}
      />
      {timeline.length > 0 && <TrendChart points={timeline} />}
      <p className="text-xs text-muted">
        CGPA is every semester&apos;s grade points × credit hours, added up and divided by all your
        credit hours. Repeated or improved courses are not adjusted here.
      </p>
    </div>
  );
}
