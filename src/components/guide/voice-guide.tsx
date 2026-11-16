import { Icon } from "@/components/ui/icons";
import { VOICE_COMMAND_GROUPS } from "@/lib/voice/commands";

const HOW_TO = [
  { title: "Open a calculator", text: "The voice bar sits at the bottom of every calculator page." },
  { title: "Tap the mic and speak", text: 'Say one thing at a time, like "quiz 8 out of 10".' },
  { title: "Check the confirmation", text: 'A green line shows what was saved. Say "undo" to take it back.' },
];

const MODES = [
  { name: "Keep Listening", text: 'Tap once and keep talking. Tap again, or say "stop", to finish.' },
  { name: "Hold to Talk", text: "Hold the mic, or Space, while you speak. Let go when done." },
];

/** How to use voice on the left, every command grouped into cards on the right. */
export function VoiceGuide() {
  return (
    <div className="grid gap-5 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
      <div className="card p-5 lg:sticky lg:top-24">
        <div className="flex items-center gap-2">
          <Icon name="mic" size={18} className="text-accent" />
          <h3 className="font-semibold">How to Use Voice</h3>
        </div>
        <ol className="mt-4 space-y-4">
          {HOW_TO.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-semibold text-muted">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-sm text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <h4 className="mt-6 text-xs font-medium text-muted">Two Modes, Pick One in Voice Settings</h4>
        <div className="mt-2 space-y-2">
          {MODES.map((mode) => (
            <div key={mode.name} className="rounded-lg border border-line bg-surface-2/40 px-3 py-2.5">
              <p className="text-sm font-medium">{mode.name}</p>
              <p className="text-sm text-muted">{mode.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-5 border-t border-line pt-4 text-xs text-muted">
          Works in Chrome, Edge and Safari and needs an internet connection for speech. Marks go to
          the subject open on the Internal Marks page. You can also type any command in the voice bar.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {VOICE_COMMAND_GROUPS.map((group) => (
          <section key={group.title} className="card overflow-hidden">
            <header className="flex items-center justify-between border-b border-line bg-surface-2/40 px-4 py-3">
              <h3 className="text-sm font-semibold">{group.title}</h3>
              <span className="text-xs text-muted">
                {group.items.length} command{group.items.length === 1 ? "" : "s"}
              </span>
            </header>
            <ul className="divide-y divide-line">
              {group.items.map(([say, does]) => (
                <li key={say} className="px-4 py-3">
                  <code className="inline-block rounded-md bg-accent/10 px-2 py-0.5 font-mono text-[13px] text-accent">
                    {say}
                  </code>
                  <p className="mt-1.5 text-sm text-muted">{does}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
