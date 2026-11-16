import type { TimelinePoint } from "@/lib/calc";
import { formatGpa } from "@/lib/format";

type CgpaSummaryProps = {
  points: TimelinePoint[];
  includesCurrent: boolean;
};

export function CgpaSummary({ points, includesCurrent }: CgpaSummaryProps) {
  const last = points.at(-1) ?? null;
  const previous = points.at(-2) ?? null;
  const credits = points.reduce((sum, p) => sum + p.credits, 0);
  const change = last && previous ? last.cgpa - previous.cgpa : null;

  return (
    <section
      aria-label="CGPA"
      className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-[1.5fr_1fr_1fr]"
    >
      <div className="bg-surface p-5">
        <p className="text-xs text-muted">CGPA</p>
        <p className="mt-1 font-display text-5xl tabular-nums">{formatGpa(last?.cgpa ?? null)}</p>
        <p className="mt-1 text-xs text-muted">
          {last === null
            ? "Add a semester to see your CGPA."
            : includesCurrent
              ? "Includes this semester from the GPA page."
              : "Past semesters only."}
        </p>
      </div>
      <div className="bg-surface p-5">
        <p className="text-xs text-muted">Credit hours</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">{credits}</p>
        <p className="mt-1 text-xs text-muted">
          {points.length} semester{points.length === 1 ? "" : "s"} counted
        </p>
      </div>
      <div className="bg-surface p-5">
        <p className="text-xs text-muted">Change after last semester</p>
        <p
          className={`mt-1 text-2xl font-semibold tabular-nums ${
            change === null ? "" : change > 0.004 ? "text-ok" : change < -0.004 ? "text-err" : ""
          }`}
        >
          {change === null ? "–" : `${change >= 0 ? "+" : "−"}${Math.abs(change).toFixed(2)}`}
        </p>
      </div>
    </section>
  );
}
