import { ProgressRing } from "@/components/ui/progress-ring";
import { formatGpa } from "@/lib/format";
import type { GpaPageResult } from "@/lib/gpa";
import { TONE_CLASS, TONE_VAR, gradeTone, type Tone } from "@/lib/tones";
import { GPA_MAIN_WIDTH } from "./layout";

/** Ring colour for a GPA: green from 3.66 (A-), blue from 3.00, amber from 2.00, rose below. */
function gpaTone(gpa: number | null): Tone | null {
  if (gpa === null) return null;
  if (gpa >= 3.66) return "green";
  if (gpa >= 3) return "blue";
  if (gpa >= 2) return "amber";
  return "rose";
}

/**
 * Table columns: course | credits | GPA | grade. GPA and grade sit side by side with no divider
 * between them, so they read as one result but still line up row to row.
 */
const COLUMNS = "grid-cols-[minmax(0,1fr)_4rem_4rem_4rem]";

const BOX = "card flex flex-col overflow-hidden";
const BOX_HEADER = "border-b border-line px-4 py-2.5 text-sm font-semibold";
const COLUMN_HEAD = "border-b border-line bg-surface-2/20 text-[11px] font-medium text-muted";

/**
 * Under the courses card, at the same width: the grading table, then the semester GPA ring and
 * the per-course bars side by side (half width each, same height). They stack on phones.
 */
export function GpaResult({ result }: { result: GpaPageResult }) {
  const { rows, gpa, totalCredits } = result;
  const ringTone = gpaTone(gpa.gpa);

  return (
    <div className={`mx-auto w-full space-y-4 ${GPA_MAIN_WIDTH}`}>
      {/* Grading table. */}
      <section aria-label="Grading" className={BOX}>
        <h2 className={BOX_HEADER}>Grading</h2>
        <div className="text-[13px]">
          <div aria-hidden="true" className={`grid ${COLUMN_HEAD} ${COLUMNS}`}>
            <span className="py-1.5 pl-4 pr-3">Course</span>
            <span className="border-l border-line px-3 py-1.5 text-center">Credits</span>
            <span className="border-l border-line py-1.5 pl-3">GPA</span>
            <span className="py-1.5 pr-3 text-center">Grade</span>
          </div>
          <ul>
            {rows.map(({ course, band }) => {
              const tone = band ? (gradeTone(band.letter) ?? "rose") : null;
              return (
                <li key={course.id} className={`grid h-11 items-center border-b border-line last:border-0 ${COLUMNS}`}>
                  <span className="truncate pl-4 pr-3 font-medium" title={course.name}>
                    {course.name}
                  </span>
                  <span className="flex items-center justify-center self-stretch border-l border-line px-3 tabular-nums text-muted">
                    {course.credits}
                  </span>
                  {band && tone ? (
                    <>
                      <span className="flex items-center self-stretch border-l border-line pl-3 font-semibold tabular-nums">
                        {band.points.toFixed(2)}
                      </span>
                      <span className="pr-3 text-center">
                        <span className={`rounded-md px-1.5 py-px text-xs font-semibold ${TONE_CLASS[tone].soft}`}>
                          {band.letter}
                        </span>
                      </span>
                    </>
                  ) : (
                    <span className="col-span-2 flex items-center justify-center self-stretch border-l border-line px-3 text-muted">
                      N/A
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Semester GPA and bars, side by side and equal in height. */}
      <div className="grid items-stretch gap-4 sm:grid-cols-2">
        <section aria-label="Course bars" className={BOX}>
          <h2 className={BOX_HEADER}>By Course</h2>
          <ul className="flex flex-1 flex-col justify-center gap-3 px-4 py-4">
            {rows.map(({ course, band, range, barPercent }) => {
              const tone = band ? (gradeTone(band.letter) ?? "rose") : null;
              return (
                <li key={course.id}>
                  {/* Course name and its GPA on top, the bar underneath. */}
                  <p className="flex items-baseline justify-between gap-3 text-xs">
                    <span className="truncate" title={course.name}>
                      {course.name}
                    </span>
                    <span
                      className={`shrink-0 tabular-nums ${tone ? `font-semibold ${TONE_CLASS[tone].text}` : "text-muted"}`}
                    >
                      {band ? band.points.toFixed(2) : "N/A"}
                    </span>
                  </p>
                  <span
                    role="img"
                    aria-label={band ? `${course.name}: ${band.letter}, ${range}%` : `${course.name}: no grade`}
                    className="mt-1 block h-1.5 overflow-hidden rounded-full bg-surface-2"
                  >
                    <span
                      className="block h-full rounded-full transition-[width] duration-500"
                      style={{ width: `${barPercent ?? 0}%`, background: tone ? TONE_VAR[tone] : undefined }}
                    />
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-label="Semester GPA" className={BOX}>
          <h2 className={BOX_HEADER}>Semester GPA</h2>
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-6">
            <ProgressRing
              value={gpa.gpa === null ? null : (gpa.gpa / 4) * 100}
              color={ringTone ? TONE_VAR[ringTone] : "var(--line-strong)"}
              size={140}
              stroke={10}
            >
              <div>
                <p className={`font-display text-4xl leading-none tabular-nums ${ringTone ? TONE_CLASS[ringTone].text : "text-muted"}`}>
                  {formatGpa(gpa.gpa)}
                </p>
                <p className="mt-1 text-[11px] text-muted">of 4.00</p>
              </div>
            </ProgressRing>
            <p className="text-center text-xs text-muted">
              {gpa.credits} of {totalCredits} credit hours counted
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
