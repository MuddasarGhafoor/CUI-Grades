import Link from "next/link";
import type { CSSProperties } from "react";
import { SavedProgress } from "@/components/home/saved-progress";
import { Icon } from "@/components/ui/icons";
import { CALCULATORS, type NavItem } from "@/lib/nav";
import { TONE_CLASS, TONE_VAR } from "@/lib/tones";

/** Hero reads Marks, GPA, CGPA. The cards on the right follow the same order. */
const ORDER = ["/internal-marks", "/gpa-calculator", "/cgpa-calculator"];
const ITEMS = ORDER.map((href) => CALCULATORS.find((c) => c.href === href)).filter(
  (c): c is NavItem => c !== undefined,
);

/** Each word in its area's colour, pulled slightly towards the background for a deeper shade. */
const wordColor = (item: NavItem) =>
  ({ "--word": `color-mix(in srgb, ${TONE_VAR[item.tone]} 82%, var(--bg))` }) as CSSProperties;

export default function Home() {
  return (
    <div>
      {/*
        Hero: fits one screen on laptops, so the home page never scrolls there.
        Height = screen - navbar (4rem) - page padding (2 x 2.5rem) - footer (about 4.5rem).
        Sizes use vh so the words and cards shrink on shorter screens.
      */}
      <section className="grid items-center gap-8 md:min-h-[calc(100dvh-13.5rem)] lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-14">
        <div>
          <h1 className="font-display text-[length:min(15vh,22vw)] leading-[0.86] lg:text-[length:min(15vh,11vw)]">
            {ITEMS.map((item) => (
              <span key={item.href} style={wordColor(item)} className="block text-[color:var(--word)]">
                {item.name}
              </span>
            ))}
            <span className="sr-only"> calculators</span>
          </h1>
          <p className="mt-[3vh] max-w-xl text-base text-muted sm:text-lg">
            Calculators for <span className="text-fg">COMSATS students</span>, on the official CUI
            grading scale.
          </p>
          <SavedProgress />
        </div>

        <nav aria-label="Calculators" className="flex flex-col gap-3">
          {ITEMS.map((item) => {
            const tone = TONE_CLASS[item.tone];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`card group relative flex flex-col overflow-hidden rounded-l-none! px-5 py-[min(2.2vh,1rem)] pl-6 transition-colors duration-200 ${tone.hoverBorder}`}
              >
                <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-[3px] ${tone.bg}`} />
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-semibold">{item.title}</h2>
                  <Icon
                    name="arrowRight"
                    size={18}
                    className={`shrink-0 -rotate-45 text-muted transition-[color,translate] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${tone.hoverText}`}
                  />
                </div>
                <div aria-hidden="true" className="my-[min(1.6vh,0.75rem)] h-px bg-line" />
                <p className="text-sm text-muted">{item.description}</p>
              </Link>
            );
          })}
        </nav>
      </section>
    </div>
  );
}
