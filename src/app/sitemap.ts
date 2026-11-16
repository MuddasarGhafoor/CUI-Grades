import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const ROUTES = [
  { path: "", priority: 1 },
  { path: "/internal-marks", priority: 0.9 },
  { path: "/gpa-calculator", priority: 0.9 },
  { path: "/cgpa-calculator", priority: 0.9 },
  { path: "/guide", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}
