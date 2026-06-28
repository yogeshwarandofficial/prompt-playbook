import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bookmark, Clock, Search, BookOpen, ArrowRight } from "lucide-react";
import { TUTORIALS, DOMAINS, DOMAIN_COLORS, type DomainKey } from "@/data/content";
import { cn } from "@/lib/utils";
import { PageHeader } from "./roadmaps";
import { DomainBadge } from "./index";

export const Route = createFileRoute("/tutorials")({
  head: () => ({
    meta: [
      { title: "Free Tutorials — Infynux Academy" },
      { name: "description", content: "Step-by-step tutorials across Web Development, Cloud Computing, App Development, AI & Automation." },
      { property: "og:title", content: "Free Tutorials — Infynux Academy" },
      { property: "og:description", content: "Practical guides to help you learn by doing." },
    ],
  }),
  component: TutorialsPage,
});

// Light-mode domain text palette
const DOMAIN_TEXT_COLORS: Record<DomainKey, string> = {
  web:       "#3B82F6",
  cloud:     "#D97706",
  app:       "#059669",
  ai:        "#7C3AED",
  marketing: "#E11D48",
};

type Filter = "all" | DomainKey;
const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  ...DOMAINS.map((d) => ({ key: d.key as Filter, label: d.short })),
];

function TutorialsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return TUTORIALS.filter((t) => {
      if (filter !== "all" && t.domain !== filter) return false;
      if (query && !`${t.title} ${t.description}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [filter, query]);

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", to: "/" }, { label: "Tutorials" }]}
        title="Tutorials"
        subtitle="Learn by doing with practical, step-by-step guides."
      />
      <section className="container-page py-10 pb-24">
        {/* Search + filter bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search tutorials…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800000]/15 focus:border-[#800000] transition-all"
              aria-label="Search tutorials"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap" role="tablist">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
                  filter === f.key
                    ? "bg-[#800000] text-white shadow-[0_2px_8px_rgba(128,0,0,0.20)]"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-[#800000]/30 hover:text-[#800000]",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
            <h2 className="mt-4 text-lg font-semibold text-slate-600">No tutorials yet</h2>
            <p className="mt-1 text-sm text-slate-400">Try a different filter, or check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <article
                key={t.slug}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 hover:border-[#800000]/20 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(128,0,0,0.08)] transition-all duration-300"
              >
                {/* Mini domain gradient banner */}
                <div
                  className="relative mb-4 aspect-[16/9] overflow-hidden rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${DOMAIN_COLORS[t.domain]}22 0%, ${DOMAIN_COLORS[t.domain]}08 100%)`,
                  }}
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 grid place-items-center">
                    <div
                      className="h-12 w-12 rounded-xl grid place-items-center text-white"
                      style={{ background: DOMAIN_TEXT_COLORS[t.domain] }}
                    >
                      <BookOpen className="h-6 w-6" />
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Bookmark"
                    className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-slate-400 shadow-sm backdrop-blur transition hover:text-[#800000]"
                  >
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <DomainBadge domain={t.domain} />
                  <span className="text-xs text-slate-400">{t.difficulty}</span>
                </div>
                <h3 className="mt-3 text-base font-semibold leading-snug line-clamp-2 text-slate-800 group-hover:text-[#800000] transition-colors">
                  {t.title}
                </h3>
                <p className="mt-1.5 flex-1 text-sm text-slate-500 line-clamp-3 leading-relaxed">{t.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {t.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-400">{tag}</span>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {t.readMinutes} min read
                  </span>
                  <span>{t.difficulty}</span>
                </div>
                <Link
                  to="/tutorials/$slug"
                  params={{ slug: t.slug }}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#800000] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(128,0,0,0.15)] hover:bg-[#6B0000] hover:shadow-[0_4px_16px_rgba(128,0,0,0.25)] transition-all"
                >
                  Read Tutorial <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
