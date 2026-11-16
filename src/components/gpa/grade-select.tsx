import { Select } from "@/components/ui/select";
import { sortScale, type GradeBand } from "@/lib/grading";

type GradeSelectProps = {
  /** Visible label above the button. Leave out and use ariaLabel for compact rows. */
  label?: string;
  ariaLabel?: string;
  value: string;
  scale: GradeBand[];
  /** Text for the empty option, e.g. "From Marks (B+)" or "Pick a Grade". */
  emptyLabel: string;
  onChange: (letter: string) => void;
  className?: string;
};

export function GradeSelect({ label, ariaLabel, value, scale, emptyLabel, onChange, className = "" }: GradeSelectProps) {
  return (
    <Select
      label={label}
      ariaLabel={ariaLabel}
      value={value}
      onChange={onChange}
      className={className}
      options={[
        { value: "", label: emptyLabel },
        ...sortScale(scale).map((band) => ({
          value: band.letter,
          label: band.letter,
          hint: band.points.toFixed(2),
        })),
      ]}
    />
  );
}
