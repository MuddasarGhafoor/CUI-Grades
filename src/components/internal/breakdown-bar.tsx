import { LAB_QUIZ_PLACEHOLDER, rowLabel } from "@/lib/assessments";
import type { PartResult } from "@/lib/calc";
import { formatMarks } from "@/lib/format";

/** One colour per assessment, readable on both themes. Quizzes first, then assignments, mid, final. */
const COLORS = ["#14b8a6", "#3b82f6", "#a78bfa", "#f59e0b"];

const ROW = "grid grid-cols-[6.5rem_3.5rem_minmax(0,1fr)] items-center gap-2 text-xs";

/**
 * Each assessment on its own line: name, marks, then its bar after them.
 * Lab gets a greyed-out quizzes line so theory and lab line up.
 */
export function ComponentBars({ part }: { part: PartResult }) {
  const isLab = part.part === "lab";

  return (
    <ul className="space-y-1.5">
      {isLab && (
        <li className={`${ROW} opacity-50`} aria-disabled="true">
          <span className="truncate text-muted">{LAB_QUIZ_PLACEHOLDER.label}</span>
          <span className="text-right text-muted">-</span>
          <span className="h-1.5 rounded-full bg-surface-2" />
        </li>
      )}
      {part.components.map((c, i) => {
        const color = COLORS[(isLab ? i + 1 : i) % COLORS.length];
        const width = c.marks === null ? 0 : (c.marks / c.def.weight) * 100;
        return (
          <li key={c.def.key} className={ROW}>
            <span className="truncate text-muted">{rowLabel(c.def)}</span>
            <span className="text-right tabular-nums">
              {c.marks === null ? <span className="text-muted">-</span> : formatMarks(c.marks)}
              <span className="text-muted">/{c.def.weight}</span>
            </span>
            <span
              role="img"
              aria-label={`${rowLabel(c.def)}: ${c.marks === null ? "not entered" : `${formatMarks(c.marks)} of ${c.def.weight}`}`}
              className="h-1.5 overflow-hidden rounded-full bg-surface-2"
            >
              <span className="block h-full rounded-full transition-[width] duration-300" style={{ width: `${width}%`, background: color }} />
            </span>
          </li>
        );
      })}
    </ul>
  );
}
