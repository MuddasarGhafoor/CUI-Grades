"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { NAV_ITEMS } from "@/lib/nav";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/85 backdrop-blur-md print:hidden">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" aria-label="CUI-Grades home" className="flex shrink-0 items-center rounded-lg">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden flex-1 items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors ${
                  active ? "bg-surface-2 text-fg shadow-[inset_0_0_0_1px_var(--line)]" : "text-muted hover:bg-surface-2/60 hover:text-fg"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center">
          <ThemeToggle />
        </div>
      </div>

      <nav aria-label="Main" className="flex items-center gap-1 border-t border-line px-2 py-1.5 md:hidden">
        {NAV_ITEMS.map((item) => {
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
