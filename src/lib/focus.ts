import type { KeyboardEvent } from "react";

const SELECTOR = "input[data-mark-input]";

/** Moves focus to the next mark box on the page, like Tab. On the last box it just blurs. */
export function focusNextMarkInput(from: HTMLElement) {
  const inputs = Array.from(document.querySelectorAll<HTMLInputElement>(SELECTOR));
  const next = inputs[inputs.indexOf(from as HTMLInputElement) + 1];
  if (next) {
    next.focus();
    // Cursor at the end, no text highlight.
    const end = next.value.length;
    next.setSelectionRange(end, end);
  } else {
    from.blur();
  }
}

/** Enter behaves like Tab inside mark boxes, so you can type a number and hit Enter. */
export function handleMarkKeyDown(e: KeyboardEvent<HTMLInputElement>) {
  if (e.key !== "Enter") return;
  e.preventDefault();
  focusNextMarkInput(e.currentTarget);
}
