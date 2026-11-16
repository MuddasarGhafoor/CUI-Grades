import { ProgressRing } from "@/components/ui/progress-ring";
import { INTERNAL_OUT_OF } from "@/lib/assessments";
import type { CourseResult, PartResult } from "@/lib/calc";
import { formatMarks, formatPercent, toneColor } from "@/lib/format";
import { BreakdownBar } from "./breakdown-bar";

function Row({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right tabular-nums">
        {value}
        {note && <span className="ml-1 text-xs text-muted">{note}</span>}
      </dd>
    </div>
  );
}

function PartSummary({ part }: { part: PartResult }) {
  const final = part.components.find((c) => !c.def.internal);
  const internalNote =
    part.internalPossible > 0 && part.internalPossible < INTERNAL_OUT_OF
      ? `(${part.internalPossible} entered)`
      : undefined;

  return (
    <div className="border-t border-line pt-4">
      <h3 className="text-sm font-semibold">{part.part === "theory" ? "Theory" : "Lab"}</h3>
      <dl className="mt-2 space-y-1 text-sm">
        <Row label="Internal" value={`${formatMarks(part.internalMarks)} / ${INTERNAL_OUT_OF}`} note={internalNote} />
        <Row
          label="Final"
          value={final?.marks == null ? "not entered" : `${formatMarks(final.marks)} / ${final.def.weight}`}
        />
        <Row label="Total" value={`${formatMarks(part.marks)} / 100`} />
      </dl>
      <div className="mt-3">
        <BreakdownBar part={part} />
      </div>
    </div>
  );
}

type SubjectSummaryProps = {
  result: CourseResult;
  /** Extra panels shown at the bottom, such as the final exam target. */
  children?: React.ReactNode;
};

export function SubjectSummary({ result, children }: SubjectSummaryProps) {
  const grade = result.gradeFromMarks;
  const parts = [result.theory, result.lab].filter((p): p is PartResult => p !== null);

  let status: string;
  if (result.percent === null) status = "Enter a mark to see your percentage.";
  else if (result.complete) status = "All marks entered.";
  else status = `Based on the ${Math.round(result.coverage * 100)}% of marks entered so far.`;

  return (
    <aside className="space-y-4 rounded-lg border border-line bg-surface p-5 lg:sticky lg:top-20 lg:max-h-[calc(100dvh-15rem)] lg:overflow-y-auto">
      <div className="flex items-center gap-4">
        <ProgressRing value={result.percent} color={toneColor(result.percent)}>
          <div>
            <p className="text-xl font-semibold tabular-nums">{formatPercent(result.percent)}</p>
            <p className="text-xs text-muted">{grade ? grade.letter : "no grade"}</p>
          </div>
        </ProgressRing>
        <div className="min-w-0 text-sm">
          <p className="font-semibold">{result.complete ? "Result" : "So far"}</p>
          {grade && (
            <p className="tabular-nums">
              {grade.letter} · {grade.points.toFixed(2)} points
            </p>
          )}
          <p className="mt-1 text-xs text-muted">{status}</p>
        </div>
      </div>
      {children}
      {parts.map((part) => (
        <PartSummary key={part.part} part={part} />
      ))}
    </aside>
  );
}
