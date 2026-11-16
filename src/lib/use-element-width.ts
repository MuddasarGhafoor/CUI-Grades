import { useCallback, useState } from "react";

/**
 * Live width of an element in pixels, so SVG charts can draw at real size instead of scaling text.
 * Uses a callback ref so it starts measuring whenever the element mounts, even after first render.
 */
export function useElementWidth<T extends HTMLElement>(fallback = 600) {
  const [width, setWidth] = useState(fallback);

  const ref = useCallback((el: T | null) => {
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.round(entry.contentRect.width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}
