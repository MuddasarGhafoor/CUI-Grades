"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icons";
import { LAB_QUIZ_PLACEHOLDER, rowLabel } from "@/lib/assessments";
import { formatMarks, formatPercent } from "@/lib/format";
import { gradeForPercent, type Grade, type GradeBand } from "@/lib/grading";
import {
  finalTargets,
  neededMarks,
  projectedPercent,
  type TargetEntry,
  type TargetPart,
  type TargetRow,
} from "@/lib/target";
import { TONE_CLASS, gradeTone } from "@/lib/tones";
import type { Course } from "@/lib/types";

type FinalTargetProps = {
  course: Course;
  scale: GradeBand[];
};

type Difficulty = "easy" | "stretch" | "hard";

/** One figure in the target summary: exact percentage, its grade and GPA points, and what it rounds to. */
function Figure({ label, hint, percent, grade, primary = false }: {
  label: string;
  hint: string;
  percent: number;
  grade: Grade;
  primary?: boolean;
}) {
  const tone = TONE_CLASS[gradeTone(grade.letter) ?? "rose"];
  return (
    <div
      className={`flex items-center justify-between gap-4 px-4 py-3.5 ${primary ? "bg-surface-2/40" : ""}`}
      title={hint}
    >
      {/* Left: what it is, the exact percentage, and what CUI rounds it to. */}
      <div className="min-w-0">
        <p className={`text-xs ${primary ? "font-medium text-fg" : "text-muted"}`}>{label}</p>
        <p className={`mt-1 font-semibold leading-none tabular-nums ${primary ? "text-2xl" : "text-xl"}`}>
          {formatPercent(percent, 2)}
        </p>
        <p className="mt-1.5 text-[11px] text-muted">Rounds to {grade.roundedPercent}%</p>
      </div>

      {/* Right, behind a divider: the grade that percentage gives, and its GPA points. */}
      <div className="flex shrink-0 flex-col items-end justify-center self-stretch border-l border-line pl-4 text-right">
        <p className={`font-display leading-none ${primary ? "text-4xl" : "text-3xl"} ${tone.text}`}>{grade.letter}</p>
        <p className="mt-1.5 text-[11px] text-muted">
          <span className="text-[13px] font-semibold tabular-nums text-fg">{grade.points.toFixed(2)}</span> GPA
        </p>
      </div>
    </div>
  );
}

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

/** Plan rows: name cell, then the chips cell behind a divider (stacked on phones). */
const PLAN_ROW = "grid grid-cols-1 sm:grid-cols-[7rem_minmax(0,1fr)]";
const PLAN_NAME = "flex items-center px-3 pt-2 text-[13px] sm:py-2";
const PLAN_CHIPS = "flex flex-wrap items-center gap-1.5 px-3 pb-2 pt-1.5 sm:border-l sm:border-line sm:py-2";

/** Theory or lab as a framed mini-table, styled like the marks cards above. */
function PartPlan({ part, row }: { part: TargetPart; row: TargetRow | null }) {
  const isLab = part.part === "lab";
  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <h4 className="border-b border-line bg-surface-2/40 px-3 py-1.5 text-[13px] font-semibold">
        {isLab ? "Lab" : "Theory"}
      </h4>
      <div className="divide-y divide-line">
        {isLab && (
          <div className={`${PLAN_ROW} opacity-50`} aria-disabled="true">
            <span className={`${PLAN_NAME} text-muted`}>{LAB_QUIZ_PLACEHOLDER.label}</span>
            <span className={PLAN_CHIPS}>
              {Array.from({ length: LAB_QUIZ_PLACEHOLDER.count }, (_, i) => (
                <span key={i} className={`${CHIP} border border-line text-muted`}>
                  -<span className="text-[11px]">/{LAB_QUIZ_PLACEHOLDER.total}</span>
                </span>
              ))}
            </span>
          </div>
        )}
        {part.components.map(({ def, entries }) => (
          <div key={def.key} className={PLAN_ROW}>
            <span className={PLAN_NAME}>{rowLabel(def)}</span>
            <span className={PLAN_CHIPS}>
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

  const projected = projectedPercent(target, row);
  const projectedGrade = gradeForPercent(projected, scale);

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

      {/* Band 1, totals: exact percentage, what CUI rounds it to, the grade and GPA it gives. */}
      {target.complete ? (
        <div className="border-b border-line bg-surface-2/20">
          <Figure
            primary
            label="Final Total"
            hint="All marks are in"
            percent={target.currentPercent}
            grade={target.currentGrade}
          />
        </div>
      ) : (
        <div className="grid divide-y divide-line border-b border-line bg-surface-2/20 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <Figure
            label="Earned So Far"
            hint="Your marks so far, with every empty box counted as 0"
            percent={target.currentPercent}
            grade={target.currentGrade}
          />
          <Figure
            primary
            label={row ? `Total With ${row.band.letter} Targets` : "Total With Targets"}
            hint="If every empty box gets the mark shown below"
            percent={projected}
            grade={projectedGrade}
          />
          <Figure
            label="Best Possible"
            hint="Full marks in every empty box"
            percent={target.maxPercent}
            grade={target.maxGrade}
          />
        </div>
      )}

      {/* Band 2, the plan: heading and legend, the explanation, then theory and lab. */}
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <h3 className="text-[13px] font-semibold">{target.complete ? "Your Marks" : "What Each Box Needs"}</h3>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-3 rounded-sm bg-surface-2" /> Your mark
            </span>
            {!target.complete && (
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-3 rounded-sm border border-dashed border-line-strong" /> Needed
              </span>
            )}
          </p>
        </div>

        <p className="rounded-lg border border-line bg-surface-2/40 px-3 py-2 text-[13px] text-muted">{message}</p>

        <div className={`grid gap-3 ${target.parts.length > 1 ? "lg:grid-cols-2" : ""}`}>
          {target.parts.map((part) => (
            <PartPlan key={part.part} part={part} row={target.complete ? null : row} />
          ))}
        </div>
      </div>
    </section>
  );
}
