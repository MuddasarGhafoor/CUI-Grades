import type { GpaResult } from "@/lib/calc";
import { formatGpa, formatMarks, formatPercent, toneColor } from "@/lib/format";

export type SubjectBar = {
  id: string;
  name: string;
  percent: number | null;
  letter: string | null;
};

type GpaSummaryProps = {
  gpa: GpaResult;
  totalCredits: number;
  ungraded: number;
  bars: SubjectBar[];
};

/** Right-hand results panel: the semester GPA, its numbers, and a compact bar per subject. */
export function GpaSummary({ gpa, totalCredits, ungraded, bars }: GpaSummaryProps) {
  const withMarks = bars.filter((b) => b.percent !== null);

  return (
    <aside aria-label="Semester GPA" className="card lg:sticky lg:top-24">
      <div className="p-4">
        <p className="text-xs font-medium text-muted">Semester GPA</p>
        <p className="mt-1 font-display text-5xl leading-none tabular-nums text-tone-blue">{formatGpa(gpa.gpa)}</p>
        <dl className="mt-4 grid grid-cols-2 gap-2 text-[13px]">
          <div className="rounded-lg bg-surface-2/50 px-3 py-2">
            <dt className="text-xs text-muted">Credit Hours</dt>
            <dd className="font-semibold tabular-nums">
              {gpa.credits}
              {totalCredits !== gpa.credits && <span className="font-normal text-muted"> / {totalCredits}</span>}
            </dd>
          </div>
          <div className="rounded-lg bg-surface-2/50 px-3 py-2">
            <dt className="text-xs text-muted">Quality Points</dt>
            <dd className="font-semibold tabular-nums">{formatMarks(gpa.qualityPoints)}</dd>
          </div>
        </dl>
        {ungraded > 0 && (
          <p className="mt-3 text-xs text-warn">
            {ungraded} without a grade, not counted
          </p>
        )}
      </div>

      {withMarks.length > 0 && (
        <div className="border-t border-line p-4">
          <h3 className="text-[13px] font-semibold">By Subject</h3>
          <ul className="mt-2.5 space-y-2.5">
            {withMarks.map((b) => {
              const pct = Math.max(0, Math.min(100, b.percent ?? 0));
              return (
                <li key={b.id}>
                  <div className="flex items-baseline justify-between gap-3 text-[13px]">
                    <span className="truncate" title={b.name}>
                      {b.name}
                    </span>
                    <span className="shrink-0 tabular-nums text-muted">
                      {formatPercent(b.percent, 0)}
                      {b.letter && (
                        <span className="ml-1.5 font-semibold" style={{ color: toneColor(b.percent) }}>
                          {b.letter}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full transition-[width] duration-500"
                      style={{ width: `${pct}%`, background: toneColor(b.percent) }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </aside>
  );
}
