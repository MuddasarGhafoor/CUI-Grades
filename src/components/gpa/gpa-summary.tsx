import { StatGrid } from "@/components/ui/stat-grid";
import type { GpaResult } from "@/lib/calc";
import { formatGpa, formatMarks } from "@/lib/format";

type GpaSummaryProps = {
  gpa: GpaResult;
  totalCredits: number;
  ungraded: number;
};

export function GpaSummary({ gpa, totalCredits, ungraded }: GpaSummaryProps) {
  const note =
    ungraded > 0
      ? `${ungraded} subject${ungraded === 1 ? " has" : "s have"} no grade yet and ${ungraded === 1 ? "is" : "are"} left out.`
      : gpa.gpa === null
        ? "Add a subject to see your GPA."
        : "Every subject is counted.";

  return (
    <StatGrid
      label="Semester GPA"
      stats={[
        { label: "Semester GPA", value: formatGpa(gpa.gpa), note, primary: true },
        {
          label: "Credit Hours Counted",
          value: (
            <>
              {gpa.credits}
              {totalCredits !== gpa.credits && <span className="text-base text-muted"> of {totalCredits}</span>}
            </>
          ),
        },
        {
          label: "Quality Points",
          value: formatMarks(gpa.qualityPoints),
          note: "Grade points × credit hours",
        },
      ]}
    />
  );
}
