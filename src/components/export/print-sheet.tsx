"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LogoMark } from "@/components/brand/logo";
import { formatGpa, formatMarks } from "@/lib/format";
import { buildResultSummary, formatResultDate } from "@/lib/result-summary";
import { useAppData } from "@/lib/store";
import { useIsClient } from "@/lib/use-is-client";

const RESULT_PAGES = ["/gpa-calculator", "/cgpa-calculator"];

/** Fixed print colours (paper is always light): grade badges and the two headline numbers. */
const PRINT = {
  teal: "#0f766e",
  tealSoft: "#ecfdf8",
  blue: "#1d4ed8",
  blueSoft: "#eff6ff",
  violet: "#6d28d9",
  violetSoft: "#f5f3ff",
  line: "#e2e8f0",
  head: "#f1f5f9",
  muted: "#64748b",
};

function gradeColors(letter: string | null): { fg: string; bg: string } {
  const first = letter?.charAt(0).toUpperCase();
  if (first === "A") return { fg: "#15803d", bg: "#dcfce7" };
  if (first === "B") return { fg: "#1d4ed8", bg: "#dbeafe" };
  if (first === "C") return { fg: "#b45309", bg: "#fef3c7" };
  if (first === "D" || first === "F") return { fg: "#be123c", bg: "#ffe4e6" };
  return { fg: PRINT.muted, bg: "transparent" };
}

const TH = "px-3.5 py-2.5 text-[9pt] font-semibold uppercase tracking-wide";
const TD = "px-3.5 py-2.5";

/**
 * A colourful, printer-friendly result sheet. On the GPA and CGPA pages, printing
 * (or "Save as PDF") shows only this sheet instead of the interactive page.
 * Must be a direct child of <body>; the CSS in globals.css does the switching.
 */
export function PrintSheet() {
  const pathname = usePathname();
  const isClient = useIsClient();
  const data = useAppData();
  const active = RESULT_PAGES.some((p) => pathname.startsWith(p));

  useEffect(() => {
    const root = document.documentElement;
    if (active) root.dataset.printSheet = "";
    else delete root.dataset.printSheet;
    return () => {
      delete root.dataset.printSheet;
    };
  }, [active]);

  if (!isClient || !active) return null;
  const summary = buildResultSummary(data);
  // The GPA result only; the CGPA page keeps its own data.
  const totalCredits = summary.subjects.reduce((sum, s) => sum + s.credits, 0);

  const stats = [
    { label: "Semester GPA", value: formatGpa(summary.semester.gpa), note: `${formatMarks(summary.semester.credits)} credit hours counted`, color: PRINT.blue, bg: PRINT.blueSoft },
    { label: "Courses", value: String(summary.subjects.length), note: `${summary.subjects.filter((s) => s.letter).length} with a grade`, color: PRINT.teal, bg: PRINT.tealSoft },
    {
      label: "Credit Hours",
      value: formatMarks(totalCredits),
      note: `${formatMarks(summary.semester.credits)} counted in the GPA`,
      color: PRINT.violet,
      bg: PRINT.violetSoft,
    },
  ];

  return (
    // print-color-adjust keeps the background tints when printing or saving as PDF.
    <div id="print-sheet" className="text-[10.5pt] text-[#0f172a] [-webkit-print-color-adjust:exact] [print-color-adjust:exact]">
      <header
        className="flex items-center justify-between rounded-xl px-6 py-5"
        style={{ background: PRINT.tealSoft, border: `1px solid ${PRINT.line}` }}
      >
        <span className="flex items-center gap-2.5">
          <LogoMark size={26} className="text-[#0f172a]" />
          <span className="font-display text-xl">CUI-Grades</span>
        </span>
        <span className="text-right">
          <span className="block font-display text-2xl" style={{ color: PRINT.teal }}>
            Semester Result
          </span>
          <span className="block text-[9pt]" style={{ color: PRINT.muted }}>
            {formatResultDate(summary.generatedAt)}
          </span>
        </span>
      </header>

      <dl className="mt-7 grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl px-5 py-4" style={{ background: s.bg, border: `1px solid ${PRINT.line}` }}>
            <dt className="text-[9pt] font-semibold uppercase tracking-wide" style={{ color: PRINT.muted }}>
              {s.label}
            </dt>
            <dd className="mt-1 font-display text-[26pt] leading-none" style={{ color: s.color }}>
              {s.value}
            </dd>
            <dd className="mt-2 text-[9pt]" style={{ color: PRINT.muted }}>
              {s.note}
            </dd>
          </div>
        ))}
      </dl>

      <h2 className="mb-3 mt-8 text-[12pt] font-semibold">Courses</h2>
      <div className="overflow-hidden rounded-xl" style={{ border: `1px solid ${PRINT.line}` }}>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr style={{ background: PRINT.head, color: PRINT.muted }}>
              <th className={TH}>Course</th>
              <th className={`${TH} text-center`}>Credits</th>
              <th className={`${TH} text-center`}>Percentage</th>
              <th className={`${TH} text-center`}>Grade</th>
              <th className={`${TH} text-right`}>GPA</th>
              <th className={`${TH} text-right`}>Quality Points</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {summary.subjects.map((s, i) => {
              const colors = gradeColors(s.letter);
              return (
                <tr key={s.id} style={{ borderTop: `1px solid ${PRINT.line}`, background: i % 2 ? "#fafafa" : "#ffffff" }}>
                  <td className={`${TD} font-medium`}>{s.name}</td>
                  <td className={`${TD} text-center`}>{s.credits}</td>
                  <td className={`${TD} text-center`} style={{ color: PRINT.muted }}>
                    {s.range ? `${s.range}%` : "-"}
                  </td>
                  <td className={`${TD} text-center`}>
                    {s.letter ? (
                      <span className="rounded-md px-2 py-0.5 text-[9.5pt] font-semibold" style={{ color: colors.fg, background: colors.bg }}>
                        {s.letter}
                      </span>
                    ) : (
                      <span style={{ color: PRINT.muted }}>N/A</span>
                    )}
                  </td>
                  <td className={`${TD} text-right font-semibold`}>{s.points === null ? "-" : s.points.toFixed(2)}</td>
                  <td className={`${TD} text-right`}>{s.points === null ? "-" : formatMarks(s.points * s.credits)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className="mt-10 border-t pt-4 text-[8.5pt]" style={{ borderColor: PRINT.line, color: PRINT.muted }}>
        Unofficial calculation on the CUI grading scale for students admitted in Fall 2021 or later. Not affiliated
        with COMSATS University Islamabad.
      </footer>
    </div>
  );
}
