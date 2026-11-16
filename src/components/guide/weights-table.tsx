import {
  INTERNAL_OUT_OF,
  LAB_COMPONENTS,
  THEORY_COMPONENTS,
  type ComponentDef,
} from "@/lib/assessments";

function prefilled(def: ComponentDef): string {
  return def.kind === "list" ? `${def.defaultCount} × ${def.defaultTotal}` : `${def.defaultTotal}`;
}

/** One part (theory or lab) in its own bordered block, so the two never run together. */
function Group({ title, defs }: { title: string; defs: ComponentDef[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <div className="flex items-center justify-between border-b border-line bg-surface-2/60 px-3 py-2">
        <h3 className="flex items-center gap-2 text-[13px] font-semibold">
          <span aria-hidden="true" className={`size-2 rounded-full ${title === "Theory" ? "bg-tone-blue" : "bg-tone-violet"}`} />
          {title}
        </h3>
        <span className="text-xs text-muted">100% of the {title.toLowerCase()} part</span>
      </div>
      {/* Fixed layout with the same column widths in both tables, so Theory and Lab line up. */}
      <table className="w-full table-fixed text-[13px]">
        <colgroup>
          <col className="w-[50%]" />
          <col className="w-[30%]" />
          <col className="w-[20%]" />
        </colgroup>
        <thead>
          <tr className="text-left text-xs text-muted">
            <th className="px-3 pb-1 pt-2 font-medium">Assessment</th>
            <th className="px-3 pb-1 pt-2 font-medium">Pre-filled Out Of</th>
            <th className="px-3 pb-1 pt-2 text-right font-medium">Weight</th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {defs.map((def) => (
            <tr key={def.key} className="border-t border-line">
              <td className="px-3 py-1.5">{def.label}</td>
              <td className="px-3 py-1.5 text-muted">{prefilled(def)}</td>
              <td className="px-3 py-1.5 text-right font-medium">{def.weight}%</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-line bg-surface-2/30 text-xs text-muted">
            <td className="px-3 py-1.5" colSpan={2}>
              Internal Marks (Before the Final)
            </td>
            <td className="px-3 py-1.5 text-right font-medium text-fg">{INTERNAL_OUT_OF}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export function WeightsTable() {
  return (
    <div className="space-y-4">
      <Group title="Theory" defs={THEORY_COMPONENTS} />
      <Group title="Lab" defs={LAB_COMPONENTS} />
    </div>
  );
}
