import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bookmark, Clock, Search, BookOpen } from "lucide-react";
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
      <section className="container-page py-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search tutorials…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-surface pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              aria-label="Search tutorials"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto" role="tablist">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  filter === f.key
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 font-display text-lg font-semibold">No tutorials yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">Try a different filter, or check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <article key={t.slug} className="group flex flex-col rounded-2xl border border-border bg-surface p-5 hover-lift">
                <div
                  className="relative mb-4 aspect-[16/9] overflow-hidden rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in oklch, ${DOMAIN_COLORS[t.domain]} 65%, transparent), color-mix(in oklch, ${DOMAIN_COLORS[t.domain]} 25%, transparent))`,
                  }}
                  aria-hidden="true"
                >
                  <button
                    type="button"
                    aria-label="Bookmark"
                    className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/85 text-foreground/70 backdrop-blur transition hover:text-primary"
                  >
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <DomainBadge domain={t.domain} />
                  <span className="text-xs text-muted-foreground">{t.difficulty}</span>
                </div>
                <h3 className="mt-3 font-display text-base font-semibold leading-snug line-clamp-2">{t.title}</h3>
                <p className="mt-1.5 flex-1 text-sm text-muted-foreground line-clamp-3">{t.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {t.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground">{tag}</span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {t.readMinutes} min</span>
                  <Link to="/tutorials/$slug" params={{ slug: t.slug }} className="font-semibold text-primary">Read more →</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
