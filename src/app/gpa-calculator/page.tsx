import type { Metadata } from "next";
import { ComingSoon, PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "GPA calculator",
  description: "Calculate your CUI semester GPA from your marks or letter grades.",
};

export default function GpaCalculatorPage() {
  return (
    <>
      <PageHeader
        title="GPA calculator"
        description="Your semester GPA, from internal marks or grades you type in."
      />
      <ComingSoon
        items={[
          "Subjects linked from Internal marks",
          "Pick a grade directly for any subject",
          "Subject comparison bar chart",
          "What you need in the final",
        ]}
      />
    </>
  );
}
