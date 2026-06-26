import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { TUTORIALS } from "@/data/content";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/roadmaps", changefreq: "weekly", priority: "0.9" },
          { path: "/tutorials", changefreq: "weekly", priority: "0.9" },
          { path: "/internships", changefreq: "weekly", priority: "0.9" },
          { path: "/contact", changefreq: "monthly", priority: "0.6" },
        ];
        const tutorialEntries = TUTORIALS.map((t) => ({
          path: `/tutorials/${t.slug}`,
          changefreq: "monthly",
          priority: "0.7",
        }));
        const entries = [...staticEntries, ...tutorialEntries];

        const urls = entries.map(
          (e) =>
            `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
