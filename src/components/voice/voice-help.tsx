"use client";

import Link from "next/link";
import type { Ref } from "react";
import { VoiceCommandList } from "@/components/guide/voice-command-list";
import { buttonClass } from "@/components/ui/button";

export function VoiceHelp({ ref }: { ref: Ref<HTMLDialogElement> }) {
  return (
    <dialog
      ref={ref}
      aria-labelledby="voice-help-title"
      className="m-auto w-[min(40rem,calc(100%-2rem))] rounded-xl border border-line-strong bg-surface p-0 text-fg shadow-pop backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      onClick={(e) => {
        // A click on the backdrop lands on the dialog element itself.
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
    >
      <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
        <div>
          <h2 id="voice-help-title" className="font-display text-2xl">
            Voice Commands
          </h2>
          <p className="mt-1 text-sm text-muted">
            Say one thing at a time and wait for the confirmation. Number words work too:
            &ldquo;quiz eight out of ten&rdquo;. You can type any of these in the box as well.
          </p>
        </div>
        <form method="dialog">
          <button className={buttonClass("ghost", "sm")}>Close</button>
        </form>
      </div>

      <div className="max-h-[65dvh] overflow-y-auto px-5 py-5 sm:px-6">
        <VoiceCommandList />
        <p className="mt-5 text-xs text-muted">
          Marks go to the subject that is open on the Internal Marks page. In Chrome and Edge,
          speech is turned into text by the browser&apos;s online speech service, so voice needs an
          internet connection. Your marks themselves stay in this browser. The full list is also on
          the{" "}
          <Link href="/guide" className="text-accent hover:underline">
            Guide
          </Link>{" "}
          page.
        </p>
      </div>
    </dialog>
  );
}
