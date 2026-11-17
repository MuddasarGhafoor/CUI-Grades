import { ExportActions } from "@/components/export/export-actions";
import { GpaApp } from "@/components/gpa/gpa-app";
import { PageHeader } from "@/components/ui/page-header";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  path: "/gpa-calculator",
  title: "GPA Calculator",
  description: "Calculate your CUI semester GPA: pick each course's grade and credit hours.",
});

export default function GpaCalculatorPage() {
  return (
    <>
      <PageHeader tone="blue" title="GPA Calculator" actions={<ExportActions />} />
      <GpaApp />
    </>
  );
}
