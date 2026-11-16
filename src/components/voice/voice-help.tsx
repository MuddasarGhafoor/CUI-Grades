"use client";

import type { Ref } from "react";
import { buttonClass } from "@/components/ui/button";

const GROUPS: { title: string; items: [string, string][] }[] = [
  {
    title: "Subjects",
    items: [
      ["new subject database systems", "adds a subject (3 theory credits)"],
      ["credits 3 plus 1", "sets theory and lab credit hours"],
      ["switch to operating systems", "opens another subject"],
      ["next subject / previous subject", "moves between subjects"],
    ],
  },
  {
    title: "Marks",
    items: [
      ["quiz 8", "fills the next empty quiz, out of its usual total"],
      ["quiz 8 out of 15", "same, and changes the total"],
      ["quiz 3 is 7", "sets quiz number 3"],
      ["quizzes 8 7 9 6", "fills all quizzes at once"],
      ["assignment 9 out of 10", "also: lab assignment 9"],
      ["midterm 20 out of 25", "also: lab midterm 18"],
      ["final 41", "also: lab final 44"],
    ],
  },
  {
    title: "GPA and CGPA",
    items: [
      ["grade b plus", "uses B+ for this subject on the GPA page"],
      ["grade from marks", "goes back to the grade from marks"],
      ["semester 3.45 with 18 credits", "adds a past semester to the CGPA page"],
    ],
  },
  {
    title: "Other",
    items: [
      ["go to gpa / cgpa / internal marks", "opens a page"],
      ["undo", "reverses the last voice command"],
      ["stop", "stops listening"],
    ],
  },
];

export function VoiceHelp({ ref }: { ref: Ref<HTMLDialogElement> }) {
  return (
    <dialog
      ref={ref}
      aria-labelledby="voice-help-title"
      className="m-auto w-[min(40rem,calc(100%-2rem))] rounded-lg border border-line bg-surface p-0 text-fg backdrop:bg-black/50"
      onClick={(e) => {
        // A click on the backdrop lands on the dialog element itself.
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
    >
      <div className="max-h-[80dvh] overflow-y-auto p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="voice-help-title" className="font-display text-2xl">
              Voice commands
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

        {GROUPS.map((group) => (
          <section key={group.title} className="mt-5">
            <h3 className="text-sm font-semibold">{group.title}</h3>
            <dl className="mt-2 divide-y divide-line border-y border-line text-sm">
              {group.items.map(([say, does]) => (
                <div key={say} className="grid gap-1 py-2 sm:grid-cols-[15rem_1fr] sm:gap-4">
                  <dt>
                    <code className="font-mono text-[13px] text-accent">{say}</code>
                  </dt>
                  <dd className="text-muted">{does}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}

        <p className="mt-5 text-xs text-muted">
          Marks go to the subject that is open on the Internal marks page. In Chrome and Edge,
          speech is turned into text by the browser&apos;s online speech service, so voice needs an
          internet connection. Your marks themselves stay in this browser.
        </p>
      </div>
    </dialog>
  );
}
