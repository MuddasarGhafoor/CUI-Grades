import {
  INTERNAL_OUT_OF,
  LAB_COMPONENTS,
  THEORY_COMPONENTS,
  type ComponentDef,
} from "@/lib/assessments";

function prefilled(def: ComponentDef): string {
  return def.kind === "list" ? `${def.defaultCount} × ${def.defaultTotal}` : `${def.defaultTotal}`;
}

function Group({ title, defs }: { title: string; defs: ComponentDef[] }) {
  return (
    <tbody className="tabular-nums">
      <tr>
        <th colSpan={3} className="pb-1 pt-4 text-left text-xs font-semibold text-fg">
          {title}
        </th>
      </tr>
      {defs.map((def) => (
        <tr key={def.key} className="border-b border-line">
          <td className="py-1.5 pr-4">{def.label}</td>
          <td className="py-1.5 pr-4 text-muted">{prefilled(def)}</td>
          <td className="py-1.5 text-right">{def.weight}%</td>
        </tr>
      ))}
      <tr className="text-muted">
        <td className="py-1.5 pr-4 text-xs" colSpan={2}>
          Internal Marks (Before the Final)
        </td>
        <td className="py-1.5 text-right text-xs">{INTERNAL_OUT_OF}</td>
      </tr>
    </tbody>
  );
}

export function WeightsTable() {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-line text-left text-xs text-muted">
          <th className="py-2 pr-4 font-medium">Assessment</th>
          <th className="py-2 pr-4 font-medium">Pre-filled Out Of</th>
          <th className="py-2 text-right font-medium">Weight</th>
        </tr>
      </thead>
      <Group title="Theory" defs={THEORY_COMPONENTS} />
      <Group title="Lab" defs={LAB_COMPONENTS} />
    </table>
  );
}
