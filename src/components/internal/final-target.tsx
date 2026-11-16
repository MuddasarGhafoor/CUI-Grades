"use client";

import { useState } from "react";
import type { CourseResult } from "@/lib/calc";
import { formatMarks, formatPercent } from "@/lib/format";
import type { GradeBand } from "@/lib/grading";
import { finalTargets, type TargetRow } from "@/lib/target";
import type { Course } from "@/lib/types";

type FinalTargetProps = {
  course: Course;
  result: CourseResult;
  scale: GradeBand[];
};

const finalName = (part: string) => (part === "theory" ? "final" : "lab final");

function Needed({ row }: { row: TargetRow }) {
  return (
    <span>
      {row.needed.map((n, i) => (
        <span key={n.part}>
          {i > 0 && " and "}
          <span className="font-semibold text-fg">
            {formatMarks(n.marks)} / {formatMarks(n.total)}
          </span>{" "}
          in the {finalName(n.part)}
        </span>
      ))}
    </span>
  );
}

/** Pick a grade, see the final exam marks it needs. Hidden once every final is entered. */
export function FinalTarget({ course, result, scale }: FinalTargetProps) {
  const target = finalTargets(course, result, scale);
  const [picked, setPicked] = useState<string | null>(null);
  if (!target) return null;

  const best = target.rows.find((r) => r.status !== "out-of-reach") ?? null;
  const pass = target.rows.at(-1) ?? null;
  const row = target.rows.find((r) => r.band.letter === picked) ?? best ?? target.rows[0];
  const selectId = `${course.id}-target`;

  let answer: React.ReactNode;
  if (!row) answer = null;
  else if (row.status === "secured") {
    answer = (
      <>
        <span className="font-semibold text-ok">Already secured.</span> Even 0 in the{" "}
        {target.unknownFinals.length > 1 ? "finals" : finalName(target.unknownFinals[0].part)} keeps{" "}
        {row.band.letter}.
      </>
    );
  } else if (row.status === "out-of-reach") {
    answer = (
      <>
        <span className="font-semibold text-err">Out of reach.</span> Full marks would give{" "}
        {formatPercent(target.maxPercent)}, a {target.maxGrade.letter}.
      </>
    );
  } else {
    answer = (
      <>
        You need <Needed row={row} />.
      </>
    );
  }

  return (
    <div className="border-t border-line pt-4">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={selectId} className="text-sm font-semibold">
          Final exam target
        </label>
        <select
          id={selectId}
          value={row?.band.letter ?? ""}
          onChange={(e) => setPicked(e.target.value)}
          className="h-8 rounded-md border border-line-strong bg-bg px-2 text-sm outline-none focus:border-accent"
        >
          {target.rows.map((r) => (
            <option key={r.band.letter} value={r.band.letter}>
              {r.band.letter}
              {r.status === "out-of-reach" ? " (out of reach)" : ""}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-2 text-sm text-muted">{answer}</p>

      <dl className="mt-3 space-y-1 text-xs text-muted">
        <div className="flex justify-between gap-3">
          <dt>Best grade still possible</dt>
          <dd className="font-semibold text-fg">{best ? best.band.letter : "none"}</dd>
        </div>
        {pass && (
          <div className="flex justify-between gap-3">
            <dt>To pass ({pass.band.letter})</dt>
            <dd className="text-right tabular-nums text-fg">
              {pass.status === "secured"
                ? "secured"
                : pass.status === "out-of-reach"
                  ? "out of reach"
                  : pass.needed.map((n) => `${formatMarks(n.marks)}/${formatMarks(n.total)}`).join(" and ")}
            </dd>
          </div>
        )}
      </dl>

      {(target.unknownFinals.length > 1 || target.missingInternal) && (
        <ul className="mt-3 space-y-1 text-xs text-muted">
          {target.unknownFinals.length > 1 && <li>Assumes the same percentage in both finals.</li>}
          {target.missingInternal && <li>Internal marks you haven&apos;t entered count as 0 here.</li>}
        </ul>
      )}
    </div>
  );
}
