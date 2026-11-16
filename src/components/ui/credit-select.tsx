import { Select } from "./select";

type CreditSelectProps = {
  label: string;
  value: number;
  max: number;
  /** Stops a subject from ending up with 0 theory and 0 lab credits. */
  disableZero?: boolean;
  onChange: (value: number) => void;
};

const creditLabel = (n: number) => `${n} ${n === 1 ? "Credit" : "Credits"}`;

export function CreditSelect({ label, value, max, disableZero, onChange }: CreditSelectProps) {
  return (
    <Select
      label={label}
      value={value}
      onChange={onChange}
      className="w-32"
      options={Array.from({ length: max + 1 }, (_, n) => ({
        value: n,
        label: creditLabel(n),
        disabled: n === 0 && disableZero,
      }))}
    />
  );
}
