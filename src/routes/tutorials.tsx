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

// Vibrant domain palette (fallback if DOMAIN_COLORS isn't re-exported)
const DOMAIN_TEXT_COLORS: Record<DomainKey, string> = DOMAIN_COLORS || {
  web:       "#3B82F6",
  cloud:     "#F59E0B",
  app:       "#10B981",
  ai:        "#8B5CF6",
  marketing: "#F43F5E",
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
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search tutorials…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border-4 border-[#222] bg-white pl-12 pr-4 py-3.5 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:shadow-[4px_4px_0px_rgba(156,255,59,1)] transition-all font-outfit"
              aria-label="Search tutorials"
            />
          </div>
          <div className="flex gap-2 flex-wrap" role="tablist">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "whitespace-nowrap rounded-xl px-5 py-2 text-sm font-black transition-all uppercase tracking-wider font-orbitron border-2",
                  filter === f.key
                    ? "bg-[#0A0A0A] text-primary border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                    : "bg-white border-[#222] text-slate-600 hover:border-black hover:text-black hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border-4 border-dashed border-[#222] bg-white px-6 py-20 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
            <h2 className="mt-5 text-xl font-black text-slate-800 font-orbitron">No tutorials yet</h2>
            <p className="mt-2 text-base text-slate-500 font-outfit">Try a different filter, or check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <article
                key={t.slug}
                className="group flex flex-col rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                {/* Full-width domain gradient banner */}
                <div
                  className="relative aspect-video w-full overflow-hidden bg-slate-100"
                  aria-hidden="true"
                >
                  <img 
                    src={`/ui_${t.domain}.png`} 
                    alt={t.title} 
                    className="absolute inset-0 w-full h-full object-cover scale-[1.35] transition-transform duration-500 group-hover:scale-[1.45]" 
                  />
                </div>
                {/* Card Content Wrapper */}
                <div className="flex flex-col flex-1 p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                  <DomainBadge domain={t.domain} />
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{t.difficulty}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold leading-snug line-clamp-2 text-slate-800 group-hover:text-slate-900 transition-colors">
                  {t.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-slate-500 line-clamp-2 leading-relaxed">{t.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {t.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">{tag}</span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-500">
                  <span className="inline-flex items-center gap-1.5 px-1 py-1 rounded-md">
                    <Clock className="h-3.5 w-3.5" /> {t.readMinutes} min read
                  </span>
                  <Link
                    to="/tutorials/$slug"
                    params={{ slug: t.slug }}
                    className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900"
                  >
                    Read <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
