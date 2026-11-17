"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import type { Tone } from "@/lib/tones";
import { VoicePanel } from "./voice-panel";

/** Remembers whether voice was open while moving between calculator pages in this visit. */
let voiceOpenMemory = false;

type CalculatorHeaderProps = {
  title: string;
  tone: Tone;
  /** Extra buttons on the right, before the Voice button (e.g. Save Image). */
  actions?: React.ReactNode;
};

/** Page title with a Voice button; the voice panel opens right under the title, inside the page. */
export function CalculatorHeader({ title, tone, actions }: CalculatorHeaderProps) {
  const [voiceOpen, setVoiceOpen] = useState(() => voiceOpenMemory);

  function toggle(next: boolean) {
    voiceOpenMemory = next;
    setVoiceOpen(next);
  }

  return (
    <>
      <PageHeader
        title={title}
        tone={tone}
        actions={
          <>
            {actions}
            <button
              type="button"
              onClick={() => toggle(!voiceOpen)}
              aria-expanded={voiceOpen}
              className={buttonClass(voiceOpen ? "primary" : "secondary", "sm")}
            >
              <Icon name="mic" size={15} />
              Voice
            </button>
          </>
        }
      />
      {voiceOpen && <VoicePanel onClose={() => toggle(false)} />}
    </>
  );
}
