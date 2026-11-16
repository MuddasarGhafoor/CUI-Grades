"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Icon } from "@/components/ui/icons";
import { Footer } from "./footer";
import { Sidebar } from "./sidebar";
import { ThemeToggle } from "./theme-toggle";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="min-h-dvh">
      <Sidebar open={menuOpen} onNavigate={close} onClose={close} />

      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <div className="flex min-h-dvh flex-col lg:pl-72">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-bg/80 px-4 py-3 backdrop-blur-xl lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-controls="app-sidebar"
            aria-expanded={menuOpen}
            className="grid size-10 place-items-center rounded-xl border border-line-strong bg-surface-2"
          >
            <Icon name="menu" />
          </button>
          <Link href="/" className="rounded-xl">
            <Logo compact />
          </Link>
          <ThemeToggle />
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
