import type { ComponentKey, ListKey } from "../assessments";
import { MAX_ENTRIES } from "../quick-entry";

/**
 * Turns one spoken or typed sentence into a command. Pure: it never touches app data.
 * Number words become digits first ("eight out of ten" → "8 / 10").
 */

export type VoiceCommand =
  | { type: "navigate"; href: string; label: string }
  | { type: "add-subject"; name: string }
  | { type: "switch-subject"; query: string }
  | { type: "step-subject"; direction: 1 | -1 }
  | { type: "credits"; theory: number; lab: number }
  | { type: "mark"; key: ComponentKey; index: number | null; obtained: number; total: number | null }
  | { type: "bulk"; key: ListKey; text: string }
  | { type: "grade"; letter: string | null }
  | { type: "semester"; gpa: number; credits: number }
  | { type: "undo" }
  | { type: "help" }
  | { type: "stop" };

export type ParseResult = { ok: true; command: VoiceCommand } | { ok: false; error: string };

const ok = (command: VoiceCommand): ParseResult => ({ ok: true, command });
const fail = (error: string): ParseResult => ({ ok: false, error });

/* ---------- number words ---------- */

const ONES: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19,
};
const TENS: Record<string, number> = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};
const ORDINALS: Record<string, number> = {
  first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10,
};

const isDigit = (w: string | undefined) => w !== undefined && /^\d$/.test(w);
const smallOne = (w: string | undefined) => w !== undefined && ONES[w] !== undefined && ONES[w] < 10;

/** "twenty five point five" → "25.5", "eight and a half" → "8.5", "third" → "3". */
export function wordsToDigits(text: string): string {
  const words = text.replace(/\band a half\b/g, "half").split(/\s+/).filter(Boolean);
  const out: (string | number)[] = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (w in TENS) {
      let value = TENS[w];
      if (smallOne(words[i + 1])) value += ONES[words[++i]];
      out.push(value);
    } else if (w in ONES) {
      out.push(ONES[w]);
    } else if (w in ORDINALS) {
      out.push(ORDINALS[w]);
    } else if (w === "point" && typeof out.at(-1) === "number") {
      let decimals = "";
      while (isDigit(words[i + 1]) || smallOne(words[i + 1])) {
        const next = words[++i];
        decimals += isDigit(next) ? next : String(ONES[next]);
      }
      const whole = out.pop() as number;
      out.push(decimals ? Number(`${whole}.${decimals}`) : whole);
    } else if (w === "half" && typeof out.at(-1) === "number") {
      out.push((out.pop() as number) + 0.5);
    } else {
      out.push(w);
    }
  }
  return out.join(" ");
}

/* ---------- helpers ---------- */

function normalize(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[,!?;:"“”]/g, " ")
    .replace(/\.(?!\d)/g, " ")
    .replace(/\bc\s*g\s*p\s*a\b/g, "cgpa")
    .replace(/\bg\s*p\s*a\b/g, "gpa")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(text: string): string {
  return text.replace(/\s+/g, " ").replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}

type NumberToken = { obtained: number; total: number | null };

/** "8 / 10 7 9 / 10" → [{8,10}, {7,null}, {9,10}] */
function numberTokens(text: string): NumberToken[] {
  const tokens: NumberToken[] = [];
  const re = /(\d+(?:\.\d+)?|\.\d+)(?:\s*\/\s*(\d+(?:\.\d+)?))?/g;
  for (const match of text.matchAll(re)) {
    tokens.push({ obtained: Number(match[1]), total: match[2] === undefined ? null : Number(match[2]) });
  }
  return tokens;
}

/** "b plus", "B+", "a minus", "bee plus" → "B+" / "A-". */
export function parseGradeLetter(text: string): string | null {
  let t = text
    .toLowerCase()
    .replace(/\bplus\b/g, "+")
    .replace(/\bminus\b|\bdash\b/g, "-")
    .replace(/\s+/g, "");
  t = t
    .replace(/^(?:bee|be)(?=[+-]?$)/, "b")
    .replace(/^(?:see|sea|si)(?=[+-]?$)/, "c")
    .replace(/^(?:dee|di)(?=[+-]?$)/, "d")
    .replace(/^(?:ay|eh)(?=[+-]?$)/, "a");
  const match = t.match(/^([abcdf])([+-]?)$/);
  return match ? `${match[1].toUpperCase()}${match[2]}` : null;
}

const isListKey = (key: ComponentKey): key is ListKey =>
  key === "quizzes" || key === "assignments" || key === "labAssignments";

const PAGES = [
  { href: "/cgpa-calculator", label: "CGPA Calculator", match: /^cgpa\b/ },
  { href: "/gpa-calculator", label: "GPA Calculator", match: /^gpa\b/ },
  { href: "/internal-marks", label: "Internal Marks", match: /^(?:internal|marks)\b/ },
  { href: "/guide", label: "Guide", match: /^(?:guide|help page)\b/ },
  { href: "/", label: "Home", match: /^home\b/ },
];

/* ---------- the parser ---------- */

export function parseVoiceCommand(raw: string): ParseResult {
  const original = raw.trim().replace(/[.!?]+$/, "");
  const t = normalize(raw);
  if (!t) return fail("I didn't catch anything.");

  // New subject keeps the original casing of the name.
  const add = original.match(/^(?:new|add|create)\s+(?:a\s+)?(?:subject|course)\s+(?:called\s+|named\s+)?(.+)$/i);
  if (add) return ok({ type: "add-subject", name: titleCase(add[1].trim()) });

  if (/^(?:undo|undo that|remove last|delete last|cancel last|go back)$/.test(t)) return ok({ type: "undo" });
  if (/^(?:help|commands|show commands|what can i say)\b/.test(t)) return ok({ type: "help" });
  if (/^(?:stop|stop listening|that's all|thats all|done)$/.test(t)) return ok({ type: "stop" });
  if (/^next (?:subject|course)$/.test(t)) return ok({ type: "step-subject", direction: 1 });
  if (/^(?:previous|prev|last) (?:subject|course)$/.test(t)) return ok({ type: "step-subject", direction: -1 });

  const nav = t.match(/^(?:go to|open|show|show me|switch to|take me to|select)\s+(?:the\s+)?(.+?)(?:\s+(?:page|calculator|tab))?$/);
  if (nav) {
    const target = nav[1].trim();
    const page = PAGES.find((p) => p.match.test(target));
    if (page) return ok({ type: "navigate", href: page.href, label: page.label });
    return ok({ type: "switch-subject", query: target });
  }

  const n = wordsToDigits(
    t
      .replace(/\b(?:out of|out off|outta|over|upon|slash|divided by)\b/g, " / ")
      .replace(/\//g, " / ")
      .replace(/\s+/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();

  const grade = n.match(/^(?:set\s+)?(?:the\s+)?grade\s+(?:to\s+|is\s+|as\s+)?(.+)$/);
  if (grade) {
    const value = grade[1].trim();
    if (/^(?:from marks|auto|automatic|clear|none|reset|remove)$/.test(value)) return ok({ type: "grade", letter: null });
    const letter = parseGradeLetter(value);
    return letter ? ok({ type: "grade", letter }) : fail(`"${value}" isn't a grade. Try "grade B plus".`);
  }

  const credits = n.match(/^(?:set\s+)?credits?(?:\s+hours?)?\s+(?:to\s+|are\s+)?(\d)(?:\s*(?:\+|plus|and)\s*(\d))?$/);
  if (credits) return ok({ type: "credits", theory: Number(credits[1]), lab: Number(credits[2] ?? 0) });

  if (/^(?:add\s+)?(?:a\s+)?(?:new\s+)?semester\b/.test(n)) {
    const nums = numberTokens(n).map((x) => x.obtained);
    if (nums.length < 2) return fail('Say the GPA and credit hours, e.g. "semester 3.45 with 18 credits".');
    let [gpa, ch] = nums.slice(-2);
    if (gpa > 4 && ch <= 4) [gpa, ch] = [ch, gpa];
    if (gpa < 0 || gpa > 4) return fail(`${gpa} isn't a GPA. It has to be between 0 and 4.`);
    if (!(ch > 0)) return fail("Credit hours must be above 0.");
    return ok({ type: "semester", gpa, credits: ch });
  }

  const lab = /\blab\b/.test(n);
  let key: ComponentKey | null = null;
  if (/assign/.test(n)) key = lab ? "labAssignments" : "assignments";
  else if (/quiz/.test(n)) {
    if (lab) return fail('Quizzes are theory only. Say "lab assignment" instead.');
    key = "quizzes";
  } else if (/\bmid|sessional/.test(n)) key = lab ? "labMid" : "mid";
  else if (/\bfinal|end ?term|terminal/.test(n)) key = lab ? "labFinal" : "final";

  const tokens = numberTokens(n);
  if (!key) {
    return tokens.length
      ? fail("Which one is that? Start with quiz, assignment, midterm or final.")
      : fail(`I didn't understand "${original}". Say "help" to see what you can say.`);
  }
  if (tokens.length === 0) return fail("I heard which one, but no marks. Try \"quiz 8 out of 10\".");

  // A type guard (not a plain boolean) so TypeScript knows `key` is a list key below.
  if (!isListKey(key)) {
    const [first] = tokens;
    return ok({ type: "mark", key, index: null, obtained: first.obtained, total: first.total });
  }

  // "quiz 3 is 8", "quiz 3 got 8 out of 10"
  const indexed = n.match(/(\d+)\s+(?:is|=|got|equals|was)\s+(\d+(?:\.\d+)?)(?:\s*\/\s*(\d+(?:\.\d+)?))?/);
  if (indexed) {
    const index = Number(indexed[1]);
    if (!Number.isInteger(index) || index < 1 || index > MAX_ENTRIES) return fail(`There's no ${key === "quizzes" ? "quiz" : "assignment"} ${index}.`);
    return ok({ type: "mark", key, index, obtained: Number(indexed[2]), total: indexed[3] ? Number(indexed[3]) : null });
  }

  const plural = /\b(?:quizzes|assignments|all)\b/.test(n);
  if (plural || tokens.length >= 3) {
    const text = tokens.map((x) => (x.total === null ? `${x.obtained}` : `${x.obtained}/${x.total}`)).join(" ");
    return ok({ type: "bulk", key, text });
  }

  // "quiz 3 8" means quiz number 3 got 8.
  if (tokens.length === 2 && tokens[0].total === null) {
    const index = tokens[0].obtained;
    if (!Number.isInteger(index) || index < 1 || index > MAX_ENTRIES) {
      return fail('Say one mark at a time, e.g. "quiz 8 out of 10", or "quizzes 8 7 9" for all of them.');
    }
    return ok({ type: "mark", key, index, obtained: tokens[1].obtained, total: tokens[1].total });
  }

  const [first] = tokens;
  return ok({ type: "mark", key, index: null, obtained: first.obtained, total: first.total });
}
