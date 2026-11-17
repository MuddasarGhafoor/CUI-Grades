"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icons";
import { LAB_QUIZ_PLACEHOLDER, rowLabel } from "@/lib/assessments";
import { formatMarks, formatPercent } from "@/lib/format";
import type { GradeBand } from "@/lib/grading";
import { finalTargets, neededMarks, type TargetEntry, type TargetPart, type TargetRow } from "@/lib/target";
import type { Course } from "@/lib/types";

type FinalTargetProps = {
  course: Course;
  scale: GradeBand[];
};

type Difficulty = "easy" | "stretch" | "hard";

/** How hard the score needed in the empty boxes is. */
function difficulty(row: TargetRow): Difficulty {
  if (row.x <= 0.7) return "easy";
  if (row.x <= 0.9) return "stretch";
  return "hard";
}

const DIFFICULTY_TEXT: Record<Difficulty, string> = {
  easy: "text-tone-green",
  stretch: "text-tone-amber",
  hard: "text-tone-rose",
};

const DIFFICULTY_CHIP: Record<Difficulty, string> = {
  easy: "border-tone-green/50 text-tone-green",
  stretch: "border-tone-amber/50 text-tone-amber",
  hard: "border-tone-rose/50 text-tone-rose",
};

const CHIP = "inline-flex h-7 min-w-14 items-center justify-center rounded-md px-2 text-[13px] tabular-nums";

/** One box: your mark if filled, the mark needed if empty. */
function Chip({ entry, row }: { entry: TargetEntry; row: TargetRow | null }) {
  const total = <span className="text-[11px] font-normal text-muted">/{formatMarks(entry.total)}</span>;

  if (entry.state === "done") {
    return (
      <span className={`${CHIP} bg-surface-2 font-semibold`} title="Your mark">
        {formatMarks(entry.obtained)}
        {total}
      </span>
    );
  }
  if (entry.state === "invalid") {
    return (
      <span className={`${CHIP} border border-err text-err`} title="This mark isn't counted. Fix it above.">
        !{total}
      </span>
    );
  }
  // Empty box: show what it needs, or "-" when anything will do.
  if (!row || row.status !== "possible") {
    return (
      <span className={`${CHIP} border border-dashed border-line-strong text-muted`} title="Still to come">
        -{total}
      </span>
    );
  }
  return (
    <span className={`${CHIP} border border-dashed font-semibold ${DIFFICULTY_CHIP[difficulty(row)]}`} title="Needed">
      {formatMarks(neededMarks(row, entry.total))}
      {total}
    </span>
  );
}

const ROW = "grid grid-cols-[minmax(0,1fr)] gap-y-1.5 py-2 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-center";

function PartPlan({ part, row }: { part: TargetPart; row: TargetRow | null }) {
  const isLab = part.part === "lab";
  return (
    <div className="rounded-lg border border-line px-3 py-1">
      <h3 className="border-b border-line py-2 text-[13px] font-semibold">{isLab ? "Lab" : "Theory"}</h3>
      <div className="divide-y divide-line">
        {isLab && (
          <div className={`${ROW} opacity-50`} aria-disabled="true">
            <span className="text-[13px] text-muted">{LAB_QUIZ_PLACEHOLDER.label}</span>
            <span className="flex flex-wrap gap-1.5">
              {Array.from({ length: LAB_QUIZ_PLACEHOLDER.count }, (_, i) => (
                <span key={i} className={`${CHIP} border border-line text-muted`}>
                  -<span className="text-[11px]">/{LAB_QUIZ_PLACEHOLDER.total}</span>
                </span>
              ))}
            </span>
          </div>
        )}
        {part.components.map(({ def, entries }) => (
          <div key={def.key} className={ROW}>
            <span className="text-[13px]">{rowLabel(def)}</span>
            <span className="flex flex-wrap gap-1.5">
              {entries.map((entry, i) => (
                <Chip key={i} entry={entry} row={row} />
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Live target: every box of every assessment, filled ones with your marks and empty ones with
 * what they need for the chosen grade. Grades out of reach are locked and the choice moves down.
 * It never hides: once everything is filled in, it shows the grade you got.
 */
export function FinalTarget({ course, scale }: FinalTargetProps) {
  const target = finalTargets(course, scale);
  const [picked, setPicked] = useState<string | null>(null);
  if (!target) return null;

  const selectable = (r: TargetRow) => r.status !== "out-of-reach";
  // Keep the student's pick while it is reachable; otherwise fall to the best grade that still is.
  const row =
    target.rows.find((r) => r.band.letter === picked && selectable(r)) ?? target.rows.find(selectable) ?? null;

  let message: React.ReactNode;
  if (target.complete) {
    message = (
      <>
        All marks are in. Your result is{" "}
        <span className="font-semibold text-fg">{formatPercent(target.currentPercent)}</span>, which is{" "}
        <span className="font-semibold text-fg">{target.currentGrade.letter}</span>.
      </>
    );
  } else if (!row) {
    message = (
      <>
        Even full marks in every empty box gives {formatPercent(target.maxPercent)}, which is{" "}
        <span className="font-semibold text-fg">{target.maxGrade.letter}</span>.
      </>
    );
  } else if (row.status === "secured") {
    message = (
      <>
        <span className="font-semibold text-tone-green">{row.band.letter} is already yours</span>, whatever you
        score in the {target.remaining} empty {target.remaining === 1 ? "box" : "boxes"}.
      </>
    );
  } else {
    message = (
      <>
        For <span className="font-semibold text-fg">{row.band.letter}</span>, score at least{" "}
        <span className={`font-semibold ${DIFFICULTY_TEXT[difficulty(row)]}`}>{Math.ceil(row.x * 100)}%</span> in
        each of the {target.remaining} empty {target.remaining === 1 ? "box" : "boxes"}.
      </>
    );
  }

  return (
    <section aria-label="Target grade" className="card overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <h2 className="text-sm font-semibold">Target Grade</h2>
        <div role="radiogroup" aria-label="Choose a target grade" className="flex flex-wrap justify-end gap-1">
          {target.rows.map((r) => {
            const selected = row?.band.letter === r.band.letter;
            const locked = !selectable(r);
            return (
              <button
                key={r.band.letter}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={locked}
                onClick={() => setPicked(r.band.letter)}
                title={
                  locked
                    ? target.complete
                      ? "All marks are in"
                      : "Not reachable with the marks so far"
                    : r.status === "secured" || r.status === "achieved"
                      ? "Secured"
                      : `Needs ${Math.ceil(r.x * 100)}% in every empty box`
                }
                className={`flex h-8 min-w-10 items-center justify-center gap-1 rounded-md border px-2 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
                  selected
                    ? "border-[color-mix(in_srgb,var(--accent)_60%,var(--line-strong))] bg-surface-2 text-fg"
                    : "border-line text-muted enabled:hover:bg-surface-2/60 enabled:hover:text-fg"
                }`}
              >
                {r.band.letter}
                {(r.status === "secured" || r.status === "achieved") && (
                  <Icon name="check" size={12} className="text-tone-green" />
                )}
              </button>
            );
          })}
        </div>
      </header>

      <div className={`grid gap-3 p-4 ${target.parts.length > 1 ? "lg:grid-cols-2" : ""}`}>
        {target.parts.map((part) => (
          <PartPlan key={part.part} part={part} row={target.complete ? null : row} />
        ))}
      </div>

      {/* Footer: what the chips mean on the left, what the chosen grade needs on the right. */}
      <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line px-4 py-2.5">
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-sm bg-surface-2" /> Your mark
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-sm border border-dashed border-line-strong" /> Needed
          </span>
        </p>
        <p className="text-right text-[13px] text-muted">{message}</p>
      </footer>
    </section>
  );
}
