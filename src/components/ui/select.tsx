"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Icon } from "./icons";

export type SelectOption<T extends string | number> = {
  value: T;
  label: string;
  /** Small text on the right of the option, e.g. grade points. */
  hint?: string;
  disabled?: boolean;
};

type SelectProps<T extends string | number> = {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  /** Visible label above the button. */
  label?: string;
  /** Accessible name when there is no visible label. */
  ariaLabel?: string;
  size?: "sm" | "md";
  /** Text on the button. Defaults to the selected option's label. */
  display?: ReactNode;
  /** Which edge of the button the menu lines up with. */
  align?: "start" | "end";
  className?: string;
  buttonClassName?: string;
};

type Position = { top: number; left: number; width: number; up: boolean };

const MENU_ROOM = 280;

/**
 * Custom dropdown used everywhere instead of the native <select>.
 * Keyboard: arrows, Home/End, Enter/Space to pick, Esc to close, letters to jump.
 * The menu is portalled to <body> with fixed positioning, so scrolling panels never clip it,
 * and it opens upwards when there is not enough room below.
 */
export function Select<T extends string | number>({
  value,
  options,
  onChange,
  label,
  ariaLabel,
  size = "md",
  display,
  align = "start",
  className = "",
  buttonClassName = "",
}: SelectProps<T>) {
  const id = useId();
  const buttonId = `${id}-button`;
  const labelId = `${id}-label`;
  const valueId = `${id}-value`;
  const listId = `${id}-list`;
  const optionId = (i: number) => `${id}-option-${i}`;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: "", at: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [position, setPosition] = useState<Position | null>(null);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const place = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const below = window.innerHeight - rect.bottom;
    const up = below < MENU_ROOM && rect.top > below;
    setPosition({
      top: up ? rect.top - 6 : rect.bottom + 6,
      left: align === "end" ? rect.right : rect.left,
      width: rect.width,
      up,
    });
  }, [align]);

  const enabledFrom = (start: number, step: 1 | -1) => {
    for (let i = start, n = 0; n < options.length; i += step, n++) {
      const index = (i + options.length) % options.length;
      if (!options[index].disabled) return index;
    }
    return -1;
  };

  function openMenu(startAt = selectedIndex) {
    place();
    setActive(startAt >= 0 && !options[startAt]?.disabled ? startAt : enabledFrom(0, 1));
    setOpen(true);
  }

  function closeMenu(refocus = true) {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  }

  function choose(index: number) {
    const option = options[index];
    if (!option || option.disabled) return;
    if (option.value !== value) onChange(option.value);
    closeMenu();
  }

  // Move focus into the menu when it opens, and keep the active option visible.
  useEffect(() => {
    if (open) listRef.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open || active < 0) return;
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  // Close on outside clicks; follow the button while the page scrolls or resizes.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target) || listRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place]);

  function onButtonKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      openMenu(e.key === "ArrowUp" ? enabledFrom(selectedIndex - 1, -1) : selectedIndex);
    }
  }

  function onListKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    // React events bubble through portals; keep Esc/Enter here from reaching parent forms.
    e.stopPropagation();
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => enabledFrom(i + 1, 1));
        return;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => enabledFrom(i - 1, -1));
        return;
      case "Home":
        e.preventDefault();
        setActive(enabledFrom(0, 1));
        return;
      case "End":
        e.preventDefault();
        setActive(enabledFrom(options.length - 1, -1));
        return;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(active);
        return;
      case "Escape":
        e.preventDefault();
        closeMenu();
        return;
      case "Tab":
        e.preventDefault();
        closeMenu();
        return;
    }
    // Type a letter to jump, e.g. "b" then "+" for B+.
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const now = Date.now();
      const text = (now - typeahead.current.at < 700 ? typeahead.current.text : "") + e.key.toLowerCase();
      typeahead.current = { text, at: now };
      const match = options.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(text));
      if (match >= 0) setActive(match);
    }
  }

  const height = size === "sm" ? "h-8 text-sm" : "h-9 text-sm";
  const transform = `translate(${align === "end" ? "-100%" : "0"}, ${position?.up ? "-100%" : "0"})`;

  return (
    <div className={className}>
      {label && (
        <label id={labelId} htmlFor={buttonId} className="mb-1 block text-xs font-medium text-muted">
          {label}
        </label>
      )}
      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={label ? undefined : ariaLabel}
        aria-labelledby={label ? `${labelId} ${valueId}` : undefined}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onButtonKeyDown}
        className={`field flex w-full items-center justify-between gap-2 text-left ${height} ${
          open ? "border-accent" : ""
        } ${buttonClassName}`}
      >
        <span id={valueId} className="truncate">
          {display ?? selected?.label ?? "Select"}
        </span>
        <Icon name="chevronUpDown" size={15} className="shrink-0 text-muted" />
      </button>

      {open &&
        position &&
        createPortal(
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={label ? labelId : undefined}
            aria-label={label ? undefined : ariaLabel}
            aria-activedescendant={active >= 0 ? optionId(active) : undefined}
            onKeyDown={onListKeyDown}
            onBlur={(e) => {
              if (e.relatedTarget !== buttonRef.current) setOpen(false);
            }}
            style={{ top: position.top, left: position.left, minWidth: position.width, transform }}
            className="fixed z-50 max-h-64 overflow-y-auto rounded-lg border border-line-strong bg-surface p-1 text-sm text-fg shadow-pop outline-none"
          >
            {options.map((option, i) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={String(option.value)}
                  id={optionId(i)}
                  data-index={i}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  onPointerMove={() => !option.disabled && setActive(i)}
                  onClick={() => choose(i)}
                  className={`flex cursor-pointer select-none items-center gap-3 rounded-md px-2.5 py-1.5 whitespace-nowrap ${
                    option.disabled ? "cursor-not-allowed text-muted/50" : ""
                  } ${i === active && !option.disabled ? "bg-surface-2" : ""}`}
                >
                  <span className={`flex-1 ${isSelected ? "font-semibold" : ""}`}>{option.label}</span>
                  {option.hint && <span className="text-xs tabular-nums text-muted">{option.hint}</span>}
                  <Icon
                    name="check"
                    size={15}
                    className={`shrink-0 text-accent ${isSelected ? "" : "invisible"}`}
                  />
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </div>
  );
}
