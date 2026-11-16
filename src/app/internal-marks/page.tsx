import { InternalMarksApp } from "@/components/internal/internal-marks-app";
import { PageHeader } from "@/components/ui/page-header";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  path: "/internal-marks",
  title: "Internal Marks Calculator",
  description:
    "Calculate CUI internal (sessional) marks from quizzes, assignments and midterms, for theory and lab, with totals already filled in.",
});

export default function InternalMarksPage() {
  return (
    <>
      <PageHeader
        tone="teal"
        title="Internal Marks"
        description="Type the marks you got. Totals are already filled in, and your percentage and grade update as you go."
      />
      <InternalMarksApp />
    </>
  );
}
