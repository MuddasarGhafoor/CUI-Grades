import type { Metadata } from "next";
import { GpaApp } from "@/components/gpa/gpa-app";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "GPA calculator",
  description:
    "Calculate your CUI semester GPA from your internal marks, or pick the grades you already know.",
};

export default function GpaCalculatorPage() {
  return (
    <>
      <PageHeader
        title="GPA calculator"
        description="Grades come from your internal marks. Pick a grade by hand for any subject to use that instead. Subjects are shared with the Internal marks page."
      />
      <GpaApp />
    </>
  );
}
