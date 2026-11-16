/**
 * The site's colour roles. Each area of the app has its own tone so pages are easy to tell apart:
 * Marks teal, GPA blue, CGPA violet, Guide amber. Class names are written out in full so
 * Tailwind can find them.
 */
export type Tone = "teal" | "blue" | "violet" | "amber" | "rose" | "green";

export const TONE_VAR: Record<Tone, string> = {
  teal: "var(--tone-teal)",
  blue: "var(--tone-blue)",
  violet: "var(--tone-violet)",
  amber: "var(--tone-amber)",
  rose: "var(--tone-rose)",
  green: "var(--tone-green)",
};

export const TONE_CLASS: Record<
  Tone,
  { text: string; bg: string; soft: string; border: string; hoverBorder: string; hoverText: string }
> = {
  teal: {
    text: "text-tone-teal",
    bg: "bg-tone-teal",
    soft: "bg-tone-teal/12 text-tone-teal",
    border: "border-tone-teal",
    hoverBorder: "hover:border-tone-teal/60",
    hoverText: "group-hover:text-tone-teal",
  },
  blue: {
    text: "text-tone-blue",
    bg: "bg-tone-blue",
    soft: "bg-tone-blue/12 text-tone-blue",
    border: "border-tone-blue",
    hoverBorder: "hover:border-tone-blue/60",
    hoverText: "group-hover:text-tone-blue",
  },
  violet: {
    text: "text-tone-violet",
    bg: "bg-tone-violet",
    soft: "bg-tone-violet/12 text-tone-violet",
    border: "border-tone-violet",
    hoverBorder: "hover:border-tone-violet/60",
    hoverText: "group-hover:text-tone-violet",
  },
  amber: {
    text: "text-tone-amber",
    bg: "bg-tone-amber",
    soft: "bg-tone-amber/12 text-tone-amber",
    border: "border-tone-amber",
    hoverBorder: "hover:border-tone-amber/60",
    hoverText: "group-hover:text-tone-amber",
  },
  rose: {
    text: "text-tone-rose",
    bg: "bg-tone-rose",
    soft: "bg-tone-rose/12 text-tone-rose",
    border: "border-tone-rose",
    hoverBorder: "hover:border-tone-rose/60",
    hoverText: "group-hover:text-tone-rose",
  },
  green: {
    text: "text-tone-green",
    bg: "bg-tone-green",
    soft: "bg-tone-green/12 text-tone-green",
    border: "border-tone-green",
    hoverBorder: "hover:border-tone-green/60",
    hoverText: "group-hover:text-tone-green",
  },
};

/** Colour for a letter grade: green for A, blue for B, amber for C, rose for D and F. */
export function gradeTone(letter: string | null | undefined): Tone | null {
  if (!letter) return null;
  const first = letter.charAt(0).toUpperCase();
  if (first === "A") return "green";
  if (first === "B") return "blue";
  if (first === "C") return "amber";
  return "rose";
}
