import { CgpaApp } from "@/components/cgpa/cgpa-app";
import { ExportActions } from "@/components/export/export-actions";
import { CalculatorHeader } from "@/components/voice/calculator-header";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  path: "/cgpa-calculator",
  title: "CGPA Calculator",
  description:
    "Calculate your overall CUI CGPA from each semester's GPA and credit hours, with this semester added from the GPA page.",
});

export default function CgpaCalculatorPage() {
  return (
    <>
      <CalculatorHeader tone="violet" title="CGPA Calculator" actions={<ExportActions />} />
      <CgpaApp />
    </>
  );
}
