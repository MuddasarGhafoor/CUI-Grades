"use client";

import { usePathname, useRouter } from "next/navigation";
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
import { updateData, useAppData } from "@/lib/store";
import type { VoiceMode } from "@/lib/types";
import { useIsClient } from "@/lib/use-is-client";
import { runVoiceCommand, undoLastVoiceCommand, type VoiceOutcome } from "@/lib/voice/execute";
import { isSpeechSupported, speechErrorMessage, useSpeechRecognition } from "@/lib/voice/use-speech";
import { VoiceHelp } from "./voice-help";

const VOICE_PAGES = ["/internal-marks", "/gpa-calculator", "/cgpa-calculator"];

const LANGUAGES = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "en-IN", label: "English (India)" },
  { value: "en-PK", label: "English (Pakistan)" },
];

const MODES: { value: VoiceMode; label: string }[] = [
  { value: "continuous", label: "Keep listening" },
  { value: "push-to-talk", label: "Hold to talk" },
];

type Heard = { text: string; interim: boolean };
type Feedback = { ok: boolean; text: string };

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

export function VoiceDock() {
  const pathname = usePathname();
  const router = useRouter();
  const isClient = useIsClient();
  const data = useAppData();
  const { voiceMode: mode, voiceLang: lang } = data.settings;
  const visible = VOICE_PAGES.some((page) => pathname.startsWith(page));

  const [heard, setHeard] = useState<Heard | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [typed, setTyped] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const helpRef = useRef<HTMLDialogElement>(null);
  const stopRef = useRef<() => void>(() => {});

  const show = useCallback(
    (outcome: VoiceOutcome) => {
      setFeedback({ ok: outcome.ok, text: outcome.message });
      if (outcome.navigate) router.push(outcome.navigate);
      if (outcome.help) helpRef.current?.showModal();
      if (outcome.stop) stopRef.current();
      return outcome.ok;
    },
    [router],
  );

  const { listening, start, stop } = useSpeechRecognition(lang, {
    onFinal: (text) => {
      setHeard({ text, interim: false });
      show(runVoiceCommand(text));
    },
    onInterim: (text) => setHeard({ text, interim: true }),
    onError: (code) => setFeedback({ ok: false, text: speechErrorMessage(code) }),
  });

  useEffect(() => {
    stopRef.current = stop;
  }, [stop]);

  // Leaving the calculator pages turns the microphone off.
  useEffect(() => {
    if (!visible) stopRef.current();
  }, [visible]);

  // Push-to-talk: hold Space anywhere except while typing in a box.
  useEffect(() => {
    if (mode !== "push-to-talk" || !visible) return;
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
  }, [mode, visible, start, stop]);

  if (!isClient || !visible) return null;

  const supported = isSpeechSupported();
  const active = data.courses.find((c) => c.id === data.activeCourseId) ?? data.courses[0] ?? null;

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
  else if (listening) status = mode === "continuous" ? "Listening. Say one thing at a time." : "Listening. Let go when you're done.";
  else status = mode === "continuous" ? 'Tap the mic and say "quiz 8 out of 10"' : 'Hold the mic or Space and say "quiz 8 out of 10"';

  const micButton = (
    <button
      type="button"
      data-voice-mic
      disabled={!supported}
      aria-pressed={listening}
      aria-label={listening ? "Stop listening" : mode === "continuous" ? "Start listening" : "Hold to talk"}
      {...micHandlers}
      className={`grid size-12 shrink-0 touch-none select-none place-items-center rounded-full transition-colors disabled:opacity-40 ${
        listening ? "bg-err text-white" : "bg-accent text-on-accent hover:opacity-90"
      }`}
    >
      <Icon name="mic" size={22} />
      {listening && (
        <span className="pointer-events-none absolute inset-0 animate-ping rounded-full border-2 border-err/60" />
      )}
    </button>
  );

  return (
    <>
      <div aria-hidden="true" className={`print:hidden ${collapsed ? "h-20" : "h-48 sm:h-40"}`} />
      <VoiceHelp ref={helpRef} />

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-4 print:hidden">
        {collapsed ? (
          <div className="pointer-events-auto ml-auto flex w-fit items-center gap-2 rounded-full border border-line-strong bg-surface p-1.5 shadow-lg">
            <span className="relative">{micButton}</span>
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              aria-label="Show voice panel"
              className="grid size-9 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
            >
              <Icon name="chevronUp" size={18} />
            </button>
          </div>
        ) : (
          <section
            aria-label="Voice commands"
            className="pointer-events-auto mx-auto max-w-3xl rounded-lg border border-line-strong bg-surface shadow-lg"
          >
            {settingsOpen && (
              <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3 text-sm">
                <div role="radiogroup" aria-label="Voice mode" className="inline-flex rounded-md border border-line-strong p-0.5">
                  {MODES.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      role="radio"
                      aria-checked={mode === m.value}
                      onClick={() => setMode(m.value)}
                      className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                        mode === m.value ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-xs text-muted">
                  Language
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="h-8 rounded-md border border-line-strong bg-bg px-2 text-sm text-fg outline-none focus:border-accent"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            <div className="flex gap-3 p-3 sm:gap-4 sm:p-4">
              <span className="relative">{micButton}</span>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 text-xs text-muted">
                    {status}
                    {active && (
                      <span className="hidden sm:inline">
                        {" "}
                        · Marks go to <span className="text-fg">{active.name}</span>
                      </span>
                    )}
                  </p>
                  <div className="-mr-1 -mt-1 flex shrink-0">
                    <button
                      type="button"
                      onClick={() => show(undoLastVoiceCommand())}
                      aria-label="Undo last voice command"
                      title="Undo"
                      className="grid size-8 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-fg"
                    >
                      <Icon name="undo" size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => helpRef.current?.showModal()}
                      aria-label="Voice command help"
                      title="What can I say?"
                      className="grid size-8 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-fg"
                    >
                      <Icon name="help" size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettingsOpen((v) => !v)}
                      aria-label="Voice settings"
                      aria-expanded={settingsOpen}
                      title="Voice settings"
                      className={`grid size-8 place-items-center rounded-md hover:bg-surface-2 hover:text-fg ${
                        settingsOpen ? "text-fg" : "text-muted"
                      }`}
                    >
                      <Icon name="settings" size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCollapsed(true)}
                      aria-label="Hide voice panel"
                      title="Hide"
                      className="grid size-8 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-fg"
                    >
                      <Icon name="chevronDown" size={16} />
                    </button>
                  </div>
                </div>

                <div aria-live="polite" className="min-h-5 text-sm">
                  {heard && (
                    <p className={`truncate ${heard.interim ? "italic text-muted" : ""}`}>
                      &ldquo;{heard.text}&rdquo;
                    </p>
                  )}
                  {feedback && (
                    <p className={`truncate ${feedback.ok ? "text-ok" : "text-warn"}`}>
                      {feedback.ok ? "✓ " : "! "}
                      {feedback.text}
                    </p>
                  )}
                </div>

                <form
                  className="mt-2 flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const text = typed.trim();
                    if (!text) return;
                    setHeard(null);
                    if (show(runVoiceCommand(text))) setTyped("");
                  }}
                >
                  <input
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    aria-label="Type a command"
                    placeholder="Or type a command, e.g. midterm 20 out of 25"
                    autoComplete="off"
                    spellCheck={false}
                    className="h-9 min-w-0 flex-1 rounded-md border border-line-strong bg-bg px-3 text-sm outline-none focus:border-accent"
                  />
                  <button type="submit" className={buttonClass("secondary")}>
                    Go
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
