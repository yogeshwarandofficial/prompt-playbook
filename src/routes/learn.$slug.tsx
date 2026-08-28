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
      <h1 className="text-2xl font-bold text-white">Course not found</h1>
      <Link to="/roadmaps" className="mt-4 inline-block text-blue-500 hover:text-blue-400 font-medium transition-colors">
        Back to roadmaps
      </Link>
    </div>
  ),
});

// ── Phase badge colours ──────────────────────────────────────────
const PHASE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Beginner:     { bg: "bg-emerald-500/10",  text: "text-emerald-400", border: "border-emerald-500/20" },
  Foundations:  { bg: "bg-blue-500/10",  text: "text-blue-400", border: "border-blue-500/20" },
  Intermediate: { bg: "bg-indigo-500/10",  text: "text-indigo-400", border: "border-indigo-500/20" },
  Advanced:     { bg: "bg-purple-500/10",  text: "text-purple-400", border: "border-purple-500/20" },
};
function phaseColor(phase: string) {
  return PHASE_COLORS[phase] ?? PHASE_COLORS["Beginner"];
}

// ── Section heading ────────────────────────────────────────────────────────────
function SectionHeading({ icon, children, badge }: { icon: React.ReactNode; children: React.ReactNode; badge?: string }) {
  return (
    <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-sm text-blue-500">
          {icon}
        </span>
        <h2 className="text-xl font-semibold text-white tracking-tight uppercase">{children}</h2>
      </div>
      {badge && (
        <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
          {badge}
        </span>
      )}
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
    <div className="rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden transition-all duration-200 hover:border-white/20">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center gap-5 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white/80 bg-white/5 border border-white/10"
        >
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-200 text-base">{topic.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-400 border border-white/5">
            {topic.lessons.length} lessons
          </span>
          <ChevronDown
            className={cn("h-5 w-5 shrink-0 text-slate-500 transition-transform hover:text-white", open && "rotate-180 text-white")}
            aria-hidden="true"
          />
        </div>
      </button>
      {open && (
        <ul className="border-t border-white/5 bg-[#050505] px-5 py-4 space-y-3">
          {topic.lessons.map((lesson, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" aria-hidden="true" />
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

  const phaseIcons: Record<string, string> = {
    Beginner: "👦",
    Foundations: "👦",
    Intermediate: "🧑‍🎓",
    Advanced: "🧑‍💼",
  };
  const icon = phaseIcons[module.phase] || module.emoji;

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      {moduleIndex < totalModules - 1 && (
        <div
          className="absolute left-[31px] top-16 bottom-[-24px] w-[2px] rounded-full -z-10 bg-white/5"
          aria-hidden="true"
        />
      )}
      {/* Phase header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl bg-white/5 border border-white/10">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold border uppercase tracking-widest", pc.bg, pc.text, pc.border)}>
              {module.phase}
            </span>
            <span className="text-xs text-slate-500 font-medium">{totalTopics} modules · {totalLessons} lessons</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Phase {moduleIndex + 1}: {module.phase}
          </h3>
          <p className="mt-1 text-sm text-slate-400 font-medium">{module.summary}</p>
        </div>
      </div>
      {/* Topic cards */}
      <div className="sm:ml-[5rem] space-y-3">
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
    <div className="min-h-screen bg-black text-slate-300 selection:bg-blue-500/30 selection:text-white pb-24 font-sans">
      
      {/* Hero Header Section */}
      <div className="pt-24 pb-16 px-6 sm:px-12 max-w-5xl mx-auto border-b border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/roadmaps" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">
            Roadmaps
          </Link>
          <ChevronRight className="h-4 w-4 text-slate-700" />
          <span className="text-sm font-medium text-slate-300">{roadmap.title}</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
          Learn <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">{roadmap.title}</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl leading-relaxed">
          {roadmap.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
            {domain.icon} {DOMAIN_NAME_MAP[roadmap.domain]}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300">
            <BarChart3 className="h-4 w-4 text-slate-500" /> {roadmap.difficulty}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300">
            <Clock className="h-4 w-4 text-slate-500" /> {roadmap.duration}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">

          {/* ── Left: Curriculum ──────────────────────────────────────────── */}
          <div className="min-w-0 space-y-10">

            {/* Overview */}
            <section className="rounded-[1.5rem] border border-white/10 bg-[#0a0a0a] p-6 sm:p-8 relative overflow-hidden group hover:border-white/20 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <SectionHeading icon={<Sparkles className="h-5 w-5" />} badge="#1 in demand">
                  Course Overview
                </SectionHeading>
                
                <h3 className="text-xl font-bold text-white mb-6">
                  Add <span className="text-blue-400">Intelligence</span> to Everything You Build.
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/5 bg-white/5 p-5">
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Who This Is For</h4>
                    <p className="text-sm leading-relaxed text-slate-300">{roadmap.audience}</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/5 p-5">
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Prerequisites</h4>
                    <ul className="space-y-2">
                      {roadmap.prerequisites.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <ChevronRight className="h-4 w-4 mt-0.5 shrink-0 text-blue-500" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Full Curriculum */}
            <section id="curriculum" className="rounded-[1.5rem] border border-white/10 bg-[#0a0a0a] p-6 sm:p-8 hover:border-white/20 transition-colors">
              <SectionHeading icon={<BookOpen className="h-5 w-5" />}>Full Curriculum</SectionHeading>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                {[
                  { label: "Phases",  value: roadmap.modules.length },
                  { label: "Modules", value: totalTopics },
                  { label: "Lessons", value: totalLessons },
                  { label: "Projects", value: roadmap.projects.length },
                ].map((s) => (
                   <div key={s.label} className="rounded-xl border border-white/5 bg-white/5 p-4 flex flex-col items-center justify-center text-center">
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

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
            <section id="projects" className="rounded-[1.5rem] border border-white/10 bg-[#0a0a0a] p-6 sm:p-8 hover:border-white/20 transition-colors">
              <SectionHeading icon={<Trophy className="h-5 w-5" />}>Capstone Projects</SectionHeading>
              <div className="grid gap-4 sm:grid-cols-2">
                {roadmap.projects.map((project, i) => (
                  <div
                    key={project.title}
                    className="rounded-xl border border-white/5 bg-white/5 p-6 transition-all hover:bg-white/10"
                  >
                    <p className="text-xs font-bold text-blue-500 mb-2 uppercase tracking-widest">Project {i + 1}</p>
                    <h3 className="font-bold text-lg mb-2 text-white">{project.title}</h3>
                    <p className="text-sm text-slate-400 mb-5 leading-relaxed">{project.description}</p>
                    {project.tech && (
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-black border border-white/10 px-3 py-1 text-xs font-medium text-slate-300"
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
            <section id="careers" className="rounded-[1.5rem] border border-white/10 bg-[#0a0a0a] p-6 sm:p-8 hover:border-white/20 transition-colors">
              <SectionHeading icon={<BriefcaseIcon className="h-5 w-5" />}>Career Outcomes</SectionHeading>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {roadmap.careers.map((career) => (
                  <div
                    key={career.role}
                    className="rounded-xl border border-white/5 bg-white/5 p-5 text-center"
                  >
                    <p className="font-semibold text-sm text-white mb-1">{career.role}</p>
                    <p className="text-lg font-bold text-emerald-400 mb-2">
                      {career.salary}
                    </p>
                    {career.companies && (
                      <p className="text-xs text-slate-500">
                        e.g. {career.companies.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* ── Right: Sticky Sidebar ──────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">

            {/* Quick Enrol Card */}
            <div className="rounded-[1.5rem] p-6 sm:p-8 border border-white/10 bg-gradient-to-b from-[#111] to-[#0a0a0a] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
              
              <div className="mb-6">
                <span className="inline-block rounded-full bg-white/5 border border-white/10 text-white px-3 py-1 text-xs font-semibold uppercase tracking-widest mb-4">Start Building</span>
                <h3 className="text-2xl font-bold text-white leading-tight">Outcome based development</h3>
              </div>
              
              <dl className="space-y-4 text-sm pt-4 border-t border-white/10 mb-8">
                {[
                  { label: "Modules",    val: totalTopics },
                  { label: "Lessons",    val: totalLessons },
                  { label: "Duration",   val: roadmap.duration },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between items-center">
                    <dt className="text-slate-400">{label}</dt>
                    <dd className="font-semibold text-white">{val}</dd>
                  </div>
                ))}
              </dl>
              
              <Link
                to="/internships"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-colors"
              >
                Apply for Internship <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Table of Contents */}
            <div className="rounded-[1.5rem] border border-white/10 bg-[#0a0a0a] p-6">
              <h3 className="mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">In This Course</h3>
              <nav className="space-y-1">
                {[
                  { label: "Course Overview", href: "#overview"  },
                  { label: "Full Curriculum", href: "#curriculum" },
                  { label: "Projects",        href: "#projects"  },
                  { label: "Career Outcomes", href: "#careers"   },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
