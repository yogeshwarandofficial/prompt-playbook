import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { X, ExternalLink, ArrowRight, ChevronRight } from "lucide-react";
import { ROADMAPS, DOMAINS, DOMAIN_COLORS, type Roadmap } from "@/data/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/roadmaps")({
  head: () => ({
    meta: [
      { title: "Learning Roadmaps — Infynux Academy" },
      { name: "description", content: "Structured roadmaps for Full Stack Web Dev, Cloud AWS, App Dev, AI & Automation, and Digital Marketing." },
      { property: "og:title", content: "Learning Roadmaps — Infynux Academy" },
      { property: "og:description", content: "Beginner-to-advanced learning paths across five in-demand domains." },
    ],
  }),
  component: RoadmapsPage,
});

const TABS = ["Overview", "Curriculum", "Projects", "Resources", "Careers"] as const;
type Tab = (typeof TABS)[number];

function RoadmapsPage() {
  const [active, setActive] = useState<Roadmap | null>(null);
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", to: "/" }, { label: "Roadmaps" }]}
        title="Learning Roadmaps"
        subtitle="Structured paths from beginner to job-ready — pick a domain and start today."
      />
      <section className="pb-24">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ROADMAPS.map((r) => {
            const d = DOMAINS.find((x) => x.key === r.domain)!;
            return (
              <article key={r.slug} className="flex flex-col rounded-2xl border border-border bg-surface p-6 hover-lift">
                <span
                  className="grid h-12 w-12 place-items-center rounded-xl text-2xl"
                  style={{ background: `color-mix(in oklch, ${DOMAIN_COLORS[r.domain]} 18%, transparent)` }}
                >
                  {d.icon}
                </span>
                <h2 className="mt-4 font-display text-lg font-semibold">{r.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{r.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-muted px-2.5 py-1 font-medium">{r.difficulty}</span>
                  <span className="rounded-full bg-muted px-2.5 py-1 font-medium">{r.duration}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {d.skills.slice(0, 3).map((s) => (
                    <span key={s} className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground">{s}</span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setActive(r)}
                  className="mt-6 inline-flex items-center justify-center gap-1 rounded-md gradient-hero px-4 py-2.5 text-sm font-semibold text-white shadow-brand transition-transform hover:-translate-y-0.5"
                >
                  Start Learning <ArrowRight className="h-4 w-4" />
                </button>
              </article>
            );
          })}
        </div>
      </section>
      {active && <RoadmapModal roadmap={active} onClose={() => setActive(null)} />}
    </>
  );
}

function RoadmapModal({ roadmap, onClose }: { roadmap: Roadmap; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("Overview");
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" role="dialog" aria-modal="true">
      <button aria-label="Close" className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-3xl rounded-t-2xl sm:rounded-2xl bg-surface shadow-xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-surface px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Roadmap</p>
            <h2 className="font-display text-xl font-bold">{roadmap.title}</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-border px-4">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                "whitespace-nowrap px-3 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="px-6 py-6">
          {tab === "Overview" && (
            <div className="space-y-5 text-sm">
              <p className="text-foreground/85">{roadmap.description}</p>
              <Block title="Who this is for">{roadmap.audience}</Block>
              <Block title="Prerequisites">
                <ul className="list-disc space-y-1 pl-5">{roadmap.prerequisites.map((p) => <li key={p}>{p}</li>)}</ul>
              </Block>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-muted px-2.5 py-1 font-medium">{roadmap.difficulty}</span>
                <span className="rounded-full bg-muted px-2.5 py-1 font-medium">{roadmap.duration}</span>
              </div>
            </div>
          )}
          {tab === "Curriculum" && (
            <div className="space-y-6">
              {roadmap.tracks.map((tr) => (
                <div key={tr.name}>
                  <h3 className="font-display text-base font-semibold">{tr.name}</h3>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {tr.topics.map((t) => (
                      <li key={t} className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
                        <ChevronRight className="mt-0.5 h-4 w-4 text-primary" />{t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {tab === "Projects" && (
            <ul className="grid gap-3 sm:grid-cols-2">
              {roadmap.projects.map((p) => (
                <li key={p.title} className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="font-display font-semibold">{p.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                </li>
              ))}
            </ul>
          )}
          {tab === "Resources" && (
            <ul className="space-y-2">
              {roadmap.resources.map((r) => (
                <li key={r.url}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm hover:bg-muted"
                  >
                    {r.label} <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                </li>
              ))}
            </ul>
          )}
          {tab === "Careers" && (
            <ul className="grid gap-3 sm:grid-cols-2">
              {roadmap.careers.map((c) => (
                <li key={c.role} className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="font-display font-semibold">{c.role}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Avg. {c.salary}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-border bg-muted/40 px-6 py-5 text-center">
          <p className="text-sm text-muted-foreground">Ready to put this into practice?</p>
          <Link
            to="/internships"
            onClick={onClose}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-md gradient-hero px-5 py-2.5 text-sm font-semibold text-white shadow-brand"
          >
            Apply for Internship <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function PageHeader({
  crumbs, title, subtitle,
}: {
  crumbs: { label: string; to?: string }[];
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b border-border gradient-soft">
      <div className="container-page py-12 md:py-16">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1">
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-1">
                {c.to ? <Link to={c.to} className="hover:text-foreground">{c.label}</Link> : <span>{c.label}</span>}
                {i < crumbs.length - 1 && <ChevronRight className="h-3 w-3" />}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>}
      </div>
    </section>
  );
}
