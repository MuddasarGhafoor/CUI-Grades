import { formatGpa, formatMarks, formatPercent } from "./format";
import { formatResultDate, type ResultSummary } from "./result-summary";

/**
 * Draws the result card on a canvas and returns a PNG. Drawn by hand instead of
 * screenshotting the page, so it looks the same on every device and needs no library.
 * Always uses the dark brand colours, which read well in chat apps.
 */

const W = 1080;
const PAD = 72;
const ROW = 62;

const C = {
  bg: "#0b1120",
  surface: "#111a2b",
  line: "#223049",
  fg: "#e8edf5",
  muted: "#8d9ab0",
  accent: "#2dd4bf",
  ok: "#4ade80",
  warn: "#fbbf24",
  err: "#f87171",
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

function gradeColor(points: number | null): string {
  if (points === null) return C.muted;
  if (points >= 3.66) return C.ok;
  if (points >= 3) return C.accent;
  if (points >= 1) return C.warn;
  return C.err;
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
    ctx.fillStyle = i === 2 ? C.accent : C.fg;
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

  const rows = Math.max(summary.subjects.length, 1);
  const tableTop = 270;
  const tableBottom = tableTop + 52 + rows * ROW;
  const H = tableBottom + 330;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported");

  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);

  // Header: logo, name, date.
  drawLogo(ctx, PAD, 66, 44);
  ctx.textBaseline = "middle";
  ctx.fillStyle = C.fg;
  ctx.font = `36px ${display}`;
  ctx.fillText("CUI-Grades", PAD + 62, 90);
  ctx.textAlign = "right";
  ctx.fillStyle = C.muted;
  ctx.font = `24px ${sans}`;
  ctx.fillText(formatResultDate(summary.generatedAt), W - PAD, 90);
  ctx.textAlign = "left";

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = C.fg;
  ctx.font = `60px ${display}`;
  ctx.fillText("Semester result", PAD, 214);

  // Table.
  const x = { name: PAD, credits: 650, percent: 800, grade: 900, points: W - PAD };
  ctx.font = `600 22px ${sans}`;
  ctx.fillStyle = C.muted;
  ctx.fillText("Subject", x.name, tableTop + 28);
  ctx.textAlign = "right";
  ctx.fillText("Credits", x.credits, tableTop + 28);
  ctx.fillText("%", x.percent, tableTop + 28);
  ctx.fillText("Grade", x.grade, tableTop + 28);
  ctx.fillText("Points", x.points, tableTop + 28);
  ctx.textAlign = "left";
  ctx.fillStyle = C.line;
  ctx.fillRect(PAD, tableTop + 48, W - PAD * 2, 2);

  if (summary.subjects.length === 0) {
    ctx.fillStyle = C.muted;
    ctx.font = `26px ${sans}`;
    ctx.fillText("No subjects this semester.", PAD, tableTop + 52 + ROW / 2 + 8);
  }

  summary.subjects.forEach((s, i) => {
    const mid = tableTop + 52 + i * ROW + ROW / 2 + 9;
    ctx.font = `28px ${sans}`;
    ctx.fillStyle = C.fg;
    ctx.fillText(fit(ctx, s.name, x.credits - x.name - 130), x.name, mid);
    ctx.textAlign = "right";
    ctx.fillStyle = C.muted;
    ctx.fillText(s.creditSplit, x.credits, mid);
    ctx.fillText(s.percent === null ? "–" : formatPercent(s.percent, 0), x.percent, mid);
    ctx.font = `700 28px ${sans}`;
    ctx.fillStyle = gradeColor(s.points);
    ctx.fillText(s.letter ?? "–", x.grade, mid);
    ctx.font = `28px ${sans}`;
    ctx.fillStyle = C.fg;
    ctx.fillText(s.points === null ? "–" : s.points.toFixed(2), x.points, mid);
    ctx.textAlign = "left";
    if (i < summary.subjects.length - 1) {
      ctx.fillStyle = C.line;
      ctx.fillRect(PAD, tableTop + 52 + (i + 1) * ROW, W - PAD * 2, 1);
    }
  });

  // Two stat boxes: semester GPA and CGPA.
  const boxTop = tableBottom + 44;
  const boxW = (W - PAD * 2 - 24) / 2;
  const boxH = 190;
  const stats = [
    {
      label: "Semester GPA",
      value: formatGpa(summary.semester.gpa),
      note: `${formatMarks(summary.semester.credits)} credit hours`,
    },
    {
      label: "CGPA",
      value: formatGpa(summary.cgpa),
      note:
        summary.cgpa === null
          ? "no semesters added"
          : `${formatMarks(summary.cgpaCredits)} credit hours, ${summary.timeline.length} semester${summary.timeline.length === 1 ? "" : "s"}`,
    },
  ];
  stats.forEach((stat, i) => {
    const bx = PAD + i * (boxW + 24);
    ctx.fillStyle = C.surface;
    roundedRect(ctx, bx, boxTop, boxW, boxH, 14);
    ctx.fill();
    ctx.strokeStyle = C.line;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = C.muted;
    ctx.font = `24px ${sans}`;
    ctx.fillText(stat.label, bx + 32, boxTop + 50);
    ctx.fillStyle = i === 1 ? C.accent : C.fg;
    ctx.font = `76px ${display}`;
    ctx.fillText(stat.value, bx + 32, boxTop + 128);
    ctx.fillStyle = C.muted;
    ctx.font = `22px ${sans}`;
    ctx.fillText(fit(ctx, stat.note, boxW - 64), bx + 32, boxTop + 166);
  });

  ctx.fillStyle = C.muted;
  ctx.font = `20px ${sans}`;
  ctx.fillText("Unofficial calculation on the CUI grading scale (Fall 2021 onwards).", PAD, H - 76);
  ctx.fillText("Not affiliated with COMSATS University Islamabad.", PAD, H - 46);

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
