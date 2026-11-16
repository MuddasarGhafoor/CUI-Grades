import { VOICE_COMMAND_GROUPS } from "@/lib/voice/commands";

/** Every voice command with an example, grouped. Used in the voice help dialog and the Guide. */
export function VoiceCommandList({ columns = false }: { columns?: boolean }) {
  return (
    <div className={columns ? "grid gap-x-8 gap-y-6 md:grid-cols-2" : "space-y-5"}>
      {VOICE_COMMAND_GROUPS.map((group) => (
        <section key={group.title}>
          <h3 className="text-sm font-semibold">{group.title}</h3>
          <dl className="mt-2 divide-y divide-line rounded-lg border border-line text-sm">
            {group.items.map(([say, does]) => (
              <div key={say} className="grid gap-0.5 px-3 py-2">
                <dt>
                  <code className="font-mono text-[13px] text-accent">{say}</code>
                </dt>
                <dd className="text-muted">{does}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
