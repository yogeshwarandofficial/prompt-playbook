import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { ROADMAPS, TUTORIALS } from "@/data/content";

const BASE_URL = "https://www.infynuxacademy.in";

interface SitemapEntry {
  path: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: string;
  lastmod?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const currentDate = new Date().toISOString().split("T")[0];

        const staticEntries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0", lastmod: currentDate },
          { path: "/roadmaps", changefreq: "weekly", priority: "0.9", lastmod: currentDate },
          { path: "/tutorials", changefreq: "weekly", priority: "0.9", lastmod: currentDate },
          { path: "/internships", changefreq: "weekly", priority: "0.9", lastmod: currentDate },
          { path: "/contact", changefreq: "monthly", priority: "0.7", lastmod: "2026-03-01" },
          { path: "/events", changefreq: "weekly", priority: "0.6", lastmod: currentDate },
          { path: "/verify", changefreq: "monthly", priority: "0.5", lastmod: "2026-01-01" },
          { path: "/privacy-policy", changefreq: "yearly", priority: "0.3", lastmod: "2026-01-01" },
          { path: "/terms-of-service", changefreq: "yearly", priority: "0.3", lastmod: "2026-01-01" },
        ];

        const roadmapEntries: SitemapEntry[] = ROADMAPS.map((r) => ({
          path: `/learn/${r.slug}`,
          changefreq: "weekly",
          priority: "0.85",
          lastmod: currentDate,
        }));

        const tutorialEntries: SitemapEntry[] = TUTORIALS.map((t) => ({
          path: `/tutorials/${t.slug}`,
          changefreq: "monthly",
          priority: "0.8",
          lastmod: "2026-03-15",
        }));

        const allEntries = [...staticEntries, ...roadmapEntries, ...tutorialEntries];

        const urls = allEntries.map(
          (e) =>
            `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <lastmod>${e.lastmod || currentDate}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
            "X-Robots-Tag": "noindex, follow",
          },
        });
      },
    },
  },
});
