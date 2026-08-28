import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bookmark, Clock, Search, BookOpen, ArrowRight, ChevronRight } from "lucide-react";
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
      {/* ── Seamless Dark Header ─────────────────────────────────────────── */}
      <section className="bg-black pt-32 pb-12 border-b border-white/10 relative z-10">
        <div className="container-page text-left">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <ChevronRight className="h-3 w-3 text-slate-600" />
              <li className="text-slate-300">Tutorials</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl tracking-tight leading-tight">
            Tutorials & Guides
          </h1>
          <p className="mt-5 max-w-2xl text-slate-400 text-lg leading-relaxed">
            Step-by-step technical guides, from setting up your environment to deploying your first app.
          </p>
        </div>
      </section>

      <section className="container-page py-10 pb-24 bg-[#0A0A0A] min-h-screen text-slate-300">
        {/* Search + filter bar */}
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              placeholder="Search tutorials…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-[#0F0F0F] pl-12 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-sm"
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
                  "rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all",
                  filter === f.key
                    ? "bg-white text-black border border-white"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/10"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <Link
                key={t.slug}
                to="/tutorials/$slug"
                params={{ slug: t.slug }}
                className="group flex flex-col rounded-3xl border border-white/10 bg-[#0F0F0F] p-6 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden relative"
              >
                {/* Subtle background glow based on domain */}
                <div
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-10 blur-[40px] transition-opacity group-hover:opacity-20"
                  style={{ background: DOMAIN_TEXT_COLORS[t.domain] }}
                />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-4">
                    <DomainBadge domain={t.domain} />
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <Clock className="h-3 w-3" />
                      {t.readMinutes}m
                    </span>
                  </div>

                  <h2 className="mt-5 text-xl font-bold leading-snug line-clamp-2 text-white group-hover:text-blue-400 transition-colors tracking-tight">
                    {t.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm text-slate-400 line-clamp-3 leading-relaxed">
                    {t.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      t.difficulty === "Beginner" ? "text-emerald-400" :
                      t.difficulty === "Intermediate" ? "text-amber-400" :
                      "text-rose-400"
                    )}>
                      {t.difficulty}
                    </span>
                    
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-500 uppercase tracking-widest group-hover:gap-2 transition-all">
                      Read more <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-[#0F0F0F] p-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
              <Search className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-white tracking-tight">No tutorials found</h3>
            <p className="mt-3 text-slate-400 text-base max-w-md mx-auto">
              We couldn't find any guides matching "{query}". Try adjusting your filters.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-slate-200 transition-all"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </>
  );
}
