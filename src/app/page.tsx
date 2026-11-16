import Link from "next/link";
import { SavedProgress } from "@/components/home/saved-progress";
import { Icon } from "@/components/ui/icons";
import { CALCULATORS, GUIDE } from "@/lib/nav";

export default function Home() {
  return (
    <div>
      <section className="max-w-3xl pt-2">
        <h1 className="font-display text-4xl leading-[1.15] sm:text-5xl">
          Internal Marks, GPA and CGPA for CUI Students
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Totals are filled in for you, Enter moves you to the next box, and you can say your marks
          out loud instead of typing them. Your marks are saved in your own browser, not on a server.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={CALCULATORS[0].href}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent shadow-[0_1px_2px_rgb(0_0_0/0.2)] transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_88%,white)]"
          >
            Start With Internal Marks
            <Icon name="arrowRight" size={16} />
          </Link>
          <Link
            href={GUIDE.href}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-line-strong bg-surface-2 px-5 text-sm font-semibold transition-colors hover:border-accent/50"
          >
            Read the Guide
          </Link>
        </div>
      </section>

      <SavedProgress />

      <section aria-label="Calculators" className="mt-10 grid gap-5 md:grid-cols-3">
        {CALCULATORS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="card group flex flex-col p-5 transition-[border-color,box-shadow] duration-200 hover:border-accent/60"
          >
            <span className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <Icon
                name="arrowRight"
                size={18}
                className="shrink-0 text-muted transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
              />
            </span>
            <p className="mt-1 text-sm text-muted">{item.description}</p>
            <ul className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              {item.highlights.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <Icon name="check" size={16} className="mt-0.5 shrink-0 text-accent" />
                  {point}
                </li>
              ))}
            </ul>
          </Link>
        ))}
      </section>

      <Link
        href={GUIDE.href}
        className="card group mt-5 flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:border-accent/60"
      >
        <span className="flex items-center gap-3">
          <Icon name="book" size={20} className="shrink-0 text-accent" />
          <span>
            <span className="block font-semibold">New Here? Read the Guide</span>
            <span className="block text-sm text-muted">{GUIDE.description}</span>
          </span>
        </span>
        <Icon name="arrowRight" size={18} className="shrink-0 text-muted group-hover:text-accent" />
      </Link>
    </div>
  );
}
