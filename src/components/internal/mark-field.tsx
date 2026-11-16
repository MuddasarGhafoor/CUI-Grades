"use client";

import { parseNumber } from "@/lib/calc";
import { handleMarkKeyDown } from "@/lib/focus";
import type { Mark } from "@/lib/types";

/** Plain-language reason a mark is not counted, or null if it is fine or empty. */
function problem(mark: Mark): string | null {
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
  id: string;
  label: string;
  mark: Mark;
  editingTotal: boolean;
  onChange: (field: keyof Mark, value: string) => void;
};

const inputClass =
  "min-w-0 bg-transparent py-2 tabular-nums outline-none placeholder:text-muted/50";

export function MarkField({ id, label, mark, editingTotal, onChange }: MarkFieldProps) {
  const error = problem(mark);

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-muted">
        {label}
      </label>
      <div
        className={`mt-1 flex h-10 items-center overflow-hidden rounded-lg border bg-field transition-[border-color,box-shadow] duration-150 focus-within:border-accent focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_22%,transparent)] ${
          error ? "border-err" : "border-line-strong hover:border-[color-mix(in_srgb,var(--accent)_35%,var(--line-strong))]"
        }`}
      >
        <input
          id={id}
          data-mark-input
          inputMode="decimal"
          autoComplete="off"
          placeholder="-"
          value={mark.obtained}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange("obtained", e.target.value)}
          onFocus={(e) => e.currentTarget.select()}
          onKeyDown={handleMarkKeyDown}
          className={`${inputClass} w-full pl-3 pr-1 text-right`}
        />
        <span className="shrink-0 px-1 text-sm text-muted">/</span>
        {editingTotal ? (
          <input
            data-mark-input
            inputMode="decimal"
            autoComplete="off"
            value={mark.total}
            aria-label={`${label} total marks`}
            onChange={(e) => onChange("total", e.target.value)}
            onFocus={(e) => e.currentTarget.select()}
            onKeyDown={handleMarkKeyDown}
            className={`${inputClass} h-full w-12 shrink-0 border-l border-line bg-surface-2 px-2 text-center`}
          />
        ) : (
          <span className="w-10 shrink-0 pr-3 text-sm tabular-nums text-muted">{mark.total || "?"}</span>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-err">
          {error}
        </p>
      )}
    </div>
  );
}
