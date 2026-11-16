import type { PartResult } from "@/lib/calc";
import { formatMarks } from "@/lib/format";

/** One colour per assessment slot, readable on both themes. */
const COLORS = ["#14b8a6", "#3b82f6", "#a78bfa", "#f59e0b"];

/**
 * A 100-mark bar split by weight. In each slot the solid part is marks earned,
 * the faint part is marks lost, and an empty slot is not entered yet.
 */
export function BreakdownBar({ part }: { part: PartResult }) {
  const label = part.components
    .map((c) => `${c.def.label} ${c.marks === null ? "not entered" : `${formatMarks(c.marks)} of ${c.def.weight}`}`)
    .join(", ");

  return (
    <div>
      <div role="img" aria-label={label} className="flex h-2.5 overflow-hidden rounded-sm bg-surface-2">
        {part.components.map((c, i) => {
          const color = COLORS[i % COLORS.length];
          const earned = c.marks === null ? 0 : (c.marks / c.def.weight) * 100;
          return (
            <div
              key={c.def.key}
              className="h-full border-r-2 border-surface last:border-r-0"
              style={{
                width: `${c.def.weight}%`,
                background: c.marks === null ? undefined : `color-mix(in srgb, ${color} 22%, transparent)`,
              }}
            >
              <div className="h-full transition-[width] duration-300" style={{ width: `${earned}%`, background: color }} />
            </div>
          );
        })}
      </div>
      <ul className="mt-2.5 space-y-1 text-xs">
        {part.components.map((c, i) => (
          <li key={c.def.key} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-muted">
              <span className="size-2 rounded-[2px]" style={{ background: COLORS[i % COLORS.length] }} />
              {c.def.label}
            </span>
            <span className="tabular-nums">
              {c.marks === null ? <span className="text-muted">-</span> : formatMarks(c.marks)}
              <span className="text-muted"> / {c.def.weight}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
