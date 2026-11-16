import type { Metadata } from "next";
import { CgpaApp } from "@/components/cgpa/cgpa-app";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "CGPA calculator",
  description:
    "Calculate your overall CUI CGPA from each semester's GPA and credit hours, with this semester added from the GPA page.",
};

export default function CgpaCalculatorPage() {
  return (
    <>
      <PageHeader
        title="CGPA calculator"
        description="Add each finished semester's GPA and credit hours. This semester comes from the GPA page on its own."
      />
      <CgpaApp />
    </>
  );
}
