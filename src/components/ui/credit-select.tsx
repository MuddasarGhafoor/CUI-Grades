type CreditSelectProps = {
  id: string;
  label: string;
  value: number;
  max: number;
  /** Stops a subject from ending up with 0 theory and 0 lab credits. */
  disableZero?: boolean;
  onChange: (value: number) => void;
};

export function CreditSelect({ id, label, value, max, disableZero, onChange }: CreditSelectProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-muted">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 h-9 rounded-md border border-line-strong bg-bg px-2.5 text-sm outline-none focus:border-accent"
      >
        {Array.from({ length: max + 1 }, (_, n) => (
          <option key={n} value={n} disabled={n === 0 && disableZero}>
            {n} {n === 1 ? "credit" : "credits"}
          </option>
        ))}
      </select>
    </div>
  );
}
