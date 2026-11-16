import type { Metadata } from "next";
import { ComingSoon, PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "CGPA calculator",
  description: "Calculate your overall CUI CGPA across all semesters.",
};

export default function CgpaCalculatorPage() {
  return (
    <>
      <PageHeader
        title="CGPA calculator"
        description="Your overall CGPA, semester by semester."
      />
      <ComingSoon
        items={[
          "Semester GPA and credit hours history",
          "Current semester linked from GPA page",
          "GPA and CGPA trend line",
          "Export your result",
        ]}
      />
    </>
  );
}
