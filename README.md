# CUI-Grades

Calculate CUI internal marks, semester GPA and CGPA with pre-filled totals, keyboard-friendly inputs and voice commands.

An unofficial student tool. Not affiliated with COMSATS University Islamabad.

## Features

- **Internal Marks:** quizzes, assignments, midterms and finals for theory and lab, with every total already filled in. Enter or Tab jumps to the next box.
- **Final Exam Target:** pick a grade and see the marks you need in the final.
- **GPA Calculator:** grades come from your marks, or pick them by hand. Includes a bar chart comparing subjects.
- **CGPA Calculator:** past semesters plus this one, with the running CGPA and a trend chart.
- **Voice Commands:** say "quiz 8 out of 10", "midterm 20", "new subject database systems", "grade b plus" and more. Choose between keep-listening and hold-to-talk.
- **Guide:** the official grade scale, mark weights, how every number is worked out, and the full list of voice commands and shortcuts.
- **Export:** save the result as an image (shares straight to WhatsApp on phones) or print / save as PDF.
- Dark and light themes. Everything is saved in the browser, so there are no accounts and no server.

## Grading

Uses the CUI scale for students admitted in Fall 2021 or later (CUI Graduate Handbook 2023, section 2.10): A from 85%, down to D at 50%, the minimum pass. Percentages are rounded to a whole number before the grade is picked, as the handbook says.

| | Weight |
|---|---|
| Theory | Quizzes 15, assignments 10, midterm 25, final 50 |
| Lab | Lab assignments 25, lab midterm 25, lab final 50 |

A subject with a lab combines theory and lab by credit hours.

## Tech

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · pnpm. No database and no UI or chart libraries. Charts are plain SVG, and the result image is drawn on a canvas.

```
src/
  app/            pages, metadata, sitemap, robots, icons
  components/     UI by area: internal, gpa, cgpa, guide, voice, export, layout, ui
  lib/            grading scale, calculations, store, quick entry, voice parser
```

## Run locally

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000. Voice input works in Chrome, Edge and Safari, on `localhost` or `https` only.

Checks:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Deploy on Vercel

1. Push this repository to GitHub.
2. On vercel.com, choose **Add New → Project** and import the repository. Vercel detects Next.js and pnpm on its own.
3. Optional: under **Settings → Environment Variables**, add `NEXT_PUBLIC_SITE_URL` with your final URL (for example `https://cui-grades.vercel.app`). See `.env.example`.
4. Deploy. Every push to `main` deploys again automatically.
