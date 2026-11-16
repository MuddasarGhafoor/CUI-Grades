type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const BASE =
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:opacity-90",
  secondary: "border border-line-strong bg-surface text-fg hover:bg-surface-2",
  ghost: "text-muted hover:bg-surface-2 hover:text-fg",
  danger: "text-err hover:bg-err/10",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-2.5",
  md: "h-9 px-3.5",
};

export function buttonClass(variant: Variant = "secondary", size: Size = "md"): string {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]}`;
}
