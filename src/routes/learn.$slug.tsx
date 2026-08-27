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
    <div className="mb-8 flex items-center gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0A0A0A] border-4 border-[#222] text-primary shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        {icon}
      </span>
      <h2 className="text-2xl font-black text-slate-900 font-orbitron">{children}</h2>
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
    <div className="rounded-xl border border-black bg-white overflow-hidden transition-all hover:shadow-md hover:border-black group">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black text-black border-2 border-black font-orbitron shadow-sm"
          style={{ background: domainColor }}
        >
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-slate-900 leading-snug font-orbitron text-lg">{topic.name}</p>
          <p className="mt-1 text-xs text-slate-500 font-outfit font-semibold uppercase tracking-wider">
            {topic.lessons.length} lessons · {topic.duration}
          </p>
        </div>
        <ChevronDown
          className={cn("h-6 w-6 shrink-0 text-slate-400 transition-transform group-hover:text-primary", open && "rotate-180 text-primary")}
          aria-hidden="true"
        />
      </button>
      {open && (
        <ul className="border-t border-slate-100 bg-slate-50 px-6 py-5 space-y-3">
          {topic.lessons.map((lesson, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-outfit font-medium">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
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
      <div className="flex items-start gap-5 mb-8">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-[4px_4px_0px_rgba(0,0,0,1)] border-4 border-black bg-white">
          {module.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className={cn("rounded-xl px-3 py-1 text-xs font-black border-2 uppercase tracking-wider font-orbitron", pc.bg, pc.text, pc.border)}>
              {module.phase}
            </span>
            <span className="text-xs text-slate-500 font-outfit font-bold uppercase tracking-wider">{totalTopics} modules · {totalLessons} lessons</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 leading-snug font-orbitron">
            Phase {moduleIndex + 1}: {module.phase}
          </h3>
          <p className="mt-2 text-base text-slate-600 leading-relaxed font-outfit font-medium">{module.summary}</p>
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
      <div className="w-full border-b-4 border-[#222] bg-[#0A0A0A] text-white py-10">
        <div className="container-page max-w-5xl">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black text-black border-2 border-black uppercase tracking-wider font-orbitron"
              style={{ background: domainColor }}
            >
              {domain.icon} {DOMAIN_NAME_MAP[roadmap.domain]}
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl border-2 border-[#333] bg-[#111] px-4 py-2 text-sm font-bold text-[#C7CBCE] font-orbitron">
              <BarChart3 className="h-4 w-4 text-primary" /> {roadmap.difficulty}
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl border-2 border-[#333] bg-[#111] px-4 py-2 text-sm font-bold text-[#C7CBCE] font-orbitron">
              <Clock className="h-4 w-4 text-primary" /> {roadmap.duration}
            </span>
          </div>
          {/* Stat pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Phases",  value: roadmap.modules.length, icon: <Layers className="h-5 w-5" /> },
              { label: "Modules", value: totalTopics,            icon: <BookOpen className="h-5 w-5" /> },
              { label: "Lessons", value: totalLessons,           icon: <CheckCircle2 className="h-5 w-5" /> },
              { label: "Projects", value: roadmap.projects.length, icon: <Trophy className="h-5 w-5" /> },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border-2 border-[#333] bg-[#111] p-5 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 text-primary text-sm font-bold font-orbitron uppercase tracking-widest mb-2">
                  {s.icon} {s.label}
                </div>
                <p className="text-3xl font-black text-white font-orbitron">{s.value}</p>
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
              <SectionHeading icon={<Sparkles className="h-6 w-6" />}>Course Overview</SectionHeading>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border-2 border-black bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Who This Is For</h3>
                  <p className="text-sm leading-relaxed text-slate-700">{roadmap.audience}</p>
                </div>
                <div className="rounded-xl border-2 border-black bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Prerequisites</h3>
                  <ul className="space-y-3">
                    {roadmap.prerequisites.map((p, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-outfit font-medium">
                        <ChevronRight className="h-5 w-5 shrink-0 text-primary font-bold" />
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
              <div className="grid gap-6 sm:grid-cols-2">
                {roadmap.projects.map((project, i) => (
                  <div
                    key={project.title}
                    className="group relative rounded-2xl border-2 border-black bg-white p-6 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <div
                      className="absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-[0.08]"
                      style={{ background: domainColor }}
                      aria-hidden="true"
                    />
                    <p className="text-xs font-bold text-[#800000] mb-2 uppercase tracking-widest">Project {i + 1}</p>
                    <h3 className="font-bold text-xl mb-3 text-slate-800">{project.title}</h3>
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">{project.description}</p>
                    {project.tech && (
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
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
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {roadmap.careers.map((career) => (
                  <div
                    key={career.role}
                    className="rounded-xl border-2 border-black bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                  >
                    <p className="font-bold text-sm text-slate-800 tracking-wide">{career.role}</p>
                    <p className="mt-2 text-2xl font-bold text-emerald-600">
                      {career.salary}
                    </p>
                    {career.companies && (
                      <p className="mt-3 text-xs font-medium text-slate-500">
                        e.g. {career.companies.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Resources */}
            <section id="resources">
              <SectionHeading icon={<ExternalLink className="h-6 w-6" />}>Free Resources</SectionHeading>
              <ul className="space-y-4">
                {roadmap.resources.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-xl border-2 border-black bg-white p-5 transition-all hover:border-black hover:shadow-md"
                    >
                      <span className="text-base font-bold text-slate-800 group-hover:text-slate-900 transition-colors">{r.label}</span>
                      <ExternalLink className="h-5 w-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* ── Right: Sticky Sidebar ──────────────────────────────────────── */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">

            {/* Quick Enrol Card */}
            <div className="rounded-[32px] p-8 text-white space-y-6 shadow-[0_10px_40px_rgba(156,255,59,0.15)] border-4 border-primary bg-[#0A0A0A] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[40px]" />
              <p className="text-xs font-black uppercase tracking-widest text-primary font-orbitron">Free Course</p>
              <h3 className="text-2xl font-black text-white font-orbitron leading-tight">{roadmap.title}</h3>
              <dl className="space-y-4 text-sm font-outfit">
                {[
                  { label: "Phases",     val: roadmap.modules.length },
                  { label: "Lessons",    val: totalLessons },
                  { label: "Duration",   val: roadmap.duration },
                  { label: "Difficulty", val: roadmap.difficulty },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between border-b border-[#333] pb-2">
                    <dt className="text-[#C7CBCE] font-semibold">{label}</dt>
                    <dd className="font-bold text-white">{val}</dd>
                  </div>
                ))}
              </dl>
              <Link
                to="/internships"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                Apply for Internship <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Table of Contents */}
            <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-sm font-bold text-slate-900 uppercase tracking-widest">In This Course</h3>
              <nav className="space-y-2">
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
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-[#F4F7EB] hover:text-black hover:border-l-4 hover:border-primary transition-all font-outfit"
                  >
                    <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Phase overview */}
            <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-sm font-bold text-slate-900 uppercase tracking-widest">Learning Phases</h3>
              <ol className="space-y-4">
                {roadmap.modules.map((m, i) => {
                  const pc = phaseColor(m.phase);
                  return (
                    <li key={m.phase} className="flex items-center gap-4">
                      <span className="text-2xl shrink-0 p-2 border-2 border-black rounded-xl bg-[#F9FAF5] shadow-[2px_2px_0px_rgba(0,0,0,1)]">{m.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-wider font-orbitron">Phase {i + 1}</p>
                        <p className={cn("text-sm font-bold mt-0.5", pc.text)}>{m.phase}</p>
                      </div>
                      <span className="shrink-0 text-xs font-bold text-slate-500 font-outfit bg-slate-100 px-2 py-1 rounded-md">
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
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all"
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
