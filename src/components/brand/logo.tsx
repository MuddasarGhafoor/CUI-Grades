import { useId } from "react";

/** Brand mark: a mortarboard over a rising grade line, on a teal-to-blue tile. */
export function LogoMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  const gradientId = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="CUI-Grades logo"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2dd4bf" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill={`url(#${gradientId})`} />
      {/* mortarboard */}
      <path d="M24 9 39 15.5 24 22 9 15.5Z" fill="#0a0f1c" />
      <path d="M15.5 19v5.2c0 2.4 3.8 4.3 8.5 4.3s8.5-1.9 8.5-4.3V19L24 22.7Z" fill="#0a0f1c" />
      <path d="M36.5 16.6v6.2" stroke="#0a0f1c" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="36.5" cy="23.6" r="1.7" fill="#0a0f1c" />
      {/* rising grade line */}
      <path
        d="M9.5 39.5 17 34l5.5 2.5L33 30.5"
        fill="none"
        stroke="#0a0f1c"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="37" cy="28.4" r="2.6" fill="#0a0f1c" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark size={compact ? 34 : 42} className="shrink-0 drop-shadow-[0_8px_20px_rgba(45,212,191,0.25)]" />
      <span className="min-w-0 leading-tight">
        <span className={`block font-display tracking-wide ${compact ? "text-lg" : "text-xl"}`}>
          CUI<span className="text-gradient">-Grades</span>
        </span>
        {!compact && (
          <span className="block text-xs text-muted">GPA · CGPA · Internal marks</span>
        )}
      </span>
    </span>
  );
}
