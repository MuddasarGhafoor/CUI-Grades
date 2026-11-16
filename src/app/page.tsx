import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { NAV_ITEMS } from "@/lib/nav";

export default function Home() {
  return (
    <div className="max-w-3xl">
      <section className="border-b border-line pb-8">
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">
          Internal marks, GPA and CGPA for CUI students
        </h1>
        <p className="mt-3 text-muted">
          Totals are filled in for you, Tab moves you to the next box, and you can say your marks
          out loud instead of typing them. Everything stays saved in your browser.
        </p>
      </section>

      <ul className="divide-y divide-line">
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

      <p className="mt-8 border-l-2 border-accent pl-4 text-sm text-muted">
        Grades follow the official CUI scale for students admitted in Fall 2021 or later. A starts at
        85%, and 50% (D) is the minimum pass.
      </p>
    </div>
  );
}
