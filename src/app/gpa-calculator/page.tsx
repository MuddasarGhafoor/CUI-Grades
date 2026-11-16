import { ExportActions } from "@/components/export/export-actions";
import { GpaApp } from "@/components/gpa/gpa-app";
import { PageHeader } from "@/components/ui/page-header";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  path: "/gpa-calculator",
  title: "GPA Calculator",
  description:
    "Calculate your CUI semester GPA from your internal marks, or pick the grades you already know.",
});

export default function GpaCalculatorPage() {
  return (
    <>
      <PageHeader
        title="GPA Calculator"
        description="Grades come from your internal marks. Pick a grade by hand for any subject to use that instead. Subjects are shared with the Internal Marks page."
        actions={<ExportActions />}
      />
      <GpaApp />
    </>
  );
}
