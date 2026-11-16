type Shortcut = {
  keys: string[];
  /** Word shown between keys: "or" for alternatives, "+" for combinations. */
  joiner?: "or" | "+";
  prefix?: string;
  does: string;
};

const SHORTCUTS: Shortcut[] = [
  { keys: ["Enter", "Tab"], joiner: "or", does: "Move to the next mark box" },
  { keys: ["Shift", "Tab"], joiner: "+", does: "Go back one box" },
  { keys: ["Esc"], does: "Close a dropdown or cancel a form" },
  { keys: ["Space"], prefix: "Hold", does: "Talk in Hold to Talk mode, when not typing" },
  { keys: ["↑", "↓"], joiner: "or", does: "Move through dropdown options" },
];

function Keycap({ children }: { children: string }) {
  return (
    <kbd className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-b-[3px] border-line-strong bg-surface-2 px-2 font-mono text-xs font-medium text-fg">
      {children}
    </kbd>
  );
}

export function Shortcuts() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {SHORTCUTS.map((s) => (
        <li key={s.does} className="card flex flex-col gap-4 p-4">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
            {s.prefix && <span className="mr-0.5">{s.prefix}</span>}
            {s.keys.map((key, i) => (
              <span key={key} className="flex items-center gap-1.5">
                {i > 0 && <span>{s.joiner}</span>}
                <Keycap>{key}</Keycap>
              </span>
            ))}
          </div>
          <p className="text-sm text-muted">{s.does}</p>
        </li>
      ))}
    </ul>
  );
}
