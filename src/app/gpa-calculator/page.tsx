import { ExportActions } from "@/components/export/export-actions";
import { GpaApp } from "@/components/gpa/gpa-app";
import { CalculatorHeader } from "@/components/voice/calculator-header";
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
      <CalculatorHeader tone="blue" title="GPA Calculator" actions={<ExportActions />} />
      <GpaApp />
    </>
  );
}
