"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { Icon } from "@/components/ui/icons";
import { NAV_ITEMS } from "@/lib/nav";
import { ThemeToggle } from "./theme-toggle";

type SidebarProps = {
  open: boolean;
  onNavigate: () => void;
  onClose: () => void;
};

export function Sidebar({ open, onNavigate, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      id="app-sidebar"
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-line bg-surface/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
        open ? "translate-x-0 shadow-pop" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-5 pb-4 pt-5">
        <Link href="/" onClick={onNavigate} className="rounded-xl">
          <Logo />
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="grid size-9 place-items-center rounded-lg text-muted hover:text-fg lg:hidden"
        >
          <Icon name="close" />
        </button>
      </div>

      <nav aria-label="Main" className="px-3">
        <p className="px-3 pb-2 pt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
          Calculators
        </p>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-semibold transition ${
                    active
                      ? "bg-surface-2 text-fg shadow-[inset_0_0_0_1px_var(--line-strong)]"
                      : "text-muted hover:bg-surface-2/60 hover:text-fg"
                  }`}
                >
                  <span
                    className={`grid size-8 place-items-center rounded-lg transition ${
                      active ? "bg-brand text-on-accent" : "bg-sunken text-muted group-hover:text-accent"
                    }`}
                  >
                    <Icon name={item.icon} size={17} />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-5 px-3">
        <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
          Subjects
        </p>
        <div className="mx-1 rounded-xl border border-dashed border-line-strong px-4 py-4 text-sm text-muted">
          <Icon name="book" size={18} className="mb-2 text-accent" />
          Subjects you add in Internal marks will appear here.
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line px-5 py-4">
        <span className="text-xs text-muted">Theme</span>
        <ThemeToggle withLabel />
      </div>
    </aside>
  );
}
