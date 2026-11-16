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

export function ThemeToggle({ withLabel = false }: { withLabel?: boolean }) {
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
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-line-strong bg-surface-2 px-3 text-sm font-semibold text-fg transition hover:-translate-y-px hover:border-accent"
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
      {withLabel && <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>}
    </button>
  );
}
