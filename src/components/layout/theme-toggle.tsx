"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/icons";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

const getServerSnapshot = (): Theme => "dark";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const next: Theme = theme === "dark" ? "light" : "dark";

  function toggle() {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be blocked (private mode). The theme still switches for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="grid size-9 place-items-center rounded-lg border border-line-strong bg-surface-2 text-muted transition-colors hover:border-accent/50 hover:text-fg"
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} size={17} />
    </button>
  );
}
