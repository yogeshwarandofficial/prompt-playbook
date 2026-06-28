import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  ExternalLink,
  AlertCircle,
  ChevronRight,
  Layers,
  GraduationCap,
  FileText,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { TUTORIALS, DOMAIN_COLORS, DOMAIN_NAME_MAP, type Tutorial, type DomainKey } from "@/data/content";
import { PageHeader } from "./roadmaps";
import { DomainBadge } from "./index";

export const Route = createFileRoute("/tutorials/$slug")({
  loader: ({ params }): { tutorial: Tutorial } => {
    const tutorial = TUTORIALS.find((t) => t.slug === params.slug);
    if (!tutorial) throw notFound();
    return { tutorial };
  },
  head: ({ loaderData }) => {
    const t = loaderData?.tutorial;
    if (!t) return {};
    return {
      meta: [
        { title: `${t.title} — Infynux Academy` },
        { name: "description", content: t.description },
        { property: "og:title", content: t.title },
        { property: "og:description", content: t.description },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: TutorialPage,
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Tutorial not found</h1>
      <Link to="/tutorials" className="mt-4 inline-block text-[#800000] hover:underline font-semibold">
        Back to tutorials
      </Link>
    </div>
  ),
});

// ── Difficulty badge — light palette ──────────────────────────────────────────
const DIFFICULTY_STYLES: Record<string, string> = {
  Beginner:     "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Intermediate: "bg-amber-50   text-amber-700   border border-amber-200",
  Advanced:     "bg-rose-50    text-rose-700    border border-rose-200",
};
function DifficultyBadge({ level }: { level: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold ${DIFFICULTY_STYLES[level] ?? ""}`}>
      {level}
    </span>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#800000]/8 border border-[#800000]/12 text-[#800000]">
        {icon}
      </span>
      <h2 className="text-xl font-bold text-slate-900">{children}</h2>
    </div>
  );
}

// ── Save Course hook ──────────────────────────────────────────────────────────
const SAVE_KEY = "infynux_saved_tutorials";
function useSavedCourse(slug: string) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    try {
      const stored: string[] = JSON.parse(localStorage.getItem(SAVE_KEY) ?? "[]");
      setSaved(stored.includes(slug));
    } catch { setSaved(false); }
  }, [slug]);
  const toggle = () => {
    try {
      const stored: string[] = JSON.parse(localStorage.getItem(SAVE_KEY) ?? "[]");
      const next = stored.includes(slug) ? stored.filter((s) => s !== slug) : [...stored, slug];
      localStorage.setItem(SAVE_KEY, JSON.stringify(next));
      setSaved(next.includes(slug));
    } catch { /* ignore */ }
  };
  return { saved, toggle };
}

// ── Light-mode domain text colours ───────────────────────────────────────────
const DOMAIN_TEXT_COLORS: Record<DomainKey, string> = {
  web:       "#3B82F6",
  cloud:     "#D97706",
  app:       "#059669",
  ai:        "#7C3AED",
  marketing: "#E11D48",
};

// ── Main page ─────────────────────────────────────────────────────────────────
function TutorialPage() {
  const { tutorial } = Route.useLoaderData() as { tutorial: Tutorial };
  const related = TUTORIALS.filter((t) => t.domain === tutorial.domain && t.slug !== tutorial.slug).slice(0, 3);
  const domainColor = DOMAIN_TEXT_COLORS[tutorial.domain];
  const domainName = DOMAIN_NAME_MAP[tutorial.domain];
  const { saved, toggle } = useSavedCourse(tutorial.slug);

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Tutorials", to: "/tutorials" },
          { label: tutorial.title },
        ]}
        title={tutorial.title}
        subtitle={tutorial.description}
      />

      {/* ── Info Bar ─────────────────────────────────────────────────────── */}
      <div className="w-full border-b border-slate-200 bg-white">
        <div className="container-page max-w-4xl py-6">
          <div className="flex flex-wrap items-center gap-3">
            <DomainBadge domain={tutorial.domain} />
            <DifficultyBadge level={tutorial.difficulty} />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
              <Clock className="h-3.5 w-3.5" /> {tutorial.readMinutes} min read
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
              <BookOpen className="h-3.5 w-3.5" /> {tutorial.steps.length} lessons
            </span>
          </div>
          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {tutorial.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="container-page max-w-4xl py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">

          {/* ── Left: Main Content ────────────────────────────────────────── */}
          <div className="min-w-0 space-y-10">

            {/* What You'll Learn */}
            <section>
              <SectionHeading icon={<GraduationCap className="h-5 w-5" />}>
                What You'll Learn
              </SectionHeading>
              <ul className="grid gap-3 sm:grid-cols-2">
                {tutorial.whatYouWillLearn.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-[#800000]/20 transition-colors"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#800000]" aria-hidden="true" />
                    <span className="text-sm leading-snug text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Prerequisites */}
            <section>
              <SectionHeading icon={<AlertCircle className="h-5 w-5" />}>
                Prerequisites
              </SectionHeading>
              <ul className="space-y-2.5">
                {tutorial.prerequisites.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                    <ChevronRight className="h-4 w-4 shrink-0 text-[#800000]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Step-by-step lessons */}
            <section>
              <SectionHeading icon={<Layers className="h-5 w-5" />}>
                Step-by-Step Guide
              </SectionHeading>
              <ol className="space-y-5">
                {tutorial.steps.map((step, i) => (
                  <li
                    key={i}
                    className="relative rounded-2xl border border-slate-200 bg-white p-6 hover:border-[#800000]/20 hover:shadow-[0_4px_16px_rgba(128,0,0,0.07)] transition-all"
                  >
                    {/* Accent bar */}
                    <div
                      className="absolute left-0 top-4 bottom-4 w-1 rounded-full"
                      style={{ background: domainColor }}
                      aria-hidden="true"
                    />
                    <p className="pl-5 text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">
                      Step {i + 1}
                    </p>
                    <h3 className="pl-5 text-base font-bold leading-snug text-slate-800">
                      {step.title}
                    </h3>
                    <p className="mt-3 pl-5 text-sm leading-relaxed text-slate-500">
                      {step.content}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Resources */}
            <section>
              <SectionHeading icon={<FileText className="h-5 w-5" />}>
                Further Reading & Resources
              </SectionHeading>
              <ul className="space-y-3">
                {tutorial.resources.map((r, i) => (
                  <li key={i}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-[#800000]/30 hover:bg-[#800000]/3 hover:shadow-sm"
                    >
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-[#800000] transition-colors">
                        {r.label}
                      </span>
                      <ExternalLink className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-[#800000] transition-colors" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* ── Right: Sticky Sidebar ─────────────────────────────────────── */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">

            {/* Quick Info Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-800">Course Info</h3>
              <dl className="space-y-3 text-sm">
                {[
                  { label: "Domain",    val: <span className="font-semibold text-slate-700">{domainName}</span> },
                  { label: "Level",     val: <DifficultyBadge level={tutorial.difficulty} /> },
                  { label: "Read Time", val: <span className="font-semibold text-slate-700">{tutorial.readMinutes} minutes</span> },
                  { label: "Lessons",   val: <span className="font-semibold text-slate-700">{tutorial.steps.length} steps</span> },
                  { label: "Resources", val: <span className="font-semibold text-slate-700">{tutorial.resources.length} links</span> },
                ].map(({ label, val }) => (
                  <div key={label} className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <dt className="text-slate-400">{label}</dt>
                    <dd>{val}</dd>
                  </div>
                ))}
              </dl>

              {/* Save Course button */}
              <button
                type="button"
                onClick={toggle}
                aria-pressed={saved}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-all ${
                  saved
                    ? "border-[#800000]/20 bg-[#800000]/8 text-[#800000]"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-[#800000]/30 hover:bg-[#800000]/5 hover:text-[#800000]"
                }`}
              >
                {saved ? (
                  <><BookmarkCheck className="h-4 w-4" /> Course Saved!</>
                ) : (
                  <><Bookmark className="h-4 w-4" /> Save Course</>
                )}
              </button>

              <Link
                to="/internships"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#800000] px-4 py-3 text-sm font-bold text-white shadow-[0_4px_12px_rgba(128,0,0,0.20)] hover:bg-[#6B0000] hover:shadow-[0_4px_16px_rgba(128,0,0,0.30)] transition-all"
              >
                Apply for Internship <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Table of Contents */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-base font-bold text-slate-800">Contents</h3>
              <ol className="space-y-2">
                {tutorial.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                    <span
                      className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ background: domainColor }}
                    >
                      {i + 1}
                    </span>
                    <span className="leading-snug line-clamp-2">
                      {step.title.replace(/^\d+\.\s*/, "")}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>

        {/* ── CTA Banner ───────────────────────────────────────────────────── */}
        <div className="mt-14 rounded-2xl bg-gradient-to-br from-[#800000] via-[#9B0000] to-[#C41E3A] px-6 py-10 text-center text-white shadow-[0_16px_48px_rgba(128,0,0,0.22)]">
          <h2 className="text-2xl font-bold text-white">Ready to put this into practice?</h2>
          <p className="mt-2 text-white/80 text-sm leading-relaxed">
            Apply for a real {domainName} internship and ship production projects with mentorship.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/internships"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#800000] shadow hover:bg-white/90 transition-colors"
            >
              Apply Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/tutorials"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur hover:bg-white/20 transition-colors"
            >
              More Tutorials
            </Link>
          </div>
        </div>

        {/* ── Related Tutorials ────────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-5 text-xl font-bold text-slate-900">Related Tutorials</h2>
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/tutorials/$slug"
                  params={{ slug: r.slug }}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 hover:border-[#800000]/20 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(128,0,0,0.08)] transition-all duration-300"
                >
                  <div
                    className="mb-4 h-2 w-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${DOMAIN_COLORS[r.domain]}, ${DOMAIN_COLORS[r.domain]}44)`,
                    }}
                    aria-hidden="true"
                  />
                  <DomainBadge domain={r.domain} />
                  <h3 className="mt-2 text-sm font-semibold leading-snug line-clamp-2 text-slate-800 group-hover:text-[#800000] transition-colors">
                    {r.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {r.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#800000]">
                    Read more <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Back link ─────────────────────────────────────────────────────── */}
        <div className="mt-12 pb-6">
          <Link
            to="/tutorials"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#800000] hover:underline hover:text-[#6B0000] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all tutorials
          </Link>
        </div>
      </div>
    </>
  );
}
