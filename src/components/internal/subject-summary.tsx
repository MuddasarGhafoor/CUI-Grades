import { ProgressRing } from "@/components/ui/progress-ring";
import type { CourseResult, PartResult } from "@/lib/calc";
import { formatMarks, formatPercent, toneColor } from "@/lib/format";
import { ComponentBars } from "./breakdown-bar";

/** Theory or lab: its total so far, then one line per assessment with its bar after it. */
function PartSummary({ part }: { part: PartResult }) {
  return (
    <div className="min-w-0 px-4 py-3 lg:flex-1">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[13px] font-semibold">{part.part === "theory" ? "Theory" : "Lab"}</h3>
        <p className="text-[13px] tabular-nums">
          <span className="font-semibold">{formatMarks(part.marks)}</span>
          <span className="text-muted">/100</span>
        </p>
      </div>
      <div className="mt-2">
        <ComponentBars part={part} />
      </div>
    </div>
  );
}

/** The results strip under the marks: grade first, then theory and lab, side by side on wide screens. */
export function SubjectSummary({ result }: { result: CourseResult }) {
  const grade = result.gradeFromMarks;
  const parts = [result.theory, result.lab].filter((p): p is PartResult => p !== null);

  return (
    <section aria-label="Result" className="card flex flex-col divide-y divide-line lg:flex-row lg:divide-x lg:divide-y-0">
      <div className="flex items-center gap-4 p-4 lg:shrink-0 lg:pr-6">
        <ProgressRing value={result.percent} color={toneColor(result.percent)} size={92} stroke={8}>
          <div>
            <p className="text-lg font-semibold tabular-nums">{formatPercent(result.percent)}</p>
            <p className="text-[11px] text-muted">{result.complete ? "Result" : "So Far"}</p>
          </div>
        </ProgressRing>
        <div className="min-w-0">
          <p className="font-display text-3xl leading-none" style={{ color: grade ? toneColor(result.percent) : undefined }}>
            {grade ? grade.letter : "-"}
          </p>
          <p className="mt-1 text-[13px] tabular-nums text-muted">
            {grade ? `${grade.points.toFixed(2)} Grade Points` : "No Grade Yet"}
          </p>
        </div>
      </div>
      {parts.map((part) => (
        <PartSummary key={part.part} part={part} />
      ))}
    </section>
  );
}
