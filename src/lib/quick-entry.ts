import { readMark } from "./calc";
import type { Mark } from "./types";

/**
 * Quick entry fills a whole list in one line:
 *   "8 7 9 6"      four marks, totals unchanged
 *   "8 - 9 6"      "-" leaves the second one empty
 *   "8/15 7 9"     "/15" also changes that entry's total
 * Commas and semicolons work as separators too.
 */

export type QuickToken = { obtained: string; total?: string };

export type QuickParse = { ok: true; tokens: QuickToken[] } | { ok: false; error: string };

/** Lists stay a sensible size even if someone pastes a long line. */
export const MAX_ENTRIES = 20;

const NUMBER = String.raw`\d+(?:\.\d+)?|\.\d+`;
const TOKEN = new RegExp(`^(${NUMBER})(?:/(${NUMBER}))?$`);

export function parseQuickEntry(text: string): QuickParse {
  const parts = text.trim().split(/[\s,;]+/).filter(Boolean);
  if (parts.length === 0) return { ok: false, error: "Type at least one mark." };
  if (parts.length > MAX_ENTRIES) return { ok: false, error: `That's more than ${MAX_ENTRIES} marks.` };

  const tokens: QuickToken[] = [];
  for (const part of parts) {
    if (part === "-" || part === "_") {
      tokens.push({ obtained: "" });
      continue;
    }
    const match = part.match(TOKEN);
    if (!match) {
      return { ok: false, error: `"${part}" isn't a mark. Use numbers like 8 or 8/10.` };
    }
    tokens.push({ obtained: match[1], total: match[2] });
  }
  return { ok: true, tokens };
}

/** Writes tokens over the list from the first entry. Entries past the last token are kept. */
export function mergeQuickEntry(list: Mark[], tokens: QuickToken[], fallbackTotal: number): Mark[] {
  const next = list.map((m) => ({ ...m }));
  tokens.forEach((token, i) => {
    if (i < next.length) {
      next[i].obtained = token.obtained;
      if (token.total !== undefined) next[i].total = token.total;
    } else {
      const previousTotal = next.at(-1)?.total ?? String(fallbackTotal);
      next.push({ obtained: token.obtained, total: token.total ?? previousTotal });
    }
  });
  return next;
}

/** First mark that would not count after merging, described for the user, or null. */
export function findQuickEntryProblem(list: Mark[], singular: string): string | null {
  for (let i = 0; i < list.length; i++) {
    const mark = list[i];
    if (mark.obtained === "" || readMark(mark)) continue;
    const total = Number(mark.total);
    if (!(total > 0)) return `The total for ${singular} ${i + 1} must be above 0.`;
    return `${mark.obtained} is more than ${mark.total} (${singular} ${i + 1}).`;
  }
  return null;
}

/** Current marks as quick-entry text, so the box opens with what is already there. */
export function toQuickEntryText(list: Mark[]): string {
  if (list.every((m) => m.obtained.trim() === "")) return "";
  const text = list.map((m) => m.obtained.trim() || "-");
  while (text.at(-1) === "-") text.pop();
  return text.join(" ");
}
