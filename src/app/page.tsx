import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { NAV_ITEMS } from "@/lib/nav";

export default function Home() {
  const calculators = NAV_ITEMS.filter((item) => item.href !== "/");

  return (
    <div>
      <section className="pb-10 pt-4 sm:pt-8">
        <p className="mb-3 inline-flex rounded-full border border-line-strong bg-surface-2 px-3 py-1 text-xs font-semibold text-muted">
          For COMSATS students · Fall 2021+ grading scale
        </p>
        <h1 className="font-display text-4xl leading-tight tracking-wide sm:text-5xl">
          Your grades, <span className="text-gradient">sorted.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Work out internal marks, semester GPA and CGPA with totals already filled in, quick
          keyboard entry and voice commands.
        </p>
      </section>

      <section aria-label="Calculators" className="grid gap-4 md:grid-cols-3">
        {calculators.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-2xl border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-surface-2 text-accent transition group-hover:bg-brand group-hover:text-on-accent">
              <Icon name={item.icon} size={22} />
            </span>
            <h2 className="mt-4 font-display text-xl tracking-wide">{item.label}</h2>
            <p className="mt-1 text-sm text-muted">{item.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
              Open <Icon name="arrowRight" size={16} className="transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
