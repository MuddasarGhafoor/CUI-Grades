import type { Metadata } from "next";
import { InternalMarksApp } from "@/components/internal/internal-marks-app";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Internal marks calculator",
  description:
    "Calculate CUI internal (sessional) marks from quizzes, assignments and midterms, for theory and lab, with totals already filled in.",
};

export default function InternalMarksPage() {
  return (
    <>
      <PageHeader
        title="Internal marks"
        description="Type the marks you got. Totals are already filled in, and your percentage and grade update as you go."
      />
      <InternalMarksApp />
    </>
  );
}
