import { Icon } from "@/components/ui/icons";
import { VoiceCommandTabs } from "./voice-command-tabs";

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

/** Steps across the top, then the command browser with modes and notes beside it. */
export function VoiceGuide() {
  return (
    <div className="space-y-5">
      <ol className="card grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-3 p-4">
            <span className="grid size-6 shrink-0 place-items-center rounded-full border border-accent/40 text-[11px] font-semibold text-accent">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium">{step.title}</p>
              <p className="mt-0.5 text-[13px] text-muted">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <VoiceCommandTabs />

        <div className="space-y-5">
          <section className="card p-4">
            <h3 className="text-sm font-semibold">Two Modes</h3>
            <p className="mt-0.5 text-xs text-muted">Switch in the voice bar&apos;s settings.</p>
            <div className="mt-3 space-y-2">
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
            <ul className="mt-3 space-y-2">
              {NOTES.map((note) => (
                <li key={note} className="flex items-start gap-2 text-[13px] text-muted">
                  <Icon name="check" size={15} className="mt-0.5 shrink-0 text-accent" />
                  {note}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
