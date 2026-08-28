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

export const Route = createFileRoute("/tutorials_/$slug")({
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

// ── Difficulty badge — sleek palette ──────────────────────────────────────────
const DIFFICULTY_STYLES: Record<string, string> = {
  Beginner:     "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Intermediate: "bg-amber-50 text-amber-700 border border-amber-200",
  Advanced:     "bg-rose-50 text-rose-700 border border-rose-200",
};
function DifficultyBadge({ level }: { level: string }) {
  return (
    <span className={`inline-flex items-center rounded-lg px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm ${DIFFICULTY_STYLES[level] ?? ""}`}>
      {level}
    </span>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-slate-600">
        {icon}
      </span>
      <h2 className="text-2xl font-bold text-slate-900 tracking-wide">{children}</h2>
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
      {/* ── Seamless Dark Header ─────────────────────────────────────────── */}
      <section className="bg-black pt-32 pb-12 border-b border-white/10 relative z-10">
        <div className="container-page max-w-4xl text-left">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <ChevronRight className="h-3 w-3 text-slate-600" />
              <li>
                <Link to="/tutorials" className="hover:text-white transition-colors">Tutorials</Link>
              </li>
              <ChevronRight className="h-3 w-3 text-slate-600" />
              <li className="text-slate-300">{tutorial.title}</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl tracking-tight leading-tight">
            {tutorial.title}
          </h1>
          <p className="mt-5 max-w-2xl text-slate-400 text-lg leading-relaxed">
            {tutorial.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <DomainBadge domain={tutorial.domain} />
            <DifficultyBadge level={tutorial.difficulty} />
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              <Clock className="h-4 w-4 text-slate-400" /> {tutorial.readMinutes} min read
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              <BookOpen className="h-4 w-4 text-slate-400" /> {tutorial.steps.length} lessons
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {tutorial.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="w-full bg-[#0A0A0A] min-h-screen text-slate-300 pb-24">
      <div className="container-page max-w-4xl py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">

          {/* ── Left: Main Content ────────────────────────────────────────── */}
          <div className="min-w-0 space-y-10">

            {/* What You'll Learn */}
            <section>
              <SectionHeading icon={<GraduationCap className="h-6 w-6" />}>
                What You'll Learn
              </SectionHeading>
              <ul className="grid gap-4 sm:grid-cols-2">
                {tutorial.whatYouWillLearn.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
                    <span className="text-sm font-semibold leading-relaxed text-slate-200">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Prerequisites */}
            <section>
              <SectionHeading icon={<AlertCircle className="h-6 w-6" />}>
                Prerequisites
              </SectionHeading>
              <ul className="space-y-3">
                {tutorial.prerequisites.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Step-by-step lessons */}
            <section>
              <SectionHeading icon={<Layers className="h-6 w-6" />}>
                Step-by-Step Guide
              </SectionHeading>
              <ol className="space-y-6">
                {tutorial.steps.map((step, i) => (
                  <li
                    key={i}
                    className="relative rounded-3xl border border-white/10 bg-[#0F0F0F] p-8 hover:border-white/20 transition-all"
                  >
                    {/* Accent bar */}
                    <div
                      className="absolute left-0 top-8 bottom-8 w-1 rounded-r-full opacity-70"
                      style={{ background: DOMAIN_COLORS[tutorial.domain] }}
                      aria-hidden="true"
                    />
                    <p className="pl-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                      Step {i + 1}
                    </p>
                    <h3 className="pl-6 text-xl font-bold leading-snug text-white">
                      {step.title}
                    </h3>
                    <p className="mt-4 pl-6 text-sm leading-relaxed text-slate-400">
                      {step.content}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Resources */}
            <section>
              <SectionHeading icon={<FileText className="h-6 w-6" />}>
                Further Reading & Resources
              </SectionHeading>
              <ul className="space-y-4">
                {tutorial.resources.map((r, i) => (
                  <li key={i}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:border-white/20 hover:bg-white/10"
                    >
                      <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                        {r.label}
                      </span>
                      <ExternalLink className="h-4 w-4 shrink-0 text-slate-500 group-hover:text-white transition-colors" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* ── Right: Sticky Sidebar ─────────────────────────────────────── */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">

            {/* Quick Info Card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
              <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase">Course Info</h3>
              <dl className="space-y-4 text-sm">
                {[
                  { label: "Domain",    val: <span className="font-semibold text-white">{domainName}</span> },
                  { label: "Level",     val: <DifficultyBadge level={tutorial.difficulty} /> },
                  { label: "Read Time", val: <span className="font-semibold text-white">{tutorial.readMinutes} minutes</span> },
                  { label: "Lessons",   val: <span className="font-semibold text-white">{tutorial.steps.length} steps</span> },
                  { label: "Resources", val: <span className="font-semibold text-white">{tutorial.resources.length} links</span> },
                ].map(({ label, val }) => (
                  <div key={label} className="flex items-center justify-between border-b border-white/10 pb-2">
                    <dt className="text-slate-400 font-medium">{label}</dt>
                    <dd>{val}</dd>
                  </div>
                ))}
              </dl>

              {/* Save Course button */}
              <button
                type="button"
                onClick={toggle}
                aria-pressed={saved}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold transition-all uppercase tracking-wider ${
                  saved
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10"
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
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white hover:bg-blue-700 transition-all uppercase tracking-wider shadow-sm"
              >
                Apply for Internship <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Table of Contents */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Contents</h3>
              <ol className="space-y-4">
                {tutorial.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300 font-medium hover:text-white transition-colors cursor-default">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white shadow-sm"
                      style={{ background: DOMAIN_COLORS[tutorial.domain] }}
                    >
                      {i + 1}
                    </span>
                    <span className="leading-snug line-clamp-2 pt-0.5">
                      {step.title.replace(/^\d+\.\s*/, "")}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>

        {/* ── CTA Banner ───────────────────────────────────────────────────── */}
        <div className="mt-16 rounded-[2rem] border border-white/10 bg-[#0F0F0F] px-8 py-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[60px]" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white tracking-tight">Ready to put this into practice?</h2>
            <p className="mt-4 text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
              Apply for a real {domainName} internship and ship production projects with mentorship.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/internships"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-sm"
              >
                Apply Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/tutorials"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold text-slate-300 hover:border-white/20 hover:bg-white/10 transition-colors"
              >
                More Tutorials
              </Link>
            </div>
          </div>
        </div>

        {/* ── Related Tutorials ────────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-xl font-bold text-white tracking-wide">Related Tutorials</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/tutorials/$slug"
                  params={{ slug: r.slug }}
                  className="group flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden relative"
                >
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-[30px]"
                    style={{ background: DOMAIN_COLORS[r.domain] }}
                  />
                  <div className="relative z-10">
                    <DomainBadge domain={r.domain} />
                    <h3 className="mt-4 text-base font-bold leading-snug line-clamp-2 text-white group-hover:text-blue-400 transition-colors tracking-tight">
                      {r.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-slate-400 line-clamp-3 leading-relaxed">
                      {r.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest">
                      Read more <ArrowRight className="h-3 w-3" />
                    </div>
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
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all tutorials
          </Link>
        </div>
      </div>
      </div>
    </>
  );
}
