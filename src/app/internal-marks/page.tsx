import type { Metadata } from "next";
import { ComingSoon, PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Internal marks calculator",
  description:
    "Calculate CUI internal (sessional) marks from quizzes, assignments and midterms, for theory and lab.",
};

export default function InternalMarksPage() {
  return (
    <>
      <PageHeader
        title="Internal marks"
        description="Quizzes, assignments and midterms for every subject, theory and lab."
      />
      <ComingSoon
        items={[
          "Subjects with theory and lab credit hours",
          "Pre-filled totals for every assessment",
          "Tab and Enter to move between fields",
          "Progress ring and mark breakdown",
        ]}
      />
    </>
  );
}
