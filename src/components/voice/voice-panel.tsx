"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { buttonClass } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { Select } from "@/components/ui/select";
import { updateData, useAppData } from "@/lib/store";
import type { VoiceMode } from "@/lib/types";
import { runVoiceCommand, undoLastVoiceCommand, type VoiceOutcome } from "@/lib/voice/execute";
import { isSpeechSupported, speechErrorMessage, useSpeechRecognition } from "@/lib/voice/use-speech";
import { VoiceHelp } from "./voice-help";

const LANGUAGES = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "en-IN", label: "English (India)" },
  { value: "en-PK", label: "English (Pakistan)" },
];

const MODES: { value: VoiceMode; label: string }[] = [
  { value: "continuous", label: "Keep Listening" },
  { value: "push-to-talk", label: "Hold to Talk" },
];

type Line = { text: string; kind: "interim" | "ok" | "error" };

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

const iconButton =
  "grid size-8 place-items-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-fg";

/**
 * Voice commands, shown inline under the page title when the header's Voice button is on.
 * One row: mic, what was heard or done, a box to type commands, and small tool buttons.
 */
export function VoicePanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const data = useAppData();
  const { voiceMode: mode, voiceLang: lang } = data.settings;

  const [line, setLine] = useState<Line | null>(null);
  const [typed, setTyped] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const helpRef = useRef<HTMLDialogElement>(null);
  const stopRef = useRef<() => void>(() => {});

  const show = useCallback(
    (outcome: VoiceOutcome) => {
      setLine({ text: outcome.message, kind: outcome.ok ? "ok" : "error" });
      if (outcome.navigate) router.push(outcome.navigate);
      if (outcome.help) helpRef.current?.showModal();
      if (outcome.stop) stopRef.current();
      return outcome.ok;
    },
    [router],
  );

  const { listening, start, stop } = useSpeechRecognition(lang, {
    onFinal: (text) => show(runVoiceCommand(text)),
    onInterim: (text) => setLine({ text, kind: "interim" }),
    onError: (code) => setLine({ text: speechErrorMessage(code), kind: "error" }),
  });

  useEffect(() => {
    stopRef.current = stop;
  }, [stop]);

  // Hold to Talk: hold Space anywhere except while typing in a box.
  useEffect(() => {
    if (mode !== "push-to-talk") return;
    const skip = (e: KeyboardEvent) =>
      e.code !== "Space" ||
      isTypingTarget(e.target) ||
      (e.target instanceof HTMLElement && e.target.dataset.voiceMic !== undefined);
    const down = (e: KeyboardEvent) => {
      if (skip(e) || e.repeat) return;
      e.preventDefault();
      start(false);
    };
    const up = (e: KeyboardEvent) => {
      if (skip(e)) return;
      e.preventDefault();
      stop();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [mode, start, stop]);

  const supported = isSpeechSupported();

  function setMode(value: VoiceMode) {
    stop();
    updateData((d) => {
      d.settings.voiceMode = value;
    });
  }

  function setLang(value: string) {
    stop();
    updateData((d) => {
      d.settings.voiceLang = value;
    });
  }

  const micHandlers =
    mode === "continuous"
      ? { onClick: () => (listening ? stop() : start(true)) }
      : {
          onPointerDown: (e: ReactPointerEvent<HTMLButtonElement>) => {
            if (e.button !== 0) return;
            e.preventDefault();
            e.currentTarget.setPointerCapture(e.pointerId);
            start(false);
          },
          onPointerUp: () => stop(),
          onPointerCancel: () => stop(),
          // Keyboard users (Enter/Space on the button) get a simple on/off toggle instead.
          onClick: (e: ReactMouseEvent) => {
            if (e.detail === 0) {
              if (listening) stop();
              else start(true);
            }
          },
          onContextMenu: (e: ReactMouseEvent) => e.preventDefault(),
        };

  let status: string;
  if (!supported) status = "Voice isn't available in this browser. Type a command instead.";
  else if (listening) status = "Listening…";
  else status = mode === "continuous" ? "Tap the mic to speak" : "Hold the mic or Space to speak";

  return (
    <section aria-label="Voice commands" className="card mb-6 print:hidden">
      <VoiceHelp ref={helpRef} />

      <div className="flex flex-wrap items-center gap-3 p-3 sm:gap-4">
        <span className="relative">
          <button
            type="button"
            data-voice-mic
            disabled={!supported}
            aria-pressed={listening}
            aria-label={listening ? "Stop listening" : mode === "continuous" ? "Start listening" : "Hold to talk"}
            {...micHandlers}
            className={`grid size-10 touch-none select-none place-items-center rounded-full transition-colors disabled:opacity-40 ${
              listening ? "bg-err text-white" : "bg-accent text-on-accent hover:opacity-90"
            }`}
          >
            <Icon name="mic" size={19} />
          </button>
          {listening && (
            <span className="pointer-events-none absolute inset-0 animate-ping rounded-full border-2 border-err/60" />
          )}
        </span>

        <p
          aria-live="polite"
          className={`min-w-0 flex-1 basis-48 truncate text-sm ${
            !line
              ? "text-muted"
              : line.kind === "interim"
                ? "italic text-muted"
                : line.kind === "ok"
                  ? "text-ok"
                  : "text-warn"
          }`}
        >
          {!line ? status : line.kind === "interim" ? `"${line.text}"` : `${line.kind === "ok" ? "✓" : "!"} ${line.text}`}
        </p>

        <form
          className="flex min-w-0 flex-1 basis-72 gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const text = typed.trim();
            if (!text) return;
            if (show(runVoiceCommand(text))) setTyped("");
          }}
        >
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            aria-label="Type a command"
            placeholder="Type a command, e.g. quiz 8 out of 10"
            autoComplete="off"
            spellCheck={false}
            className="field min-w-0 flex-1"
          />
          <button type="submit" className={buttonClass("secondary")}>
            Go
          </button>
        </form>

        <div className="flex shrink-0">
          <button type="button" onClick={() => show(undoLastVoiceCommand())} aria-label="Undo last voice command" title="Undo" className={iconButton}>
            <Icon name="undo" size={16} />
          </button>
          <button type="button" onClick={() => helpRef.current?.showModal()} aria-label="Voice command help" title="What can I say?" className={iconButton}>
            <Icon name="help" size={16} />
          </button>
          <button
            type="button"
            onClick={() => setSettingsOpen((v) => !v)}
            aria-label="Voice settings"
            aria-expanded={settingsOpen}
            title="Voice settings"
            className={`${iconButton} ${settingsOpen ? "bg-surface-2 text-fg" : ""}`}
          >
            <Icon name="settings" size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              stop();
              onClose();
            }}
            aria-label="Close voice panel"
            title="Close"
            className={iconButton}
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      </div>

      {settingsOpen && (
        <div className="flex flex-wrap items-center gap-3 border-t border-line px-3 py-3">
          <div role="radiogroup" aria-label="Voice mode" className="inline-flex rounded-lg border border-line-strong bg-field p-0.5">
            {MODES.map((m) => (
              <button
                key={m.value}
                type="button"
                role="radio"
                aria-checked={mode === m.value}
                onClick={() => setMode(m.value)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  mode === m.value ? "bg-surface-2 text-fg shadow-sm" : "text-muted hover:text-fg"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <Select ariaLabel="Voice language" size="sm" className="w-44" value={lang} onChange={setLang} options={LANGUAGES} />
        </div>
      )}
    </section>
  );
}
