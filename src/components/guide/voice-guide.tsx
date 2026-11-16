import { Icon } from "@/components/ui/icons";
import { VOICE_COMMAND_GROUPS } from "@/lib/voice/commands";

const STEPS = [
  { title: "Open a Calculator", text: "The voice bar sits at the bottom of every calculator page." },
  { title: "Tap the Mic and Speak", text: 'Say one thing at a time, like "quiz 8 out of 10".' },
  { title: "Check the Confirmation", text: 'A green line shows what was saved. Say "undo" to take it back.' },
];

const MODES = [
  { name: "Keep Listening", text: 'Tap once and keep talking. Tap again, or say "stop", to finish.' },
  { name: "Hold to Talk", text: "Hold the mic, or Space, while you speak. Let go when done." },
];

const NOTES = [
  "Works in Chrome, Edge and Safari.",
  "Needs an internet connection for speech.",
  "Marks go to the subject open on the Internal Marks page.",
  "Every command can be typed in the voice bar too.",
];

/** Every command in one flat list, tagged with its group. */
const COMMANDS = VOICE_COMMAND_GROUPS.flatMap((group) =>
  group.items.map(([say, does]) => ({ say, does, group: group.title })),
);

/** Steps across the top, then every command in one table, then modes and notes side by side. */
export function VoiceGuide() {
  return (
    <div className="space-y-5">
      <ol className="card grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-3 p-4">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-tone-amber/12 text-[11px] font-semibold text-tone-amber">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium">{step.title}</p>
              <p className="mt-0.5 text-[13px] text-muted">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* One command per line. On narrow phones the table scrolls sideways instead of wrapping. */}
      <section className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] table-fixed text-[13px]">
            <colgroup>
              <col className="w-[36%]" />
              <col className="w-[16%]" />
              <col className="w-[48%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-line bg-surface-2/40 text-left text-xs text-muted">
                <th className="px-4 py-2.5 font-medium">What to Say</th>
                <th className="px-4 py-2.5 font-medium">Group</th>
                <th className="px-4 py-2.5 font-medium">What It Does</th>
              </tr>
            </thead>
            <tbody>
              {COMMANDS.map((c) => (
                <tr key={c.say} className="border-t border-line first:border-t-0 hover:bg-surface-2/30">
                  <td className="truncate px-4 py-2.5" title={c.say}>
                    <code className="font-mono text-accent">&ldquo;{c.say}&rdquo;</code>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="rounded-md border border-line px-1.5 py-0.5 text-[11px] whitespace-nowrap text-muted">
                      {c.group}
                    </span>
                  </td>
                  <td className="truncate px-4 py-2.5 text-muted" title={c.does}>
                    {c.does}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="card p-4">
          <h3 className="text-sm font-semibold">Two Modes</h3>
          <p className="mt-0.5 text-xs text-muted">Switch in the voice bar&apos;s settings.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {MODES.map((mode) => (
              <div key={mode.name} className="rounded-lg border border-line px-3 py-2.5">
                <p className="text-[13px] font-medium">{mode.name}</p>
                <p className="mt-0.5 text-xs text-muted">{mode.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-4">
          <h3 className="text-sm font-semibold">Good to Know</h3>
          <ul className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2">
            {NOTES.map((note) => (
              <li key={note} className="flex items-start gap-2 text-[13px] text-muted">
                <Icon name="check" size={15} className="mt-0.5 shrink-0 text-tone-green" />
                {note}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
