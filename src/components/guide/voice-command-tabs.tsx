"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { VOICE_COMMAND_GROUPS } from "@/lib/voice/commands";

/** Command groups as tabs, each showing a two-column "Say / What It Does" table. */
export function VoiceCommandTabs() {
  const id = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const group = VOICE_COMMAND_GROUPS[active];
  const count = VOICE_COMMAND_GROUPS.length;

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    let next = active;
    if (e.key === "ArrowRight") next = (active + 1) % count;
    else if (e.key === "ArrowLeft") next = (active - 1 + count) % count;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section className="card overflow-hidden">
      <div role="tablist" aria-label="Voice command groups" className="flex overflow-x-auto border-b border-line px-2">
        {VOICE_COMMAND_GROUPS.map((g, i) => {
          const selected = i === active;
          return (
            <button
              key={g.title}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
              className={`group relative flex h-11 shrink-0 items-center gap-2 px-3 text-[13px] font-medium transition-colors ${
                selected ? "text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {g.title}
              <span
                className={`rounded-md px-1.5 text-[11px] tabular-nums ${
                  selected ? "bg-tone-amber/12 text-tone-amber" : "bg-surface-2 text-muted"
                }`}
              >
                {g.items.length}
              </span>
              <span
                aria-hidden="true"
                className={`absolute inset-x-2 -bottom-px h-0.5 rounded-full transition-[scale,background-color] duration-200 ${
                  selected ? "scale-x-100 bg-tone-amber" : "scale-x-0 bg-line-strong group-hover:scale-x-100"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`}>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-surface-2/40 text-left text-xs text-muted">
              <th className="w-[45%] px-4 py-2 font-medium">Say</th>
              <th className="px-4 py-2 font-medium">What It Does</th>
            </tr>
          </thead>
          <tbody>
            {group.items.map(([say, does]) => (
              <tr key={say} className="border-t border-line align-top">
                <td className="px-4 py-3">
                  <code className="font-mono text-accent">&ldquo;{say}&rdquo;</code>
                </td>
                <td className="px-4 py-3 text-muted">{does}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
