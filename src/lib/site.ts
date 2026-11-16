import type { Metadata } from "next";

/**
 * Public URL of the site, used for canonical links, the sitemap and share previews.
 * Set NEXT_PUBLIC_SITE_URL once you have a domain. On Vercel the production URL is
 * picked up on its own; locally it falls back to localhost.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "CUI-Grades";

export const SITE_DESCRIPTION =
  "Calculate CUI internal marks, semester GPA and CGPA with pre-filled totals, keyboard-friendly inputs and voice commands. Uses the official COMSATS grading scale.";

/**
 * Full metadata for one page. Next.js replaces (does not merge) openGraph and twitter
 * objects from the layout, so each page sets all the fields it needs.
 */
export function pageMetadata({ path, title, description }: { path: string; title: string; description: string }): Metadata {
  const fullTitle = `${title} · ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_PK", url: path, title: fullTitle, description },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}
