"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LogoMark } from "@/components/brand/logo";
import { formatGpa, formatMarks, formatPercent } from "@/lib/format";
import { buildResultSummary, formatResultDate } from "@/lib/result-summary";
import { useAppData } from "@/lib/store";
import { useIsClient } from "@/lib/use-is-client";

const RESULT_PAGES = ["/gpa-calculator", "/cgpa-calculator"];

/**
 * A plain, printer-friendly result sheet. On the GPA and CGPA pages, printing
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
  const past = summary.timeline.filter((p) => p.id !== "current-semester");

  return (
    <div id="print-sheet" className="text-[11pt] text-black">
      <header className="flex items-center justify-between border-b border-neutral-300 pb-3">
        <span className="flex items-center gap-2">
          <LogoMark size={20} className="text-black" />
          <span className="font-display text-lg">CUI-Grades</span>
        </span>
        <span className="text-sm text-neutral-600">{formatResultDate(summary.generatedAt)}</span>
      </header>

      <h1 className="mt-6 font-display text-3xl">Semester result</h1>

      <table className="mt-4 w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-neutral-400 text-sm text-neutral-600">
            <th className="py-1.5 font-medium">Subject</th>
            <th className="py-1.5 text-right font-medium">Credits</th>
            <th className="py-1.5 text-right font-medium">Marks</th>
            <th className="py-1.5 text-right font-medium">Grade</th>
            <th className="py-1.5 text-right font-medium">Points</th>
            <th className="py-1.5 text-right font-medium">Quality pts</th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {summary.subjects.map((s) => (
            <tr key={s.id} className="border-b border-neutral-200">
              <td className="py-1.5">{s.name}</td>
              <td className="py-1.5 text-right">{s.creditSplit}</td>
              <td className="py-1.5 text-right">{formatPercent(s.percent)}</td>
              <td className="py-1.5 text-right font-semibold">
                {s.letter ?? "–"}
                {s.manual && <sup className="ml-0.5 font-normal">*</sup>}
              </td>
              <td className="py-1.5 text-right">{s.points === null ? "–" : s.points.toFixed(2)}</td>
              <td className="py-1.5 text-right">
                {s.points === null ? "–" : formatMarks(s.points * s.credits)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded border border-neutral-300 p-4">
          <dt className="text-sm text-neutral-600">Semester GPA</dt>
          <dd className="font-display text-4xl">{formatGpa(summary.semester.gpa)}</dd>
          <dd className="text-sm text-neutral-600">{formatMarks(summary.semester.credits)} credit hours counted</dd>
        </div>
        <div className="rounded border border-neutral-300 p-4">
          <dt className="text-sm text-neutral-600">CGPA</dt>
          <dd className="font-display text-4xl">{formatGpa(summary.cgpa)}</dd>
          <dd className="text-sm text-neutral-600">
            {formatMarks(summary.cgpaCredits)} credit hours, {summary.timeline.length} semester
            {summary.timeline.length === 1 ? "" : "s"}
          </dd>
        </div>
      </dl>

      {past.length > 0 && (
        <>
          <h2 className="mt-6 text-base font-semibold">Semesters</h2>
          <table className="mt-2 w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-neutral-400 text-sm text-neutral-600">
                <th className="py-1.5 font-medium">Semester</th>
                <th className="py-1.5 text-right font-medium">GPA</th>
                <th className="py-1.5 text-right font-medium">Credits</th>
                <th className="py-1.5 text-right font-medium">CGPA after</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {summary.timeline.map((p) => (
                <tr key={p.id} className="border-b border-neutral-200">
                  <td className="py-1.5">{p.label}</td>
                  <td className="py-1.5 text-right">{formatGpa(p.gpa)}</td>
                  <td className="py-1.5 text-right">{formatMarks(p.credits)}</td>
                  <td className="py-1.5 text-right">{formatGpa(p.cgpa)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <footer className="mt-8 space-y-1 border-t border-neutral-300 pt-3 text-xs text-neutral-600">
        {summary.subjects.some((s) => s.manual) && <p>* Grade picked by hand on the GPA page.</p>}
        <p>
          Unofficial calculation on the CUI grading scale for students admitted in Fall 2021 or
          later. Not affiliated with COMSATS University Islamabad.
        </p>
      </footer>
    </div>
  );
}
