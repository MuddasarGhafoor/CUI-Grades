import Link from "next/link";
import type { CSSProperties } from "react";
import { SavedProgress } from "@/components/home/saved-progress";
import { Icon } from "@/components/ui/icons";
import { CALCULATORS } from "@/lib/nav";

/** Each name is a little darker than the one above it. */
const SHADES = [82, 66, 52];

const shade = (i: number) =>
  ({ "--shade": `color-mix(in srgb, var(--fg) ${SHADES[i]}%, var(--bg))` }) as CSSProperties;

export default function Home() {
  return (
    <div>
      {/* Hero: fills the screen below the navbar. The three names say what the site is for. */}
      <section className="flex flex-col justify-center py-10 md:min-h-[calc(100dvh-4rem-2.5rem)] md:py-0">
        <h1 className="font-display text-[length:min(13vh,10vw)] leading-[1.02]">
          {CALCULATORS.map((item, i) => (
            <span
              key={item.href}
              style={shade(i)}
              className={`block text-[color:var(--shade)] ${i > 0 ? "mt-[0.12em]" : ""}`}
            >
              {item.name}
            </span>
          ))}
          <span className="sr-only"> calculators for COMSATS University students</span>
        </h1>
      </section>

      <SavedProgress />

      <section aria-label="Calculators" className="mt-12 grid gap-5 md:grid-cols-3">
        {CALCULATORS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="card group flex flex-col p-5 transition-colors duration-200 hover:border-accent/60"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">{item.title}</h2>
              <Icon
                name="arrowRight"
                size={18}
                className="shrink-0 -rotate-45 text-muted transition-[color,translate] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
              />
            </div>
            <div aria-hidden="true" className="my-4 h-px bg-line" />
            <p className="text-sm text-muted">{item.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
