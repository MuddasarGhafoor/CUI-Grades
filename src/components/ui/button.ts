type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const BASE =
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-[background-color,border-color,color,box-shadow] duration-150 disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-on-accent shadow-[0_1px_2px_rgb(0_0_0/0.2)] hover:bg-[color-mix(in_srgb,var(--accent)_88%,white)]",
  secondary: "border border-line-strong bg-surface-2 text-fg hover:border-accent/50 hover:bg-surface",
  ghost: "text-muted hover:bg-surface-2 hover:text-fg",
  danger: "text-err hover:bg-err/10",
};

const SIZES: Record<Size, string> = {
  sm: "h-7 px-2.5 text-[13px]",
  md: "h-8 px-3.5 text-[13px]",
};

export function buttonClass(variant: Variant = "secondary", size: Size = "md"): string {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]}`;
}
