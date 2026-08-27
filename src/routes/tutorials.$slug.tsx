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
  Beginner:     "bg-[#F9FAF5] text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
  Intermediate: "bg-amber-100 text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
  Advanced:     "bg-rose-100    text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
};
function DifficultyBadge({ level }: { level: string }) {
  return (
    <span className={`inline-flex items-center rounded-lg px-3 py-1 text-[11px] font-black uppercase tracking-wider font-orbitron ${DIFFICULTY_STYLES[level] ?? ""}`}>
      {level}
    </span>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0A0A0A] border-2 border-[#222] text-primary shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        {icon}
      </span>
      <h2 className="text-2xl font-black text-slate-900 font-orbitron tracking-wide">{children}</h2>
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
      <div className="w-full border-b-4 border-[#222] bg-white">
        <div className="container-page max-w-4xl py-6">
          <div className="flex flex-wrap items-center gap-4">
            <DomainBadge domain={tutorial.domain} />
            <DifficultyBadge level={tutorial.difficulty} />
            <span className="inline-flex items-center gap-2 rounded-lg border-2 border-[#222] bg-[#0A0A0A] px-4 py-1.5 text-[11px] font-bold text-white uppercase tracking-wider font-orbitron">
              <Clock className="h-4 w-4 text-primary" /> {tutorial.readMinutes} min read
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg border-2 border-[#222] bg-[#0A0A0A] px-4 py-1.5 text-[11px] font-bold text-white uppercase tracking-wider font-orbitron">
              <BookOpen className="h-4 w-4 text-primary" /> {tutorial.steps.length} lessons
            </span>
          </div>
          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {tutorial.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border-2 border-[#222] bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 font-orbitron uppercase tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-[#F9FAF5] transition-colors"
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
              <SectionHeading icon={<GraduationCap className="h-6 w-6" />}>
                What You'll Learn
              </SectionHeading>
              <ul className="grid gap-4 sm:grid-cols-2">
                {tutorial.whatYouWillLearn.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 rounded-2xl border-4 border-[#222] bg-white p-5 hover:border-primary hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-black font-black" aria-hidden="true" />
                    <span className="text-base font-bold leading-snug text-slate-800 font-outfit">{item}</span>
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
                  <li key={i} className="flex items-center gap-3 text-base font-bold text-slate-800 font-outfit">
                    <ChevronRight className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
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
                    className="relative rounded-3xl border-4 border-[#222] bg-white p-8 hover:border-primary hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    {/* Accent bar */}
                    <div
                      className="absolute left-0 top-6 bottom-6 w-2 rounded-r-xl"
                      style={{ background: DOMAIN_COLORS[tutorial.domain] }}
                      aria-hidden="true"
                    />
                    <p className="pl-6 text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 font-orbitron">
                      Step {i + 1}
                    </p>
                    <h3 className="pl-6 text-xl font-black leading-snug text-slate-900 font-orbitron">
                      {step.title}
                    </h3>
                    <p className="mt-4 pl-6 text-base leading-relaxed text-slate-600 font-outfit font-medium">
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
                      className="group flex items-center justify-between rounded-xl border-4 border-[#222] bg-white p-5 transition-all hover:border-primary hover:shadow-[4px_4px_0px_rgba(156,255,59,0.2)]"
                    >
                      <span className="text-base font-bold text-slate-800 group-hover:text-black font-orbitron transition-colors">
                        {r.label}
                      </span>
                      <ExternalLink className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-black transition-colors" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* ── Right: Sticky Sidebar ─────────────────────────────────────── */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">

            {/* Quick Info Card */}
            <div className="rounded-3xl border-4 border-[#222] bg-white p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] space-y-6">
              <h3 className="text-lg font-black text-slate-900 font-orbitron tracking-wide uppercase">Course Info</h3>
              <dl className="space-y-4 text-sm font-outfit">
                {[
                  { label: "Domain",    val: <span className="font-bold text-slate-800">{domainName}</span> },
                  { label: "Level",     val: <DifficultyBadge level={tutorial.difficulty} /> },
                  { label: "Read Time", val: <span className="font-bold text-slate-800">{tutorial.readMinutes} minutes</span> },
                  { label: "Lessons",   val: <span className="font-bold text-slate-800">{tutorial.steps.length} steps</span> },
                  { label: "Resources", val: <span className="font-bold text-slate-800">{tutorial.resources.length} links</span> },
                ].map(({ label, val }) => (
                  <div key={label} className="flex items-center justify-between border-b border-[#222] pb-2">
                    <dt className="text-slate-500 font-semibold">{label}</dt>
                    <dd>{val}</dd>
                  </div>
                ))}
              </dl>

              {/* Save Course button */}
              <button
                type="button"
                onClick={toggle}
                aria-pressed={saved}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border-4 px-4 py-4 text-sm font-black transition-all font-orbitron uppercase tracking-wider ${
                  saved
                    ? "border-black bg-primary text-black shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                    : "border-[#222] bg-slate-50 text-slate-800 hover:border-black hover:bg-[#0A0A0A] hover:text-primary hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                }`}
              >
                {saved ? (
                  <><BookmarkCheck className="h-5 w-5" /> Course Saved!</>
                ) : (
                  <><Bookmark className="h-5 w-5" /> Save Course</>
                )}
              </button>

              <Link
                to="/internships"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0A0A0A] px-4 py-4 text-sm font-black text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-black hover:text-primary transition-all font-orbitron border-4 border-transparent hover:border-primary uppercase tracking-wider"
              >
                Apply for Internship <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Table of Contents */}
            <div className="rounded-3xl border-4 border-[#222] bg-white p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
              <h3 className="mb-5 text-sm font-black text-slate-900 uppercase tracking-widest font-orbitron">Contents</h3>
              <ol className="space-y-3">
                {tutorial.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium font-outfit">
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-black text-white shadow-[2px_2px_0px_rgba(0,0,0,1)] border border-black"
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
        <div className="mt-16 rounded-[32px] border-4 border-primary bg-[#0A0A0A] px-8 py-12 text-center text-white shadow-[0_16px_50px_rgba(156,255,59,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[60px]" />
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white font-orbitron">Ready to put this into practice?</h2>
            <p className="mt-4 text-[#C7CBCE] text-lg leading-relaxed font-outfit">
              Apply for a real {domainName} internship and ship production projects with mentorship.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/internships"
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-black text-black shadow-[0_4px_20px_rgba(156,255,59,0.3)] hover:bg-lime-400 transition-colors font-orbitron border-2 border-black"
              >
                Apply Now <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/tutorials"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#333] bg-[#111] px-8 py-4 text-base font-black text-white hover:border-primary hover:text-primary transition-colors font-orbitron"
              >
                More Tutorials
              </Link>
            </div>
          </div>
        </div>

        {/* ── Related Tutorials ────────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-black text-slate-900 font-orbitron">Related Tutorials</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/tutorials/$slug"
                  params={{ slug: r.slug }}
                  className="group flex flex-col rounded-3xl border-4 border-[#222] bg-[#0A0A0A] p-6 hover:border-primary hover:-translate-y-2 hover:shadow-[12px_12px_0px_rgba(156,255,59,1)] transition-all duration-300 overflow-hidden relative"
                >
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-[30px]"
                    style={{ background: DOMAIN_COLORS[r.domain] }}
                  />
                  <div className="relative z-10">
                    <DomainBadge domain={r.domain} />
                    <h3 className="mt-4 text-lg font-black leading-snug line-clamp-2 text-white group-hover:text-primary transition-colors font-orbitron tracking-wide">
                      {r.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-[#C7CBCE] line-clamp-3 leading-relaxed font-outfit">
                      {r.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm font-black text-primary font-orbitron">
                      Read more <ArrowRight className="h-4 w-4" />
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
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#800000] hover:underline hover:text-[#6B0000] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all tutorials
          </Link>
        </div>
      </div>
    </>
  );
}
