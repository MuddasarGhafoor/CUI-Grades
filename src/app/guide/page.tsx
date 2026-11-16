import { GradeScaleTable } from "@/components/guide/grade-scale-table";
import { GuideSection } from "@/components/guide/guide-section";
import { HowItWorks } from "@/components/guide/how-it-works";
import { Shortcuts } from "@/components/guide/shortcuts";
import { VoiceGuide } from "@/components/guide/voice-guide";
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

export default function GuidePage() {
  return (
    <>
      <PageHeader
        tone="amber"
        compact
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

      <GuideSection
        id="how-it-works"
        title="How the Numbers Are Worked Out"
        description="Every result in CUI-Grades comes from these six steps. Each card shows a real example you can check by hand."
      >
        <HowItWorks />
      </GuideSection>

      <GuideSection
        id="voice"
        title="Voice Commands"
        description="Fill in marks, add subjects and move between pages without touching the keyboard."
      >
        <VoiceGuide />
      </GuideSection>

      <GuideSection
        id="shortcuts"
        title="Keyboard Shortcuts"
        description="Enter your marks quickly without reaching for the mouse."
      >
        <Shortcuts />
      </GuideSection>
    </>
  );
}
