import { formatPercent, toneColor } from "@/lib/format";
import { CUI_GRADE_SCALE, PASS_PERCENT } from "@/lib/grading";

export type BarRow = {
  id: string;
  name: string;
  percent: number | null;
  letter: string | null;
};

const A_LINE = CUI_GRADE_SCALE[0].min;

function Marker({ at, label }: { at: number; label: string }) {
  return (
    <span
      aria-hidden="true"
      title={label}
      className="absolute -inset-y-1 w-0 border-l border-dashed border-muted/50"
      style={{ left: `${at}%` }}
    />
  );
}

/** Horizontal bars of each subject's percentage from marks, coloured by grade range. */
export function SubjectBars({ rows }: { rows: BarRow[] }) {
  const withMarks = rows.filter((r) => r.percent !== null);
  if (withMarks.length === 0) return null;
  const handOnly = rows.length - withMarks.length;

  return (
    <section className="rounded-lg border border-line bg-surface p-5">
      <h2 className="font-semibold">Subjects compared</h2>
      <p className="mt-1 text-sm text-muted">
        Percentage from marks. The dashed lines are the pass mark ({PASS_PERCENT}%) and an A ({A_LINE}%).
      </p>

      <ul className="mt-5 space-y-3">
        {withMarks.map((row) => {
          const pct = Math.max(0, Math.min(100, row.percent ?? 0));
          return (
            <li
              key={row.id}
              className="grid grid-cols-[minmax(0,7rem)_1fr_4.5rem] items-center gap-3 text-sm sm:grid-cols-[minmax(0,11rem)_1fr_5.5rem]"
            >
              <span className="truncate" title={row.name}>
                {row.name}
              </span>
              <div
                role="img"
                aria-label={`${row.name}: ${formatPercent(row.percent)}`}
                className="relative h-2.5 rounded-sm bg-surface-2"
              >
                <div
                  className="h-full rounded-sm transition-[width] duration-500"
                  style={{ width: `${pct}%`, background: toneColor(row.percent) }}
                />
                <Marker at={PASS_PERCENT} label="Pass mark" />
                <Marker at={A_LINE} label="A grade" />
              </div>
              <span className="text-right tabular-nums">
                {formatPercent(row.percent)}
                {row.letter && <span className="ml-1.5 font-semibold">{row.letter}</span>}
              </span>
            </li>
          );
        })}
      </ul>

      {handOnly > 0 && (
        <p className="mt-4 text-xs text-muted">
          {handOnly} subject{handOnly === 1 ? "" : "s"} without marks {handOnly === 1 ? "is" : "are"} not
          shown.
        </p>
      )}
    </section>
  );
}
