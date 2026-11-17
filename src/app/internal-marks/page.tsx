import { InternalMarksApp } from "@/components/internal/internal-marks-app";
import { CalculatorHeader } from "@/components/voice/calculator-header";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  path: "/internal-marks",
  title: "Internal Marks Calculator",
  description:
    "Calculate CUI internal (sessional) marks from quizzes, assignments and midterms, for theory and lab, with totals already filled in.",
});

export default function InternalMarksPage() {
  return (
    <>
      <CalculatorHeader tone="teal" title="Internal Marks" />
      <InternalMarksApp />
    </>
  );
}
