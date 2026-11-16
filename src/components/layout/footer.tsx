import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { NAV_ITEMS } from "@/lib/nav";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-line bg-surface/50">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm text-muted">
            Unofficial student tool. Not affiliated with COMSATS University Islamabad. Grades use the
            CUI scale for Fall 2021 onwards.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted transition-colors hover:text-fg">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
