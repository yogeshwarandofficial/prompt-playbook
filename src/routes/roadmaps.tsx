import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Code2, Cloud, Smartphone, Cpu, TrendingUp } from "lucide-react";
import { DOMAINS, ROADMAPS } from "@/data/content";
import { cn } from "@/lib/utils";
import { createSeoHead, getBreadcrumbSchema } from "@/lib/seo";
import { ROADMAPS_PAGE_KEYWORDS } from "@/lib/seo-keywords";
import { JsonLd } from "@/components/site/JsonLd";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/roadmaps")({
  loader: async () => {
    return { roadmaps: ROADMAPS };
  },
  head: () =>
    createSeoHead({
      title: "Tech Career Roadmaps 2026 | Web, Cloud AWS, Flutter & AI | Infynux Academy",
      description:
        "Master high-demand tech skills with free structured developer career roadmaps. Step-by-step curricula in Full Stack Web Dev, Cloud AWS, Flutter, Kotlin, AI & Automation for college students and freshers in India.",
      path: "/roadmaps",
      keywords: ROADMAPS_PAGE_KEYWORDS,
      category: "Software Engineering Career Roadmaps",
    }),
  component: RoadmapsPage,
});

function RoadmapsPage() {
  const { roadmaps } = Route.useLoaderData();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Roadmaps", path: "/roadmaps" },
  ]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <JsonLd schema={breadcrumbSchema} />
      
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(rgba(100,116,139,0.1)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-400/10 rounded-full blur-[120px] pointer-events-none z-0 animate-float"></div>

      {/* Hero Section */}
      <header className="relative pt-40 pb-20 lg:pt-48 lg:pb-24 px-6 max-w-[1000px] mx-auto w-full z-10 text-center flex flex-col items-center">
          
          {/* Breadcrumb */}
          <div className="reveal flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8 uppercase tracking-widest animate-fade-up">
              <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4 text-slate-300" />
              <span className="text-[#22c55e]">Roadmaps</span>
          </div>

          <h1 className="reveal text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.05] mb-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
              Developer Career <br/>
              <span className="text-[#22c55e]">Roadmaps.</span>
          </h1>

          <p className="reveal text-lg sm:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '200ms' }}>
              Follow structured, rigorous learning tracks from absolute fundamentals to architect-level engineering. Built for the modern tech industry in India.
          </p>

      </header>

      {/* Roadmaps Grid */}
      <section className="relative z-10 w-full px-6 pb-32 max-w-[1400px] mx-auto">
          
          {/* FEATURED ROADMAP: Full Stack Web Dev (Spans full width) */}
          {(() => {
            const featuredRoadmap = roadmaps.find(r => DOMAINS.find(x => x.key === r.domain)?.key === 'web');
            if (!featuredRoadmap) return null;
            const domain = DOMAINS.find(x => x.key === featuredRoadmap.domain)!;
            
            return (
              <Link 
                to="/learn/$slug"
                params={{ slug: featuredRoadmap.slug }} 
                className="reveal group relative w-full bg-white rounded-[2rem] border border-slate-200 overflow-hidden flex flex-col lg:flex-row hover:border-[#22c55e]/50 transition-all duration-500 hover:-translate-y-1 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(34,197,94,0.12)] mb-8"
              >
                  {/* Image Area */}
                  <div className="w-full lg:w-[45%] aspect-video lg:aspect-auto relative overflow-hidden bg-slate-100 flex-shrink-0">
                      <img 
                          src="/fullstack-image.avif" 
                          alt="Web Development Workspace" 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
                      
                      {/* Floating Badge */}
                      <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl border border-white/20 shadow-sm flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22c55e]"></span>
                          </span>
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Featured Track</span>
                      </div>
                  </div>

                  {/* Content Area */}
                  <div className="w-full lg:w-[55%] p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-[#16a34a] border border-green-100">
                              <Code2 className="w-6 h-6" />
                          </div>
                      </div>

                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-[#16a34a] transition-colors duration-300">
                          {featuredRoadmap.title}
                      </h2>
                      
                      <p className="text-slate-500 text-base lg:text-lg font-medium leading-relaxed mb-10 max-w-xl">
                          {domain.description || featuredRoadmap.description}
                      </p>

                      {/* Tech Stack Pills */}
                      <div className="mb-10">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Core Technologies</p>
                          <div className="flex flex-wrap gap-2.5">
                              {domain.skills.slice(0, 5).map(skill => (
                                <span key={skill} className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
                                  {skill}
                                </span>
                              ))}
                          </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-[#16a34a] uppercase tracking-widest">
                          Start Learning Path
                          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center transform group-hover:translate-x-2 transition-all duration-300">
                              <ArrowRight className="w-4 h-4" />
                          </div>
                      </div>
                  </div>
              </Link>
            )
          })()}

          {/* SECONDARY ROADMAPS: 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {roadmaps.filter(r => DOMAINS.find(x => x.key === r.domain)?.key !== 'web').map((r, idx) => {
              const d = DOMAINS.find((x) => x.key === r.domain)!;
              
              const imageMap: Record<string, string> = {
                "cloud": "/cloud-image.jpg",
                "app": "/app-image.avif",
                "ai": "/ai-image.avif",
                "marketing": "/digital marketing-image.avif"
              };
              
              const themeMap: Record<string, any> = {
                "cloud": { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", hoverText: "group-hover:text-blue-600", icon: <Cloud className="w-5 h-5" /> },
                "app": { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100", hoverText: "group-hover:text-purple-600", icon: <Smartphone className="w-5 h-5" /> },
                "ai": { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", hoverText: "group-hover:text-emerald-600", icon: <Cpu className="w-5 h-5" /> },
                "marketing": { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100", hoverText: "group-hover:text-rose-600", icon: <TrendingUp className="w-5 h-5" /> }
              };
              
              const theme = themeMap[d.key] || themeMap["cloud"];

              return (
                <Link 
                  key={r.slug}
                  to="/learn/$slug"
                  params={{ slug: r.slug }}
                  className="reveal group relative bg-white rounded-[2rem] border border-slate-200 overflow-hidden flex flex-col hover:border-[#22c55e]/50 transition-all duration-500 hover:-translate-y-1 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(34,197,94,0.12)]" 
                  style={{ transitionDelay: `${(idx + 1) * 100}ms` }}
                >
                  <div className="w-full aspect-[16/9] relative overflow-hidden bg-slate-100">
                      <img 
                          src={imageMap[d.key] || imageMap["cloud"]} 
                          alt={`${r.title} Architecture`} 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                      />
                  </div>

                  <div className="p-8 sm:p-10 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-5">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", theme.bg, theme.text, theme.border)}>
                              {theme.icon}
                          </div>
                          <h3 className={cn("text-2xl font-black text-slate-900 tracking-tight transition-colors", theme.hoverText)}>
                              {r.title}
                          </h3>
                      </div>
                      
                      <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-1">
                          {d.description || r.description}
                      </p>

                      <div className="mb-8">
                          <div className="flex flex-wrap gap-2">
                              {d.skills.slice(0, 5).map(skill => (
                                <span key={skill} className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-600">
                                  {skill}
                                </span>
                              ))}
                          </div>
                      </div>

                      <div className={cn("inline-flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-widest transition-colors", theme.hoverText)}>
                          View Roadmap
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                      </div>
                  </div>
                </Link>
              );
            })}
          </div>
      </section>
    </div>
  );
}



export function PageHeader({
  crumbs, title, subtitle, theme = "dark", rightElement
}: {
  crumbs: { label: string; to?: string }[];
  title: string;
  subtitle?: string;
  theme?: "dark" | "light";
  rightElement?: React.ReactNode;
}) {
  if (theme === "light") {
    return (
      <section className="bg-white pt-32 pb-12 md:pt-40 md:pb-16 border-b border-slate-200">
        <div className="container-page text-left relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <nav aria-label="Breadcrumb" className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              <ol className="flex flex-wrap items-center gap-1.5">
                {crumbs.map((c, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    {c.to ? (
                      <Link to={c.to} className="hover:text-indigo-600 transition-colors">
                        {c.label}
                      </Link>
                    ) : (
                      <span className="text-slate-600">{c.label}</span>
                    )}
                    {i < crumbs.length - 1 && <ChevronRight className="h-3 w-3 text-slate-300" />}
                  </li>
                ))}
              </ol>
            </nav>
            <h1 className="mt-6 text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl tracking-tight leading-tight">
              {title}
            </h1>
            {subtitle && <p className="mt-4 max-w-2xl text-slate-600 text-lg leading-relaxed">{subtitle}</p>}
          </div>
          {rightElement && (
            <div className="flex-shrink-0 mt-4 md:mt-0">
              {rightElement}
            </div>
          )}
        </div>
      </section>
    );
  }
  return (
    <section className="relative overflow-hidden border-b-2 border-[#222] bg-[#0A0A0A]">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="container-page pb-12 pt-32 md:pb-16 md:pt-40 text-left relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <nav aria-label="Breadcrumb" className="text-xs text-[#C7CBCE]/70 font-orbitron">
            <ol className="flex flex-wrap items-center gap-1.5">
              {crumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  {c.to ? (
                    <Link to={c.to} className="hover:text-primary transition-colors">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-[#C7CBCE]">{c.label}</span>
                  )}
                  {i < crumbs.length - 1 && <ChevronRight className="h-3 w-3 text-[#333]" />}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="mt-4 font-display text-4xl font-black text-white sm:text-5xl lg:text-6xl font-orbitron tracking-wide">
            {title}
          </h1>
          {subtitle && <p className="mt-4 max-w-2xl text-[#C7CBCE] text-sm md:text-lg font-outfit font-bold">{subtitle}</p>}
        </div>
        {rightElement && (
          <div className="flex-shrink-0 mt-2 md:mt-0 mb-1">
            {rightElement}
          </div>
        )}
      </div>
    </section>
  );
}

