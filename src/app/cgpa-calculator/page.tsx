import { CgpaApp } from "@/components/cgpa/cgpa-app";
import { ExportActions } from "@/components/export/export-actions";
import { PageHeader } from "@/components/ui/page-header";
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
      <PageHeader
        title="CGPA Calculator"
        description="Add each finished semester's GPA and credit hours. This semester comes from the GPA page on its own."
        actions={<ExportActions />}
      />
      <CgpaApp />
    </>
  );
}
