import Link from "next/link";
import { GradeScaleTable } from "@/components/home/grade-scale-table";
import { SavedProgress } from "@/components/home/saved-progress";
import { WeightsTable } from "@/components/home/weights-table";
import { Icon } from "@/components/ui/icons";
import { NAV_ITEMS } from "@/lib/nav";

const STEPS = [
  {
    term: "Quizzes and assignments",
    detail:
      "Marks are added up, then scaled to their weight. Four quizzes of 8, 7, 9 and 7 out of 10 give 31/40, so 31 ÷ 40 × 15 = 11.63 marks.",
  },
  {
    term: "Internal marks",
    detail:
      "Everything before the final: quizzes, assignments and the midterm. That is 50 marks for theory and 50 for lab.",
  },
  {
    term: "Theory and lab together",
    detail:
      "A subject with a lab combines both percentages by credit hours. In a 3+1 subject, theory counts for three quarters and lab for one quarter.",
  },
  {
    term: "Rounding",
    detail:
      "The final percentage is rounded to a whole number before the grade is picked. 78.6% becomes 79%, which is a B+. 70.4% stays 70%, which is a B-.",
  },
  {
    term: "GPA and CGPA",
    detail:
      "Each grade's points are multiplied by the subject's credit hours, added up, and divided by the total credit hours. CGPA does the same across every semester.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="max-w-3xl">
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">
          Internal marks, GPA and CGPA for CUI students
        </h1>
        <p className="mt-3 text-muted">
          Totals are filled in for you, Tab moves you to the next box, and you can say your marks
          out loud instead of typing them. Everything stays saved in your browser, so nothing is
          sent anywhere.
        </p>
      </section>

      <SavedProgress />

      <ul className="mt-8 divide-y divide-line border-y border-line">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="group flex items-center justify-between gap-6 py-5">
              <span>
                <span className="block text-lg font-semibold transition-colors group-hover:text-accent">
                  {item.title}
                </span>
                <span className="block text-sm text-muted">{item.description}</span>
              </span>
              <Icon
                name="arrowRight"
                size={18}
                className="shrink-0 text-muted transition-colors group-hover:text-accent"
              />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border border-line bg-surface p-5">
          <h2 className="font-semibold">CUI grade scale</h2>
          <p className="mt-1 text-sm text-muted">
            For students admitted in Fall 2021 or later. 50% (D) is the minimum pass.
          </p>
          <div className="mt-3">
            <GradeScaleTable />
          </div>
          <p className="mt-3 text-xs text-muted">
            Source: CUI Graduate Handbook 2023, section 2.10. Check your own campus notice if in
            doubt.
          </p>
        </section>

        <section className="rounded-lg border border-line bg-surface p-5">
          <h2 className="font-semibold">How marks are weighted</h2>
          <p className="mt-1 text-sm text-muted">
            Totals start pre-filled. Change any of them if your teacher marks out of something else.
          </p>
          <div className="mt-3">
            <WeightsTable />
          </div>
        </section>
      </div>

      <section className="mt-12 max-w-3xl">
        <h2 className="font-display text-2xl">How the numbers are worked out</h2>
        <dl className="mt-4 space-y-4">
          {STEPS.map((step) => (
            <div key={step.term} className="grid gap-1 sm:grid-cols-[12rem_1fr] sm:gap-6">
              <dt className="font-semibold">{step.term}</dt>
              <dd className="text-muted">{step.detail}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
