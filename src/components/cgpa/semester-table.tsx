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

const inputClass = (invalid: boolean) => `field w-full min-w-0 px-2.5 ${invalid ? "border-err" : ""}`;

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
    <section className="card px-4 sm:px-5">
      <header className="-mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:-mx-5 sm:px-5">
        <h2 className="text-[15px] font-semibold">Semesters</h2>
        <div className="flex gap-2">
          {semesters.length === 0 && (
            <button
              type="button"
              onClick={() => addSemester("Earlier Semesters")}
              className={buttonClass("ghost", "sm")}
            >
              Add CGPA So Far
            </button>
          )}
          <button type="button" onClick={() => addSemester(nextLabel)} className={buttonClass("secondary", "sm")}>
            + Add Semester
          </button>
        </div>
      </header>

      <div className={`${COLS} pb-1 pt-3 text-xs font-medium text-muted`}>
        <span>Semester</span>
        <span>GPA</span>
        <span>Credits</span>
        <span className="text-right">CGPA</span>
        <span />
      </div>

      {semesters.length === 0 && (
        <p className="py-3 text-sm text-muted">
          No semesters yet.
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

      <div className={`${COLS} -mx-4 mt-2 border-t border-line bg-surface-2/40 px-4 py-3 text-sm sm:-mx-5 sm:px-5`}>
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
            This Semester{" "}
            <Link href="/gpa-calculator" className="text-xs text-accent hover:underline">
              (GPA Page)
            </Link>
          </span>
        </label>
        {current.gpa === null ? (
          <span className="col-span-3 text-right text-xs text-muted">No Grades Yet</span>
        ) : (
          <>
            <span className="pr-2.5 text-right tabular-nums">{formatGpa(current.gpa)}</span>
            <span className="pr-2.5 text-right tabular-nums">{current.credits}</span>
            <span className="text-right font-semibold tabular-nums">
              {includeCurrent ? formatGpa(cgpaAfter.get(currentId) ?? null) : "-"}
            </span>
          </>
        )}
        <span />
      </div>
    </section>
  );
}
