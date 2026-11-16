import { sortScale, type GradeBand } from "@/lib/grading";

type GradeSelectProps = {
  id: string;
  label: string;
  value: string;
  scale: GradeBand[];
  /** Text for the empty option, e.g. "From marks (B+)" or "Pick a grade". */
  emptyLabel: string;
  onChange: (letter: string) => void;
  className?: string;
};

export function GradeSelect({ id, label, value, scale, emptyLabel, onChange, className = "" }: GradeSelectProps) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-9 rounded-md border border-line-strong bg-bg px-2.5 text-sm outline-none focus:border-accent ${className}`}
      >
        <option value="">{emptyLabel}</option>
        {sortScale(scale).map((band) => (
          <option key={band.letter} value={band.letter}>
            {band.letter} · {band.points.toFixed(2)}
          </option>
        ))}
      </select>
    </>
  );
}
