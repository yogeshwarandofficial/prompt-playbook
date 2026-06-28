import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
  BookOpen,
  Layers,
  BriefcaseIcon,
  Trophy,
  Users,
  BarChart3,
  Sparkles,
} from "lucide-react";
import {
  ROADMAPS,
  DOMAINS,
  DOMAIN_COLORS,
  DOMAIN_NAME_MAP,
  type Roadmap,
  type RoadmapModule,
} from "@/data/content";
import { PageHeader } from "./roadmaps";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn/$slug")({
  loader: ({ params }): { roadmap: Roadmap } => {
    const roadmap = ROADMAPS.find((r) => r.slug === params.slug);
    if (!roadmap) throw notFound();
    return { roadmap };
  },
  head: ({ loaderData }) => {
    const r = loaderData?.roadmap;
    if (!r) return {};
    return {
      meta: [
        { title: `Learn ${r.title} — Infynux Academy` },
        { name: "description", content: r.description },
        { property: "og:title", content: `Learn ${r.title} — Infynux Academy` },
        { property: "og:description", content: r.description },
      ],
    };
  },
  component: LearnPage,
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Course not found</h1>
      <Link to="/roadmaps" className="mt-4 inline-block text-[#800000] hover:underline font-semibold">
        Back to roadmaps
      </Link>
    </div>
  ),
});

// ── Phase badge colours (light-safe) ──────────────────────────────────────────
const PHASE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Beginner:     { bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-200" },
  Foundations:  { bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-200" },
  Intermediate: { bg: "bg-amber-50",    text: "text-amber-700",   border: "border-amber-200"   },
  Advanced:     { bg: "bg-rose-50",     text: "text-rose-700",    border: "border-rose-200"    },
};
function phaseColor(phase: string) {
  return PHASE_COLORS[phase] ?? PHASE_COLORS["Beginner"];
}

// ── Section heading ────────────────────────────────────────────────────────────
function SectionHeading({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#800000]/8 border border-[#800000]/12 text-[#800000]">
        {icon}
      </span>
      <h2 className="text-xl font-bold text-slate-900">{children}</h2>
    </div>
  );
}

// ── Expandable Topic Card ──────────────────────────────────────────────────────
function TopicCard({
  topic,
  index,
  domainColor,
}: {
  topic: { name: string; lessons: string[]; duration: string };
  index: number;
  domainColor: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all hover:border-[#800000]/20 hover:shadow-[0_4px_16px_rgba(128,0,0,0.07)]">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ background: domainColor }}
        >
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-800 leading-snug">{topic.name}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {topic.lessons.length} lessons · {topic.duration}
          </p>
        </div>
        <ChevronDown
          className={cn("h-5 w-5 shrink-0 text-slate-400 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {open && (
        <ul className="border-t border-slate-100 bg-slate-50/50 px-5 py-4 space-y-2">
          {topic.lessons.map((lesson, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#800000]" aria-hidden="true" />
              {lesson}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Module Phase Section ───────────────────────────────────────────────────────
function ModuleSection({
  module,
  moduleIndex,
  totalModules,
  domainColor,
}: {
  module: RoadmapModule;
  moduleIndex: number;
  totalModules: number;
  domainColor: string;
}) {
  const pc = phaseColor(module.phase);
  const totalLessons = module.topics.reduce((acc, t) => acc + t.lessons.length, 0);
  const totalTopics = module.topics.length;

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      {moduleIndex < totalModules - 1 && (
        <div
          className="absolute left-6 top-16 bottom-0 w-0.5 -z-10"
          style={{ background: `linear-gradient(to bottom, ${domainColor}50, transparent)` }}
          aria-hidden="true"
        />
      )}
      {/* Phase header */}
      <div className="flex items-start gap-4 mb-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-sm border border-slate-200 bg-white">
          {module.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={cn("rounded-full px-3 py-0.5 text-xs font-bold border", pc.bg, pc.text, pc.border)}>
              {module.phase}
            </span>
            <span className="text-xs text-slate-400">{totalTopics} modules · {totalLessons} lessons</span>
          </div>
          <h3 className="text-base font-bold text-slate-800 leading-snug">
            Phase {moduleIndex + 1}: {module.phase}
          </h3>
          <p className="mt-1 text-sm text-slate-500 leading-relaxed">{module.summary}</p>
        </div>
      </div>
      {/* Topic cards */}
      <div className="ml-16 space-y-3">
        {module.topics.map((topic, i) => (
          <TopicCard
            key={topic.name}
            topic={topic}
            index={i}
            domainColor={domainColor}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
function LearnPage() {
  const { roadmap } = Route.useLoaderData() as { roadmap: Roadmap };
  const domain = DOMAINS.find((d) => d.key === roadmap.domain)!;
  const domainColor = DOMAIN_COLORS[roadmap.domain];

  const totalLessons = roadmap.modules.reduce(
    (acc, m) => acc + m.topics.reduce((a, t) => a + t.lessons.length, 0),
    0,
  );
  const totalTopics = roadmap.modules.reduce((acc, m) => acc + m.topics.length, 0);

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Roadmaps", to: "/roadmaps" },
          { label: roadmap.title },
        ]}
        title={`Learn ${roadmap.title}`}
        subtitle={roadmap.description}
      />

      {/* ── Hero Stats Banner ─────────────────────────────────────────────── */}
      <div className="w-full border-b border-slate-200 bg-white">
        <div className="container-page max-w-5xl py-8">
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-white"
              style={{ background: domainColor }}
            >
              {domain.icon} {DOMAIN_NAME_MAP[roadmap.domain]}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-600">
              <BarChart3 className="h-3.5 w-3.5" /> {roadmap.difficulty}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-600">
              <Clock className="h-3.5 w-3.5" /> {roadmap.duration}
            </span>
          </div>
          {/* Stat pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Phases",  value: roadmap.modules.length, icon: <Layers className="h-4 w-4" /> },
              { label: "Modules", value: totalTopics,            icon: <BookOpen className="h-4 w-4" /> },
              { label: "Lessons", value: totalLessons,           icon: <CheckCircle2 className="h-4 w-4" /> },
              { label: "Projects", value: roadmap.projects.length, icon: <Trophy className="h-4 w-4" /> },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  {s.icon} {s.label}
                </div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="container-page max-w-5xl py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">

          {/* ── Left: Curriculum ──────────────────────────────────────────── */}
          <div className="min-w-0 space-y-14">

            {/* Overview */}
            <section>
              <SectionHeading icon={<Sparkles className="h-5 w-5" />}>Course Overview</SectionHeading>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-[#800000]/20 transition-colors">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Who This Is For</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{roadmap.audience}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-[#800000]/20 transition-colors">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Prerequisites</h3>
                  <ul className="space-y-2">
                    {roadmap.prerequisites.map((p, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#800000]" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Full Curriculum */}
            <section id="curriculum">
              <SectionHeading icon={<BookOpen className="h-5 w-5" />}>Full Curriculum</SectionHeading>
              <div className="space-y-12">
                {roadmap.modules.map((module, i) => (
                  <ModuleSection
                    key={module.phase}
                    module={module}
                    moduleIndex={i}
                    totalModules={roadmap.modules.length}
                    domainColor={domainColor}
                  />
                ))}
              </div>
            </section>

            {/* Projects */}
            <section id="projects">
              <SectionHeading icon={<Trophy className="h-5 w-5" />}>Capstone Projects</SectionHeading>
              <div className="grid gap-4 sm:grid-cols-2">
                {roadmap.projects.map((project, i) => (
                  <div
                    key={project.title}
                    className="group relative rounded-2xl border border-slate-200 bg-white p-5 overflow-hidden hover:border-[#800000]/20 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(128,0,0,0.08)] transition-all duration-300"
                  >
                    <div
                      className="absolute -top-6 -right-6 h-20 w-20 rounded-full opacity-10"
                      style={{ background: domainColor }}
                      aria-hidden="true"
                    />
                    <p className="text-xs font-semibold text-slate-400 mb-1">Project {i + 1}</p>
                    <h3 className="font-bold text-base mb-2 text-slate-800">{project.title}</h3>
                    <p className="text-sm text-slate-500 mb-4 leading-relaxed">{project.description}</p>
                    {project.tech && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Career Outcomes */}
            <section id="careers">
              <SectionHeading icon={<BriefcaseIcon className="h-5 w-5" />}>Career Outcomes</SectionHeading>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {roadmap.careers.map((career) => (
                  <div
                    key={career.role}
                    className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-[#800000]/20 hover:shadow-[0_4px_16px_rgba(128,0,0,0.06)] transition-all"
                    style={{ borderTop: `3px solid ${domainColor}` }}
                  >
                    <p className="font-bold text-sm text-slate-800">{career.role}</p>
                    <p className="mt-1 text-lg font-bold" style={{ color: domainColor }}>
                      {career.salary}
                    </p>
                    {career.companies && (
                      <p className="mt-2 text-xs text-slate-400">
                        e.g. {career.companies.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Resources */}
            <section id="resources">
              <SectionHeading icon={<ExternalLink className="h-5 w-5" />}>Free Resources</SectionHeading>
              <ul className="space-y-3">
                {roadmap.resources.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-[#800000]/30 hover:bg-[#800000]/3 hover:shadow-sm"
                    >
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-[#800000] transition-colors">{r.label}</span>
                      <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-[#800000] transition-colors" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* ── Right: Sticky Sidebar ──────────────────────────────────────── */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">

            {/* Quick Enrol Card */}
            <div className="rounded-2xl p-5 text-white space-y-4 shadow-[0_8px_32px_rgba(128,0,0,0.18)]"
              style={{
                background: `linear-gradient(135deg, #800000 0%, #C41E3A 100%)`,
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Free Course</p>
              <h3 className="text-lg font-bold text-white">{roadmap.title}</h3>
              <dl className="space-y-2 text-sm">
                {[
                  { label: "Phases",     val: roadmap.modules.length },
                  { label: "Lessons",    val: totalLessons },
                  { label: "Duration",   val: roadmap.duration },
                  { label: "Difficulty", val: roadmap.difficulty },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between border-b border-white/10 pb-1.5">
                    <dt className="text-white/70">{label}</dt>
                    <dd className="font-semibold">{val}</dd>
                  </div>
                ))}
              </dl>
              <Link
                to="/internships"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#800000] shadow hover:bg-white/90 transition-colors"
              >
                Apply for Internship <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Table of Contents */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-slate-800">In This Course</h3>
              <nav className="space-y-1">
                {[
                  { label: "Overview",        href: "#overview"  },
                  { label: "Curriculum",      href: "#curriculum" },
                  { label: "Projects",        href: "#projects"  },
                  { label: "Career Outcomes", href: "#careers"   },
                  { label: "Resources",       href: "#resources" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-[#800000]/5 hover:text-[#800000] transition-colors"
                  >
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#800000]/50" />
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Phase overview */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-slate-800">Learning Phases</h3>
              <ol className="space-y-3">
                {roadmap.modules.map((m, i) => {
                  const pc = phaseColor(m.phase);
                  return (
                    <li key={m.phase} className="flex items-center gap-3">
                      <span className="text-xl shrink-0">{m.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-400">Phase {i + 1}</p>
                        <p className={cn("text-xs font-bold", pc.text)}>{m.phase}</p>
                      </div>
                      <span className="shrink-0 text-xs text-slate-400">
                        {m.topics.length} mods
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>
        </div>

        {/* ── CTA Banner ──────────────────────────────────────────────────── */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-[#800000] via-[#9B0000] to-[#C41E3A] px-6 py-12 text-center text-white shadow-[0_16px_48px_rgba(128,0,0,0.22)]">
          <Users className="mx-auto mb-3 h-10 w-10 text-white/80" />
          <h2 className="text-2xl font-bold text-white">Put your skills to work</h2>
          <p className="mt-2 text-white/80 max-w-md mx-auto text-sm leading-relaxed">
            Apply for a real-world {roadmap.title} internship with mentorship, live projects, and a verified certificate.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/internships"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#800000] shadow hover:bg-white/90 transition-colors"
            >
              Apply Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/roadmaps"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur hover:bg-white/20 transition-colors"
            >
              All Roadmaps
            </Link>
          </div>
        </div>

        {/* ── Back Link ───────────────────────────────────────────────────── */}
        <div className="mt-10 pb-6">
          <Link
            to="/roadmaps"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#800000] hover:underline hover:text-[#6B0000] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all roadmaps
          </Link>
        </div>
      </div>
    </>
  );
}
