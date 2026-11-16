import Link from "next/link";
import type { CSSProperties } from "react";
import { SavedProgress } from "@/components/home/saved-progress";
import { Icon } from "@/components/ui/icons";
import { CALCULATORS } from "@/lib/nav";

/** Each name is a little darker than the one above it; hovering brings it to full strength. */
const SHADES = [82, 66, 52];

export default function Home() {
  return (
    <div>
      {/* Hero: fills the screen below the navbar. Each calculator row takes a quarter of it. */}
      <section className="flex flex-col md:min-h-[calc(100dvh-4rem-2.5rem)]">
        <div className="flex flex-1 flex-col justify-center pb-8 md:pb-6">
          <p className="text-sm font-medium text-accent">For COMSATS University students</p>
          <h1 className="mt-2 max-w-2xl text-xl font-semibold sm:text-2xl">
            Internal Marks, GPA and CGPA, worked out the way CUI does it.
          </h1>
          <p className="mt-2 max-w-2xl text-muted">
            Totals are filled in, Enter moves to the next box, and you can say your marks out loud.
          </p>
        </div>

        <ul className="border-t border-line">
          {CALCULATORS.map((item, i) => (
            <li key={item.href} className="border-b border-line">
              <Link
                href={item.href}
                style={{ "--shade": `color-mix(in srgb, var(--fg) ${SHADES[i]}%, var(--bg))` } as CSSProperties}
                className="group flex items-center justify-between gap-6 py-6 md:h-[25vh] md:py-0"
              >
                <span className="font-display text-[length:min(13vh,10vw)] leading-[0.95] text-[color:var(--shade)] transition-colors duration-300 group-hover:text-fg">
                  {item.name}
                </span>
                <span className="flex shrink-0 items-center gap-6">
                  <span className="hidden max-w-[16rem] text-right text-sm text-muted xl:block">
                    {item.description}
                  </span>
                  <Icon
                    name="arrowRight"
                    size={36}
                    className="text-line-strong transition-[color,transform] duration-300 group-hover:translate-x-1 group-hover:text-accent"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <SavedProgress />

      <section aria-label="Calculators" className="mt-12 grid gap-5 md:grid-cols-3">
        {CALCULATORS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="card p-5 transition-colors duration-200 hover:border-accent/60"
          >
            <h2 className="font-semibold">{item.title}</h2>
            <p className="mt-1 text-sm text-muted">{item.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
