"use client";

import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { parseNumber, type GpaResult, type TimelinePoint } from "@/lib/calc";
import { handleMarkKeyDown } from "@/lib/focus";
import { formatGpa } from "@/lib/format";
import { addSemester, removeSemester, updateData, updateSemester } from "@/lib/store";
import type { Semester } from "@/lib/types";

const COLS = "grid grid-cols-[minmax(0,1fr)_4.25rem_4.25rem_3.25rem_2rem] items-center gap-2";

const inputClass = (invalid: boolean) =>
  `h-9 w-full min-w-0 rounded-md border bg-bg px-2.5 text-sm outline-none focus:border-accent ${
    invalid ? "border-err" : "border-line-strong"
  }`;

function gpaInvalid(value: string) {
  if (value.trim() === "") return false;
  const n = parseNumber(value);
  return n === null || n < 0 || n > 4;
}

function creditsInvalid(value: string) {
  if (value.trim() === "") return false;
  const n = parseNumber(value);
  return n === null || n <= 0;
}

type SemesterTableProps = {
  semesters: Semester[];
  timeline: TimelinePoint[];
  current: GpaResult;
  currentId: string;
  includeCurrent: boolean;
};

export function SemesterTable({ semesters, timeline, current, currentId, includeCurrent }: SemesterTableProps) {
  const cgpaAfter = new Map(timeline.map((p) => [p.id, p.cgpa]));
  const nextLabel = `Semester ${semesters.length + 1}`;

  return (
    <section className="rounded-lg border border-line bg-surface px-4 sm:px-5">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-3">
        <h2 className="font-semibold">Semesters</h2>
        <div className="flex gap-2">
          {semesters.length === 0 && (
            <button
              type="button"
              onClick={() => addSemester("Earlier semesters")}
              className={buttonClass("ghost", "sm")}
            >
              I only know my CGPA so far
            </button>
          )}
          <button type="button" onClick={() => addSemester(nextLabel)} className={buttonClass("secondary", "sm")}>
            + Add semester
          </button>
        </div>
      </header>

      <div className={`${COLS} pb-1 pt-3 text-xs text-muted`}>
        <span>Semester</span>
        <span>GPA</span>
        <span>Credits</span>
        <span className="text-right">CGPA</span>
        <span />
      </div>

      {semesters.length === 0 && (
        <p className="py-3 text-sm text-muted">
          Add each finished semester with its GPA and credit hours. If you only know your current
          CGPA, add one row with that CGPA and your total credit hours so far.
        </p>
      )}

      <ul>
        {semesters.map((s) => {
          const badGpa = gpaInvalid(s.gpa);
          const badCredits = creditsInvalid(s.credits);
          return (
            <li key={s.id} className={`${COLS} py-1.5`}>
              <input
                data-mark-input
                aria-label="Semester name"
                autoComplete="off"
                value={s.label}
                onChange={(e) => {
                  const label = e.target.value;
                  updateSemester(s.id, (x) => {
                    x.label = label;
                  });
                }}
                onKeyDown={handleMarkKeyDown}
                className={inputClass(false)}
              />
              <input
                data-mark-input
                aria-label={`${s.label} GPA`}
                aria-invalid={badGpa || undefined}
                inputMode="decimal"
                autoComplete="off"
                placeholder="3.50"
                value={s.gpa}
                onChange={(e) => {
                  const gpa = e.target.value;
                  updateSemester(s.id, (x) => {
                    x.gpa = gpa;
                  });
                }}
                onFocus={(e) => e.currentTarget.select()}
                onKeyDown={handleMarkKeyDown}
                className={`${inputClass(badGpa)} text-right tabular-nums`}
              />
              <input
                data-mark-input
                aria-label={`${s.label} credit hours`}
                aria-invalid={badCredits || undefined}
                inputMode="decimal"
                autoComplete="off"
                placeholder="18"
                value={s.credits}
                onChange={(e) => {
                  const credits = e.target.value;
                  updateSemester(s.id, (x) => {
                    x.credits = credits;
                  });
                }}
                onFocus={(e) => e.currentTarget.select()}
                onKeyDown={handleMarkKeyDown}
                className={`${inputClass(badCredits)} text-right tabular-nums`}
              />
              <span className="text-right text-sm font-semibold tabular-nums">
                {formatGpa(cgpaAfter.get(s.id) ?? null)}
              </span>
              <button
                type="button"
                onClick={() => removeSemester(s.id)}
                aria-label={`Remove ${s.label}`}
                className="grid size-8 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-err"
              >
                <Icon name="close" size={16} />
              </button>
            </li>
          );
        })}
      </ul>

      <div className={`${COLS} mt-1 border-t border-line py-3 text-sm`}>
        <label className="flex min-w-0 items-center gap-2">
          <input
            type="checkbox"
            checked={includeCurrent}
            onChange={(e) => {
              const checked = e.target.checked;
              updateData((d) => {
                d.settings.includeCurrentSemester = checked;
              });
            }}
            className="size-4 accent-[var(--accent)]"
          />
          <span className="truncate">
            This semester{" "}
            <Link href="/gpa-calculator" className="text-xs text-accent hover:underline">
              (GPA page)
            </Link>
          </span>
        </label>
        {current.gpa === null ? (
          <span className="col-span-3 text-right text-xs text-muted">no grades yet</span>
        ) : (
          <>
            <span className="pr-2.5 text-right tabular-nums">{formatGpa(current.gpa)}</span>
            <span className="pr-2.5 text-right tabular-nums">{current.credits}</span>
            <span className="text-right font-semibold tabular-nums">
              {includeCurrent ? formatGpa(cgpaAfter.get(currentId) ?? null) : "–"}
            </span>
          </>
        )}
        <span />
      </div>
    </section>
  );
}
