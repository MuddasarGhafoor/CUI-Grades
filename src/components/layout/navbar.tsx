"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { Icon } from "@/components/ui/icons";
import { CALCULATORS, GUIDE } from "@/lib/nav";
import { ThemeToggle } from "./theme-toggle";

/** Line under a nav link: teal when active, grows in on hover otherwise. */
function Underline({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-x-3 -bottom-px h-0.5 origin-center rounded-full transition-[scale,background-color] duration-200 ${
        active ? "scale-x-100 bg-accent" : "scale-x-0 bg-line-strong group-hover:scale-x-100"
      }`}
    />
  );
}

/**
 * Three columns: logo on the far left, the three calculators centred,
 * and the Guide and theme icons on the far right.
 */
export function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const onGuide = isActive(GUIDE.href);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/85 backdrop-blur-md print:hidden">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="CUI-Grades home"
          className="flex items-center justify-self-start rounded-lg"
        >
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center md:flex">
          {CALCULATORS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`group relative flex h-16 items-center px-4 text-sm font-medium transition-colors ${
                  active ? "text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {item.label}
                <Underline active={active} />
              </Link>
            );
          })}
        </nav>

        <div className="col-start-3 flex items-center gap-1 justify-self-end">
          <Link
            href={GUIDE.href}
            aria-label="Guide"
            title="Guide"
            aria-current={onGuide ? "page" : undefined}
            className={`grid size-9 place-items-center rounded-lg transition-colors ${
              onGuide ? "text-accent" : "text-muted hover:text-fg"
            }`}
          >
            <Icon name="book" size={19} />
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <nav aria-label="Main" className="flex items-center border-t border-line md:hidden">
        {CALCULATORS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`group relative flex h-10 flex-1 items-center justify-center text-sm font-medium transition-colors ${
                active ? "text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {item.shortLabel}
              <Underline active={active} />
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
