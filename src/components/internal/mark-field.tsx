"use client";

import { parseNumber } from "@/lib/calc";
import { handleMarkKeyDown } from "@/lib/focus";
import type { Mark } from "@/lib/types";

/** Plain-language reason a mark is not counted, or null if it is fine or empty. */
export function markProblem(mark: Mark): string | null {
  if (mark.obtained.trim() === "") return null;
  const obtained = parseNumber(mark.obtained);
  const total = parseNumber(mark.total);
  if (obtained === null) return "Not a number";
  if (total === null || total <= 0) return "Check the total";
  if (obtained < 0) return "Can't be negative";
  if (obtained > total) return `More than ${total}`;
  return null;
}

type MarkFieldProps = {
  id?: string;
  /** Read by screen readers and shown on hover, e.g. "Quiz 2". */
  label: string;
  mark: Mark;
  onChange?: (value: string) => void;
  /** Greyed out and not clickable, e.g. quizzes in a lab card. Skipped by Enter/Tab. */
  disabled?: boolean;
};

/**
 * A small "obtained / total" box sized for 2-3 digit marks. The total is fixed text.
 * Hover and focus share one soft style: a tinted border and background, nothing bold.
 */
export function MarkField({ id, label, mark, onChange, disabled = false }: MarkFieldProps) {
  const error = disabled ? null : markProblem(mark);

  return (
    <div
      title={disabled ? undefined : error ? `${label}: ${error}` : label}
      className={`inline-flex h-8 items-center overflow-hidden rounded-md border bg-field text-[13px] transition-colors ${
        disabled
          ? "pointer-events-none border-line opacity-50"
          : error
            ? "border-err"
            : "border-line-strong hover:border-[color-mix(in_srgb,var(--accent)_35%,var(--line-strong))] hover:bg-surface-2/60 focus-within:border-[color-mix(in_srgb,var(--accent)_60%,var(--line-strong))] focus-within:bg-surface-2/60"
      }`}
    >
      <input
        id={id}
        data-mark-input={disabled ? undefined : true}
        disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        inputMode="decimal"
        autoComplete="off"
        placeholder="-"
        value={mark.obtained}
        aria-label={`${label} obtained marks`}
        aria-invalid={error ? true : undefined}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleMarkKeyDown}
        className="h-full w-10 min-w-0 bg-transparent pl-1 text-center tabular-nums outline-none placeholder:text-muted/40 focus:outline-none disabled:cursor-not-allowed"
      />
      <span className="pr-2 text-[11px] tabular-nums text-muted">/{mark.total || "?"}</span>
    </div>
  );
}
