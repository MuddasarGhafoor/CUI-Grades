"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { NAV_ITEMS } from "@/lib/nav";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const pathname = usePathname();

  const links = (mobile: boolean) =>
    NAV_ITEMS.map((item) => {
      const active = pathname.startsWith(item.href);
      return (
        <Link
          key={item.href}
          href={item.href}
          aria-current={active ? "page" : undefined}
          className={`relative flex items-center justify-center text-sm font-medium transition-colors ${
            mobile ? "flex-1 py-2.5" : "h-full"
          } ${active ? "text-fg" : "text-muted hover:text-fg"}`}
        >
          {mobile ? item.shortLabel : item.label}
          {active && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-accent" />}
        </Link>
      );
    });

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-8 px-4 sm:px-6">
        <Link href="/" className="rounded-md">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden h-full items-stretch gap-6 sm:flex">
          {links(false)}
        </nav>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
      <nav aria-label="Main" className="flex border-t border-line sm:hidden">
        {links(true)}
      </nav>
    </header>
  );
}
