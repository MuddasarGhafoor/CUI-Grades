/** Three rising bars: marks adding up to a grade. The tallest bar uses the accent colour. */
export function LogoMark({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`block shrink-0 ${className}`}
      aria-hidden="true"
    >
      <rect x="2" y="13" width="5" height="9" rx="1" fill="currentColor" />
      <rect x="9.5" y="8" width="5" height="14" rx="1" fill="currentColor" />
      <rect x="17" y="2" width="5" height="20" rx="1" fill="var(--accent)" />
    </svg>
  );
}

/**
 * Logo plus wordmark. The wordmark sits on a fixed-height line box so Carter One's tall
 * ascender doesn't push it off-centre next to the icon.
 */
export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="flex h-[22px] items-center font-display text-[19px] leading-none">CUI-Grades</span>
    </span>
  );
}
