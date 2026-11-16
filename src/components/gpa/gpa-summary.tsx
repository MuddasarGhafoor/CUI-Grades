import type { GpaResult } from "@/lib/calc";
import { formatGpa, formatMarks } from "@/lib/format";

type GpaSummaryProps = {
  gpa: GpaResult;
  totalCredits: number;
  ungraded: number;
};

export function GpaSummary({ gpa, totalCredits, ungraded }: GpaSummaryProps) {
  return (
    <section
      aria-label="Semester GPA"
      className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-[1.5fr_1fr_1fr]"
    >
      <div className="bg-surface p-5">
        <p className="text-xs text-muted">Semester GPA</p>
        <p className="mt-1 font-display text-5xl tabular-nums">{formatGpa(gpa.gpa)}</p>
        <p className="mt-1 text-xs text-muted">
          {ungraded > 0
            ? `${ungraded} subject${ungraded === 1 ? " has" : "s have"} no grade yet and ${ungraded === 1 ? "is" : "are"} left out.`
            : gpa.gpa === null
              ? "Add a subject to see your GPA."
              : "Every subject is counted."}
        </p>
      </div>
      <div className="bg-surface p-5">
        <p className="text-xs text-muted">Credit hours counted</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">
          {gpa.credits}
          {totalCredits !== gpa.credits && <span className="text-base text-muted"> of {totalCredits}</span>}
        </p>
      </div>
      <div className="bg-surface p-5">
        <p className="text-xs text-muted">Quality points</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">{formatMarks(gpa.qualityPoints)}</p>
        <p className="mt-1 text-xs text-muted">grade points × credit hours</p>
      </div>
    </section>
  );
}
