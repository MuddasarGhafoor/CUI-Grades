import { GradeScaleTable } from "@/components/guide/grade-scale-table";
import { VoiceCommandList } from "@/components/guide/voice-command-list";
import { WeightsTable } from "@/components/guide/weights-table";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  path: "/guide",
  title: "Guide",
  description:
    "The official CUI grade scale, how quizzes, assignments, midterms and finals are weighted, how GPA and CGPA are worked out, and every voice command.",
});

const STEPS = [
  {
    term: "Quizzes and Assignments",
    detail:
      "Marks are added up, then scaled to their weight. Four quizzes of 8, 7, 9 and 7 out of 10 give 31/40, so 31 ÷ 40 × 15 = 11.63 marks.",
  },
  {
    term: "Internal Marks",
    detail:
      "Everything before the final: quizzes, assignments and the midterm. That is 50 marks for theory and 50 for lab.",
  },
  {
    term: "Theory and Lab Together",
    detail:
      "A subject with a lab combines both percentages by credit hours. In a 3+1 subject, theory counts for three quarters and lab for one quarter.",
  },
  {
    term: "Rounding",
    detail:
      "The final percentage is rounded to a whole number before the grade is picked. 78.6% becomes 79%, which is a B+. 70.4% stays 70%, which is a B-.",
  },
  {
    term: "GPA and CGPA",
    detail:
      "Each grade's points are multiplied by the subject's credit hours, added up, and divided by the total credit hours. CGPA does the same across every semester.",
  },
  {
    term: "Final Exam Target",
    detail:
      "Works backwards from your internal marks: the lowest final exam score that still rounds up to the grade you pick. Marks not entered yet count as 0.",
  },
];

const SHORTCUTS: [keys: string, does: string][] = [
  ["Enter or Tab", "Move to the next mark box"],
  ["Shift + Tab", "Go back one box"],
  ["Esc", "Close a dropdown or cancel a form"],
  ["Hold Space", "Talk, in Hold to Talk voice mode (when not typing)"],
  ["Arrow keys", "Move through dropdown options"],
];

export default function GuidePage() {
  return (
    <>
      <PageHeader
        title="Guide"
        description="How CUI-Grades works out your marks, the official grade scale it uses, and everything you can say or press."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="CUI Grade Scale"
          description="For students admitted in Fall 2021 or later. 50% (D) is the minimum pass."
        >
          <GradeScaleTable />
          <p className="mt-4 text-xs text-muted">
            Source: CUI Graduate Handbook 2023, section 2.10. Check your own campus notice if in doubt.
          </p>
        </SectionCard>

        <SectionCard
          title="How Marks Are Weighted"
          description="Totals start pre-filled. Change any of them if your teacher marks out of something else."
        >
          <WeightsTable />
        </SectionCard>
      </div>

      <SectionCard title="How the Numbers Are Worked Out" className="mt-6" bodyClassName="">
        <dl className="divide-y divide-line">
          {STEPS.map((step) => (
            <div key={step.term} className="grid gap-1 px-4 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6 sm:px-5">
              <dt className="font-semibold">{step.term}</dt>
              <dd className="text-muted">{step.detail}</dd>
            </div>
          ))}
        </dl>
      </SectionCard>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <SectionCard
          title="Voice Commands"
          description="Tap the mic on any calculator page, or type these in the voice box."
        >
          <VoiceCommandList columns />
        </SectionCard>

        <SectionCard title="Keyboard Shortcuts" bodyClassName="">
          <dl className="divide-y divide-line text-sm">
            {SHORTCUTS.map(([keys, does]) => (
              <div key={keys} className="flex items-start justify-between gap-4 px-4 py-3 sm:px-5">
                <dt>
                  <kbd className="rounded-md border border-line-strong bg-surface-2 px-1.5 py-0.5 font-mono text-xs">
                    {keys}
                  </kbd>
                </dt>
                <dd className="text-right text-muted">{does}</dd>
              </div>
            ))}
          </dl>
        </SectionCard>
      </div>
    </>
  );
}
