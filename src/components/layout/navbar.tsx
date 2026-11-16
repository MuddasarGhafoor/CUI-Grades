"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { Icon } from "@/components/ui/icons";
import { CALCULATORS, GUIDE } from "@/lib/nav";
import { ThemeToggle } from "./theme-toggle";

/**
 * Three columns: logo on the far left, the three calculators centred,
 * and the Guide and theme buttons on the far right.
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

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {CALCULATORS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-9 items-center rounded-lg px-3.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-surface-2 text-fg shadow-[inset_0_0_0_1px_var(--line)]"
                    : "text-muted hover:bg-surface-2/60 hover:text-fg"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="col-start-3 flex items-center gap-2 justify-self-end">
          <Link
            href={GUIDE.href}
            aria-label="Guide"
            title="Guide"
            aria-current={onGuide ? "page" : undefined}
            className={`grid size-9 place-items-center rounded-lg border bg-surface-2 transition-colors ${
              onGuide
                ? "border-accent text-accent"
                : "border-line-strong text-muted hover:border-accent/50 hover:text-fg"
            }`}
          >
            <Icon name="book" size={17} />
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <nav aria-label="Main" className="flex items-center gap-1 border-t border-line px-2 py-1.5 md:hidden">
        {CALCULATORS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex h-8 flex-1 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                active ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {item.shortLabel}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
