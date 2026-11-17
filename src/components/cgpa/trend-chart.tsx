"use client";

import type { TimelinePoint } from "@/lib/calc";
import { formatGpa } from "@/lib/format";
import { useElementWidth } from "@/lib/use-element-width";

const HEIGHT = 180;
const PAD = { top: 18, right: 18, bottom: 30, left: 34 };

/** Lowest y value shown: rounded down to a half point, always showing at least one full point of range. */
function yFloor(points: TimelinePoint[]): number {
  const lowest = Math.min(...points.flatMap((p) => [p.gpa, p.cgpa]));
  const floor = Math.max(0, Math.floor((lowest - 0.25) * 2) / 2);
  return Math.min(floor, 3);
}

function shortLabel(label: string, max: number): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

/** Semester GPA and running CGPA as lines. Sits inside the CGPA results panel. */
export function TrendChart({ points }: { points: TimelinePoint[] }) {
  const [ref, width] = useElementWidth<HTMLDivElement>();

  if (points.length === 0) return null;

  const innerW = Math.max(width - PAD.left - PAD.right, 10);
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const min = yFloor(points);
  const max = 4;
  const x = (i: number) => PAD.left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
  const y = (v: number) => PAD.top + (1 - (v - min) / (max - min)) * innerH;

  const ticks: number[] = [];
  for (let v = min; v <= max + 1e-9; v += 0.5) ticks.push(Number(v.toFixed(1)));

  const line = (key: "gpa" | "cgpa") =>
    points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ");

  // Fewer x labels on narrow screens so they never overlap.
  const labelEvery = Math.max(1, Math.ceil(points.length / Math.max(1, Math.floor(innerW / 64))));
  const maxChars = Math.max(4, Math.floor(innerW / Math.max(points.length, 1) / 7));
  const last = points[points.length - 1];

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold">Trend</h3>
        <ul className="flex gap-3 text-xs text-muted">
          <li className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded bg-tone-violet" /> CGPA
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-0 w-4 border-t-2 border-dashed border-tone-blue" /> GPA
          </li>
        </ul>
      </div>

      <div ref={ref} className="mt-3">
        <svg
          width={width}
          height={HEIGHT}
          role="img"
          aria-label={points.map((p) => `${p.label}: GPA ${formatGpa(p.gpa)}, CGPA ${formatGpa(p.cgpa)}`).join("; ")}
          className="block max-w-full overflow-visible"
        >
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={PAD.left + innerW}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--line)"
                strokeDasharray={Number.isInteger(t) ? undefined : "2 4"}
              />
              <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize="11" fill="var(--muted)">
                {t.toFixed(1)}
              </text>
            </g>
          ))}

          {points.map((p, i) =>
            i % labelEvery === 0 || i === points.length - 1 ? (
              <text
                key={p.id}
                x={x(i)}
                y={HEIGHT - 8}
                textAnchor={points.length === 1 ? "middle" : i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}
                fontSize="11"
                fill="var(--muted)"
              >
                {shortLabel(p.label, maxChars)}
              </text>
            ) : null,
          )}

          {points.length > 1 && (
            <>
              <path d={line("gpa")} fill="none" stroke="var(--tone-blue)" strokeWidth="1.5" strokeDasharray="5 4" />
              <path d={line("cgpa")} fill="none" stroke="var(--tone-violet)" strokeWidth="2.5" strokeLinejoin="round" />
            </>
          )}

          {points.map((p, i) => (
            <g key={p.id}>
              <circle cx={x(i)} cy={y(p.gpa)} r="3" fill="var(--surface)" stroke="var(--tone-blue)" strokeWidth="1.5">
                <title>{`${p.label}: semester GPA ${formatGpa(p.gpa)}`}</title>
              </circle>
              <circle cx={x(i)} cy={y(p.cgpa)} r="4" fill="var(--tone-violet)">
                <title>{`${p.label}: CGPA ${formatGpa(p.cgpa)}`}</title>
              </circle>
            </g>
          ))}

          <text
            x={x(points.length - 1)}
            y={y(last.cgpa) - 10}
            textAnchor={points.length === 1 ? "middle" : "end"}
            fontSize="12"
            fontWeight="600"
            fill="var(--fg)"
          >
            {formatGpa(last.cgpa)}
          </text>
        </svg>
      </div>
    </div>
  );
}
