"use client";

import Link from "next/link";
import { ConfirmButton } from "@/components/ui/confirm-button";
import type { CourseResult, EffectiveGrade } from "@/lib/calc";
import { formatCredits, formatMarks, formatPercent } from "@/lib/format";
import type { GradeBand } from "@/lib/grading";
import { removeCourse, setActiveCourse, updateCourse } from "@/lib/store";
import type { Course } from "@/lib/types";
import { GradeSelect } from "./grade-select";
import { TONE_CLASS, gradeTone } from "@/lib/tones";

type SubjectRowProps = {
  course: Course;
  result: CourseResult;
  grade: EffectiveGrade | null;
  scale: GradeBand[];
};

export function SubjectRow({ course, result, grade, scale }: SubjectRowProps) {
  const fromMarks = result.gradeFromMarks;
  const credits = result.credits;

  const marksNote = fromMarks
    ? `${formatPercent(result.percent)} from marks${result.complete ? "" : " so far"} (${fromMarks.letter})`
    : "no marks entered";

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 transition-colors hover:bg-surface-2/40">
      <div className="min-w-0 flex-1 basis-48">
        <Link
          href="/internal-marks"
          onClick={() => setActiveCourse(course.id)}
          className="text-[13px] font-semibold hover:text-tone-teal"
          title="Open in Internal Marks"
        >
          {course.name}
        </Link>
        <p className="mt-0.5 text-xs text-muted">
          {course.theoryCredits}+{course.labCredits} · {formatCredits(credits)} · {marksNote}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <GradeSelect
          ariaLabel={`Grade for ${course.name}`}
          value={course.manualGrade ?? ""}
          scale={scale}
          emptyLabel={fromMarks ? `From Marks (${fromMarks.letter})` : "Pick a Grade"}
          className="w-40"
          onChange={(letter) =>
            updateCourse(course.id, (c) => {
              c.manualGrade = letter || null;
            })
          }
        />
        <p className="w-32 text-right text-[13px] tabular-nums">
          {grade ? (
            <>
              <span className="text-muted">
                {grade.points.toFixed(2)} × {credits} ={" "}
              </span>
              <span className={`font-semibold ${TONE_CLASS[gradeTone(grade.letter) ?? "teal"].text}`}>{formatMarks(grade.points * credits)}</span>
            </>
          ) : (
            <span className="text-muted">Not counted</span>
          )}
        </p>
        <ConfirmButton label="Remove" confirmLabel="Remove?" onConfirm={() => removeCourse(course.id)} />
      </div>
    </li>
  );
}
