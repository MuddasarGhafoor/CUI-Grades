import { StatGrid } from "@/components/ui/stat-grid";
import type { TimelinePoint } from "@/lib/calc";
import { formatGpa, formatMarks } from "@/lib/format";

type CgpaSummaryProps = {
  points: TimelinePoint[];
  includesCurrent: boolean;
};

export function CgpaSummary({ points, includesCurrent }: CgpaSummaryProps) {
  const last = points.at(-1) ?? null;
  const previous = points.at(-2) ?? null;
  const credits = points.reduce((sum, p) => sum + p.credits, 0);
  const change = last && previous ? last.cgpa - previous.cgpa : null;

  const note =
    last === null
      ? "Add a semester to see your CGPA."
      : includesCurrent
        ? "Includes this semester from the GPA page."
        : "Past semesters only.";

  return (
    <StatGrid
      label="CGPA"
      stats={[
        { label: "CGPA", value: formatGpa(last?.cgpa ?? null), note, primary: true, valueClassName: "text-tone-violet" },
        {
          label: "Credit Hours",
          value: formatMarks(credits),
          note: `${points.length} semester${points.length === 1 ? "" : "s"} counted`,
        },
        {
          label: "Change After Last Semester",
          value: change === null ? "-" : `${change >= 0 ? "+" : "-"}${Math.abs(change).toFixed(2)}`,
          valueClassName: change === null ? "" : change > 0.004 ? "text-ok" : change < -0.004 ? "text-err" : "",
        },
      ]}
    />
  );
}
