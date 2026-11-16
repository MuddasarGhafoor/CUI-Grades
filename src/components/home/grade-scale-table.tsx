import { CUI_GRADE_SCALE, sortScale, type GradeBand } from "@/lib/grading";

function rangeLabel(sorted: GradeBand[], index: number): string {
  const band = sorted[index];
  if (index === 0) return `${band.min} and above`;
  const upper = sorted[index - 1].min - 1;
  if (band.min === 0) return `Below ${upper + 1}`;
  return band.min === upper ? `${band.min}` : `${band.min}–${upper}`;
}

export function GradeScaleTable({ scale = CUI_GRADE_SCALE }: { scale?: GradeBand[] }) {
  const sorted = sortScale(scale);
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-line text-left text-xs text-muted">
          <th className="py-2 pr-4 font-medium">Grade</th>
          <th className="py-2 pr-4 font-medium">Percentage</th>
          <th className="py-2 text-right font-medium">Points</th>
        </tr>
      </thead>
      <tbody className="tabular-nums">
        {sorted.map((band, i) => (
          <tr key={band.letter} className="border-b border-line last:border-0">
            <td className="py-1.5 pr-4 font-semibold">{band.letter}</td>
            <td className="py-1.5 pr-4 text-muted">{rangeLabel(sorted, i)}</td>
            <td className="py-1.5 text-right">{band.points.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
