import { formatGpa, formatMarks } from "./format";
import { formatResultDate, type ResultSummary } from "./result-summary";

/**
 * Draws the result card on a canvas and returns a PNG. Drawn by hand instead of
 * screenshotting the page, so it looks the same on every device and needs no library.
 * Dark brand colours read well in chat apps; each area keeps its colour (GPA blue, CGPA violet).
 */

const W = 1080;
/** Outer margin around everything. */
const M = 80;
/** Padding inside the course table card. */
const P = 40;
const HEAD_H = 56;
const ROW = 72;
/** Space between the big blocks (header, title, figures, table, footer). */
const GAP = 64;

const C = {
  bg: "#0b1120",
  surface: "#111a2b",
  surface2: "#172236",
  line: "#223049",
  fg: "#e8edf5",
  muted: "#8d9ab0",
  teal: "#2dd4bf",
  blue: "#60a5fa",
  violet: "#a78bfa",
  green: "#4ade80",
  amber: "#fbbf24",
  rose: "#fb7185",
};

function cssFont(variable: string, fallback: string): string {
  const value = getComputedStyle(document.body).getPropertyValue(variable).trim();
  return value ? `${value}, ${fallback}` : fallback;
}

function fit(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let cut = text;
  while (cut.length > 1 && ctx.measureText(`${cut}…`).width > maxWidth) cut = cut.slice(0, -1);
  return `${cut}…`;
}

/** Same grade colours as the site: A green, B blue, C amber, D and F rose. */
function gradeColor(letter: string | null): string {
  const first = letter?.charAt(0).toUpperCase();
  if (first === "A") return C.green;
  if (first === "B") return C.blue;
  if (first === "C") return C.amber;
  if (first === "D" || first === "F") return C.rose;
  return C.muted;
}

function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
}

function drawLogo(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const bar = size * (5 / 24);
  const gap = size * (2.5 / 24);
  const heights = [9 / 24, 14 / 24, 20 / 24];
  heights.forEach((h, i) => {
    ctx.fillStyle = i === 2 ? C.teal : C.fg;
    const barH = size * h;
    roundedRect(ctx, x + i * (bar + gap), y + size - barH, bar, barH, 3);
    ctx.fill();
  });
}

export async function renderResultImage(summary: ResultSummary): Promise<Blob> {
  const display = cssFont("--font-carter-one", "Georgia, serif");
  const sans = cssFont("--font-geist-sans", "system-ui, sans-serif");
  try {
    await Promise.all([document.fonts.load(`40px ${display}`), document.fonts.load(`24px ${sans}`)]);
  } catch {
    // Fallback fonts are fine.
  }

  // Vertical layout, top to bottom, with the same generous gap between every block.
  const headerY = M;
  const titleY = headerY + 44 + GAP + 40;
  const statsY = titleY + GAP;
  const statsH = 188;
  const cardY = statsY + statsH + GAP;
  const rows = Math.max(summary.subjects.length, 1);
  const cardH = P + HEAD_H + rows * ROW + P / 2;
  const footerY = cardY + cardH + GAP;
  const H = footerY + 56 + M;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported");

  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);

  // Header: logo and name on the left, date on the right.
  drawLogo(ctx, M, headerY, 40);
  ctx.textBaseline = "middle";
  ctx.fillStyle = C.fg;
  ctx.font = `34px ${display}`;
  ctx.fillText("CUI-Grades", M + 58, headerY + 22);
  ctx.textAlign = "right";
  ctx.fillStyle = C.muted;
  ctx.font = `22px ${sans}`;
  ctx.fillText(formatResultDate(summary.generatedAt), W - M, headerY + 22);
  ctx.textAlign = "left";

  // Title with a short teal underline.
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = C.fg;
  ctx.font = `56px ${display}`;
  ctx.fillText("Semester Result", M, titleY);
  ctx.fillStyle = C.teal;
  roundedRect(ctx, M, titleY + 16, 72, 6, 3);
  ctx.fill();

  // Three figure cards, each with its colour on a top strip and on the number.
  const stats = [
    {
      label: "Semester GPA",
      value: formatGpa(summary.semester.gpa),
      note: `${formatMarks(summary.semester.credits)} credit hours`,
      color: C.blue,
    },
    {
      label: "Courses",
      value: String(summary.subjects.length),
      note: `${summary.subjects.filter((s) => s.letter).length} with a grade`,
      color: C.teal,
    },
    {
      // The GPA result only; the CGPA page keeps its own data.
      label: "Credit Hours",
      value: formatMarks(summary.subjects.reduce((sum, s) => sum + s.credits, 0)),
      note: `${formatMarks(summary.semester.credits)} counted in the GPA`,
      color: C.violet,
    },
  ];
  const gap = 24;
  const boxW = (W - M * 2 - gap * 2) / 3;
  stats.forEach((stat, i) => {
    const bx = M + i * (boxW + gap);
    ctx.fillStyle = C.surface;
    roundedRect(ctx, bx, statsY, boxW, statsH, 16);
    ctx.fill();
    ctx.strokeStyle = C.line;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = stat.color;
    roundedRect(ctx, bx + 24, statsY, boxW - 48, 5, 3);
    ctx.fill();
    ctx.fillStyle = C.muted;
    ctx.font = `600 19px ${sans}`;
    ctx.fillText(stat.label.toUpperCase(), bx + 32, statsY + 54);
    ctx.fillStyle = stat.color;
    ctx.font = `62px ${display}`;
    ctx.fillText(stat.value, bx + 32, statsY + 124);
    ctx.fillStyle = C.muted;
    ctx.font = `19px ${sans}`;
    ctx.fillText(fit(ctx, stat.note, boxW - 64), bx + 32, statsY + 160);
  });

  // Course table inside a padded card.
  const cardX = M;
  const cardW = W - M * 2;
  ctx.fillStyle = C.surface;
  roundedRect(ctx, cardX, cardY, cardW, cardH, 18);
  ctx.fill();
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 2;
  ctx.stroke();

  const left = cardX + P;
  const right = cardX + cardW - P;
  // Column centres, spaced so the widest values ("Below 50%", the grade badge, "4.00") never touch.
  const col = { credits: cardX + 500, percent: cardX + 640, grade: cardX + 770 };
  const headTop = cardY + P;

  ctx.fillStyle = C.surface2;
  roundedRect(ctx, left - 12, headTop, right - left + 24, HEAD_H, 10);
  ctx.fill();
  ctx.fillStyle = C.muted;
  ctx.font = `600 19px ${sans}`;
  const headMid = headTop + HEAD_H / 2 + 7;
  ctx.fillText("COURSE", left, headMid);
  ctx.textAlign = "center";
  ctx.fillText("CREDITS", col.credits, headMid);
  ctx.fillText("PERCENTAGE", col.percent, headMid);
  ctx.fillText("GRADE", col.grade, headMid);
  ctx.textAlign = "right";
  ctx.fillText("GPA", right, headMid);
  ctx.textAlign = "left";

  const firstRow = headTop + HEAD_H;
  if (summary.subjects.length === 0) {
    ctx.fillStyle = C.muted;
    ctx.font = `24px ${sans}`;
    ctx.fillText("No courses yet.", left, firstRow + ROW / 2 + 8);
  }

  summary.subjects.forEach((s, i) => {
    const top = firstRow + i * ROW;
    const mid = top + ROW / 2 + 9;
    if (i > 0) {
      ctx.fillStyle = C.line;
      ctx.fillRect(left, top, right - left, 1);
    }
    ctx.font = `500 26px ${sans}`;
    ctx.fillStyle = C.fg;
    ctx.fillText(fit(ctx, s.name, col.credits - left - 80), left, mid);

    ctx.textAlign = "center";
    ctx.font = `26px ${sans}`;
    ctx.fillStyle = C.muted;
    ctx.fillText(String(s.credits), col.credits, mid);
    ctx.fillText(s.range ? `${s.range}%` : "-", col.percent, mid);

    if (s.letter) {
      const color = gradeColor(s.letter);
      ctx.fillStyle = withAlpha(color, 0.16);
      roundedRect(ctx, col.grade - 34, top + ROW / 2 - 18, 68, 36, 8);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.font = `700 24px ${sans}`;
      ctx.fillText(s.letter, col.grade, mid - 1);
    } else {
      ctx.fillStyle = C.muted;
      ctx.font = `22px ${sans}`;
      ctx.fillText("N/A", col.grade, mid);
    }

    ctx.textAlign = "right";
    ctx.font = `600 26px ${sans}`;
    ctx.fillStyle = s.points === null ? C.muted : C.fg;
    ctx.fillText(s.points === null ? "-" : s.points.toFixed(2), right, mid);
    ctx.textAlign = "left";
  });

  // Footer.
  ctx.fillStyle = C.line;
  ctx.fillRect(M, footerY - 20, W - M * 2, 1);
  ctx.fillStyle = C.muted;
  ctx.font = `19px ${sans}`;
  ctx.fillText("Unofficial calculation on the CUI grading scale (Fall 2021 onwards).", M, footerY + 10);
  ctx.fillText("Not affiliated with COMSATS University Islamabad.", M, footerY + 40);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not create the image"))), "image/png");
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
