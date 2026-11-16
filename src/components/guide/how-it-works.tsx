type Step = {
  title: string;
  explain: string;
  /** A worked example, one line per calculation step. */
  example: string[];
  result: string;
};

const STEPS: Step[] = [
  {
    title: "Quizzes and Assignments",
    explain: "All marks in the list are added up, divided by the total, then scaled to the weight.",
    example: ["8 + 7 + 9 + 7 = 31 out of 40", "31 ÷ 40 × 15"],
    result: "11.63 of 15",
  },
  {
    title: "Internal Marks",
    explain: "Everything before the final exam. Theory and lab each have 50 internal marks.",
    example: ["Quizzes 15 + Assignments 10", "+ Midterm 25"],
    result: "50 marks",
  },
  {
    title: "Theory and Lab Together",
    explain: "A subject with a lab combines both percentages by their credit hours.",
    example: ["3+1 subject: theory 78%, lab 90%", "(78 × 3 + 90 × 1) ÷ 4"],
    result: "81%",
  },
  {
    title: "Rounding",
    explain: "The final percentage is rounded to a whole number before the grade is picked.",
    example: ["78.6% rounds to 79%", "70.4% rounds to 70%"],
    result: "B+ and B-",
  },
  {
    title: "GPA and CGPA",
    explain: "Grade points times credit hours, added up, divided by all credit hours.",
    example: ["(4.00 × 3 + 3.33 × 3 + 3.00 × 2)", "÷ 8 credit hours"],
    result: "GPA 3.50",
  },
  {
    title: "Final Exam Target",
    explain: "Works backwards from your internal marks to the lowest final score that still gets the grade.",
    example: ["A needs 84.5, internal is 40.63", "84.5 - 40.63 = 43.87"],
    result: "44 of 50 in the final",
  },
];

export function HowItWorks() {
  return (
    <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {STEPS.map((step, i) => (
        <li key={step.title} className="card flex flex-col p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full border border-accent/40 text-[11px] font-semibold text-accent">
              {i + 1}
            </span>
            <h3 className="text-sm font-semibold">{step.title}</h3>
          </div>
          <p className="mt-2.5 text-[13px] text-muted">{step.explain}</p>
          <div className="mt-auto pt-4">
            <div className="overflow-hidden rounded-lg border border-line">
              <div className="space-y-0.5 bg-surface-2/50 px-3 py-2 font-mono text-xs text-muted">
                {step.example.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <p className="flex items-center justify-between border-t border-line px-3 py-1.5 text-[13px]">
                <span className="text-xs text-muted">Result</span>
                <span className="font-semibold tabular-nums text-accent">{step.result}</span>
              </p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
