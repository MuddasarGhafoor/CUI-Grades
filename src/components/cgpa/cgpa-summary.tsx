import type { TimelinePoint } from "@/lib/calc";
import { formatGpa, formatMarks } from "@/lib/format";
import { TrendChart } from "./trend-chart";

type CgpaSummaryProps = {
  points: TimelinePoint[];
};

/** Right-hand results panel: the CGPA, its numbers, and the trend chart. */
export function CgpaSummary({ points }: CgpaSummaryProps) {
  const last = points.at(-1) ?? null;
  const previous = points.at(-2) ?? null;
  const credits = points.reduce((sum, p) => sum + p.credits, 0);
  const change = last && previous ? last.cgpa - previous.cgpa : null;

  const stats = [
    { label: "Credit Hours", value: formatMarks(credits), tone: "" },
    { label: "Semesters", value: String(points.length), tone: "" },
    {
      label: "Last Change",
      value: change === null ? "-" : `${change >= 0 ? "+" : "-"}${Math.abs(change).toFixed(2)}`,
      tone: change === null ? "" : change > 0.004 ? "text-ok" : change < -0.004 ? "text-err" : "",
    },
  ];

  return (
    <aside aria-label="CGPA" className="card lg:sticky lg:top-24">
      <div className="p-4">
        <p className="text-xs font-medium text-muted">CGPA</p>
        <p className="mt-1 font-display text-5xl leading-none tabular-nums text-tone-violet">
          {formatGpa(last?.cgpa ?? null)}
        </p>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-[13px]">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg bg-surface-2/50 px-3 py-2">
              <dt className="text-xs text-muted">{s.label}</dt>
              <dd className={`font-semibold tabular-nums ${s.tone}`}>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {points.length > 0 && (
        <div className="border-t border-line p-4">
          <TrendChart points={points} />
        </div>
      )}
    </aside>
  );
}
