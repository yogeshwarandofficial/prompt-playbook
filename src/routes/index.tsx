import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Cloud,
  Code2,
  Cpu,
  Megaphone,
  Smartphone,
  CheckCircle2,
  Star,
  ChevronDown,
  Users,
  Award,
  Zap,
  Target,
  MessageSquare,
  Briefcase,
  Globe,
  Mail,
  Video,
} from "lucide-react";
import { useState } from "react";
import {
  ROADMAPS,
  TUTORIALS,
  TESTIMONIALS,
  FAQS,
  DOMAINS,
  DOMAIN_NAME_MAP,
  type DomainKey,
} from "@/data/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Infynux Academy — Learn, Build, Get Hired" },
      {
        name: "description",
        content:
          "Free structured learning roadmaps, practical tutorials, and real remote internships in Web Dev, Cloud AWS, App Dev, AI & Automation, and Digital Marketing.",
      },
      { property: "og:title", content: "Infynux Academy — Learn, Build, Get Hired" },
      {
        property: "og:description",
        content:
          "Bridge the gap between learning and hiring with Infynux Academy's free structured roadmaps, tutorials, and internships.",
      },
    ],
  }),
  component: HomePage,
});

// Light-mode domain palette
const DOMAIN_KEY_COLORS: Record<DomainKey, string> = {
  web:       "rgba(156, 255, 59, 0.12)",
  cloud:     "rgba(182, 255, 74, 0.12)",
  app:       "rgba(217, 255, 176, 0.12)",
  ai:        "rgba(156, 255, 59, 0.12)",
  marketing: "rgba(182, 255, 74, 0.12)",
  video:     "rgba(255, 59, 156, 0.12)",
};

const DOMAIN_TEXT_COLORS: Record<DomainKey, string> = {
  web:       "#9CFF3B",
  cloud:     "#B6FF4A",
  app:       "#D9FFB0",
  ai:        "#9CFF3B",
  marketing: "#B6FF4A",
  video:     "#FF3B9C",
};

export function DomainBadge({ domain }: { domain: DomainKey }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 tracking-widest uppercase shadow-sm"
    >
      {DOMAIN_NAME_MAP[domain]}
    </span>
  );
}

function HomePage() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <FeaturesSection />
      <DomainsSection />
      <ProcessSection />
      <FeaturedRoadmapsSection />
      <FeaturedTutorialsSection />
      <InternshipHighlightsSection />
      <BenefitsSection />
      <TestimonialsSection />
      <FAQSection />
      <NewsletterSection />
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      className="relative overflow-hidden pb-32 pt-32 md:pb-40 md:pt-48 bg-white rounded-b-[40px] md:rounded-b-[80px] shadow-2xl z-10"
      aria-label="Hero"
    >
      {/* Decorative maroon gradient orb */}
      <div className="pointer-events-none absolute right-0 top-0 h-[700px] w-[700px] -translate-y-1/4 translate-x-1/4 rounded-full bg-primary/10 blur-[120px]" />

      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Text column */}
        <div className="max-w-xl animate-fade-up text-left space-y-7 relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-black font-orbitron tracking-wider">
            <Zap className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            FREE ACADEMIC PLATFORM
          </span>
          <h1 className="font-display text-5xl font-black leading-[1.05] text-black sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight">
            LEARN.<br />
            <span className="bg-[length:200%_auto] animate-text-shine bg-gradient-to-r from-emerald-500 via-primary to-emerald-500 bg-clip-text text-transparent">BUILD.</span><br />
            GET HIRED.
          </h1>
          <p className="text-lg leading-relaxed text-black font-outfit">
            Free structured roadmaps, hands-on tutorials, and real remote internships. Bridge the gap between university and industrial excellence.
          </p>
          <div className="flex flex-wrap gap-4 pt-1">
            <Link
              to="/roadmaps"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-black px-8 py-4 text-base font-black shadow-[0_4px_20px_rgba(156,255,59,0.25)] transition-all hover:bg-secondary hover:shadow-[0_4px_28px_rgba(156,255,59,0.35)] hover:scale-[1.02] active:scale-[0.98] font-orbitron"
            >
              Explore Roadmaps <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              to="/internships"
              className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-transparent px-8 py-4 text-base font-black text-black shadow-sm transition-all hover:bg-black hover:text-white hover:scale-[1.02] font-orbitron"
            >
              Apply for Internship
            </Link>
          </div>

          {/* Trust bar */}
          <div className="flex flex-wrap items-center gap-8 border-t border-black pt-8">
            {[
              { icon: Users, value: "100+", label: "Students Trained" },
              { icon: BookOpen, value: "5", label: "Specializations" },
              { icon: Award, value: "100%", label: "Free Tuition" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 border border-primary/20 text-black">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <span className="block text-sm font-black text-black font-orbitron">{value}</span>
                  <span className="block text-xs text-black/70 font-outfit">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero illustration card - Natural integration */}
        <div className="flex relative items-center justify-center h-full w-full mt-8 lg:mt-0">
          {/* Atmospheric Glow Behind Model */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px] mix-blend-normal" />
          
          <div className="relative w-full max-w-[550px] -translate-y-20">
            {/* The model image using true transparent PNG */}
            <img 
              src="/female-professional-laptop.png" 
              alt="Professional Model" 
              className="w-full h-auto object-contain relative z-10"
            />
            
            {/* Subtle decorative elements matching theme */}
            <div className="absolute top-12 -left-6 text-primary animate-pulse z-0">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
                <path d="M12 6v12M6 12h12" />
              </svg>
            </div>
            
            {/* Floating 10 Years Experience Badge */}
            <div className="absolute right-4 md:right-0 bottom-10 md:bottom-24 md:translate-x-8 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-md px-5 py-4 shadow-lg animate-float z-20">
              <div className="flex items-center gap-1 mb-1 justify-end">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-black font-orbitron">2+ Years</p>
                <span className="block text-xs text-black/70 font-outfit">Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES ─────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: BookOpen, title: "Structured Roadmaps", desc: "Follow expert-curated paths from beginner to job-ready, designed for immediate industry deployment." },
  { icon: Code2, title: "Free Tutorials", desc: "Step-by-step documentation, code snippets, and deployment guides at zero cost." },
  { icon: Briefcase, title: "Real Internships", desc: "Work on live commercial applications with local clients, backed by professional guidance." },
  { icon: Award, title: "Verified Certificates", desc: "Secure a shareable digital certificate to instantly boost your CV and LinkedIn profiles." },
  { icon: MessageSquare, title: "Mentor Support", desc: "Clear roadblocks quickly with direct lines of communication to professional mentors." },
  { icon: Target, title: "Career Outcomes", desc: "Dedicated preparation focusing on technical portfolios, resume parsing, and mockup trials." },
];

function FeaturesSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-[#0A0A0A]" aria-labelledby="features-heading">
      {/* Background glow and dust could go here, but using subtle radial gradient */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
      
      {/* Peeking man blending from top right edge of screen */}
      <img 
        src="/peeking_man.png" 
        alt="" 
        className="absolute top-0 right-0 w-64 md:w-96 lg:w-[500px] object-contain hidden md:block opacity-60 mix-blend-screen pointer-events-none [mask-image:radial-gradient(ellipse_at_top_right,black_40%,transparent_70%)] z-0"
        aria-hidden="true" 
      />
      
      <div className="container-page relative z-10">
        <div className="mb-14 relative">
          <div className="flex items-center gap-2.5 mb-6 text-primary text-sm font-bold uppercase tracking-[0.2em] font-display">
            <div className="h-[3px] w-[32px] bg-primary"></div>
            Why Infynux
          </div>
          <h2 id="features-heading" className="font-display font-black text-4xl md:text-5xl lg:text-7xl leading-[1.05] text-white max-w-3xl mb-6 tracking-tight">
            Everything you need, <span className="text-primary">floating in one place.</span>
          </h2>
          <p className="text-[#C7CBCE] text-xl font-bold leading-relaxed max-w-xl font-outfit">
            A premium learning ecosystem built to transfer you from raw skills to corporate hires.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }, idx) => (
            <div
              key={title}
              className="group relative bg-[#0A0A0A] border-2 border-[#333] rounded-[24px] p-10 pb-9 transition-all duration-300 hover:border-primary hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(156,255,59,0.15)]"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(156,255,59,0.3)]">
                <Icon className="h-7 w-7 text-black" aria-hidden="true" />
              </div>
              <h3 className="font-display text-2xl font-black text-white mb-3 tracking-tight">{title}</h3>
              <p className="text-base font-bold leading-[1.7] text-[#C7CBCE] font-outfit">{desc}</p>
              
              {/* Hover shadow pulse */}
              <div className="absolute left-1/2 bottom-[-20px] h-[24px] w-[80%] -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
                   style={{ background: 'radial-gradient(ellipse, rgba(156,255,59,0.4) 0%, rgba(156,255,59,0) 72%)' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── DOMAINS ──────────────────────────────────────────────────────────────────
const DOMAIN_ICONS: Record<DomainKey, React.ReactNode> = {
  web:       <Code2 className="h-6 w-6" />,
  cloud:     <Cloud className="h-6 w-6" />,
  app:       <Smartphone className="h-6 w-6" />,
  ai:        <Cpu className="h-6 w-6" />,
  marketing: <Megaphone className="h-6 w-6" />,
  video:     <Video className="h-6 w-6" />,
};

function DomainsSection() {
  const tutorialCounts = TUTORIALS.reduce<Record<string, number>>((acc, t) => {
    acc[t.domain] = (acc[t.domain] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-[#F9FAF5]" aria-labelledby="domains-heading">
      {/* Animated Mesh Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-[120px] mix-blend-multiply opacity-70" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-300/20 rounded-full blur-[120px] mix-blend-multiply opacity-50" />
      
      {/* Top right image moved here to allow mix-blend-multiply to work against the section background */}
      <img 
        src="/path.jpg" 
        alt="Learning Path" 
        className="hidden lg:block absolute right-0 lg:right-[5%] top-24 w-72 lg:w-80 xl:w-96 object-contain mix-blend-multiply opacity-90 pointer-events-none"
        aria-hidden="true"
      />

      <div className="container-page relative z-10">
        <div className="flex justify-between items-start">
          <SectionHeader
            eyebrow="Popular Domains"
            title="Choose your learning path"
            subtitle="Explore five in-demand disciplines with structured roadmaps tuned for immediate application."
            id="domains-heading"
            theme="light"
          />
        </div>
        <div className="mt-16 relative">
          {/* The "Real Rope" connecting the cards (only visible on large screens) */}
          <div className="absolute top-[75px] left-[-20px] right-[-20px] hidden lg:flex items-center pointer-events-none z-0">
             {/* Left stick and loop */}
             <div className="relative shrink-0 flex items-center justify-center -mr-2 z-10">
                <div className="w-5 h-16 bg-gradient-to-b from-[#8b5a2b] via-[#5c3a21] to-[#3e2723] rounded-sm border-2 border-[#2b1810] shadow-[3px_3px_5px_rgba(0,0,0,0.4)] z-20" />
                <div className="absolute left-2 w-10 h-10 border-[6px] rounded-full z-10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" style={{ borderColor: '#d4a373 #8b5a2b #5c3a21 #faedcd' }} />
             </div>

             {/* Rope body */}
             <div className="flex-1 h-6 shadow-[0_6px_10px_rgba(0,0,0,0.15)] z-0"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(-45deg, #d4a373 0px, #d4a373 6px, #8b5a2b 6px, #8b5a2b 10px, #faedcd 10px, #faedcd 14px, #5c3a21 14px, #5c3a21 18px)',
                    borderTop: '2px solid #2b1810',
                    borderBottom: '2px solid #2b1810',
                  }}
             />

             {/* Right stick and loop */}
             <div className="relative shrink-0 flex items-center justify-center -ml-2 z-10">
                <div className="absolute right-2 w-10 h-10 border-[6px] rounded-full z-10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" style={{ borderColor: '#5c3a21 #faedcd #d4a373 #8b5a2b' }} />
                <div className="w-5 h-16 bg-gradient-to-b from-[#8b5a2b] via-[#5c3a21] to-[#3e2723] rounded-sm border-2 border-[#2b1810] shadow-[3px_3px_5px_rgba(0,0,0,0.4)] z-20" />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 relative z-10">
            {DOMAINS.filter(d => d.key !== 'video').map((domain) => (
              <Link
                key={domain.key}
                to="/roadmaps"
                className="flex flex-col items-center gap-4 rounded-3xl border-2 border-black bg-[#F4F7EB]/70 backdrop-blur-xl p-6 md:p-10 text-center hover:bg-[#F4F7EB]/90 hover:scale-[1.05] hover:shadow-[0_20px_50px_rgba(143,204,30,0.2)] hover:border-black transition-all duration-300 ease-out group relative"
              >
                <div
                  className="grid h-20 w-20 place-items-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:-translate-y-2 bg-primary border-2 border-black text-black relative z-10"
                  aria-hidden="true"
                >
                  <div className="scale-150">{DOMAIN_ICONS[domain.key]}</div>
                </div>
                <div className="space-y-2 mt-4 relative z-10">
                  <p className="text-xl font-black text-black font-orbitron leading-none">100+</p>
                  <p className="text-2xl font-black text-black font-orbitron tracking-tight">{domain.name}</p>
                  <p className="text-sm font-bold text-black font-outfit uppercase tracking-widest">{tutorialCounts[domain.key] || 0} tutorials</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PROCESS ──────────────────────────────────────────────────────────────────
const STEPS = [
  { n: "01", title: "Choose Domain", desc: "Select a core engineering discipline matching your career vision." },
  { n: "02", title: "Study Roadmap", desc: "Navigate the step-by-step structured knowledge paths." },
  { n: "03", title: "Build Projects", desc: "Acquire real-world logic patterns via sandbox tutorials." },
  { n: "04", title: "Intern & Certify", desc: "Secure a remote internship and land verified credentials." },
];

function ProcessSection() {
  return (
    <section className="py-24 md:py-32 bg-black relative overflow-hidden" aria-labelledby="process-heading">
      {/* Heavy maximalist glow behind the section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-[100%] blur-[120px] pointer-events-none" />
      
      <div className="container-page relative z-10">
        <SectionHeader
          eyebrow="The Pipeline"
          title="How it works"
          subtitle="Your four-stage pathway from basic syntax to verified engineering credentials."
          id="process-heading"
        />
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 relative">
          {/* Jumping character animation (only visible on large screens where steps are in a row) */}
          <div className="animate-jump-process hidden lg:flex items-center justify-center text-4xl" aria-hidden="true">
             <img src="/running_man_transparent.png" alt="running man" className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(198,255,61,0.8)] pointer-events-none" />
          </div>

          {STEPS.map(({ n, title, desc }, i) => (
            <div key={n} className="relative group">
              {i < STEPS.length - 1 && (
                <div
                  className="absolute left-[80%] top-16 z-0 hidden h-[2px] w-full -translate-y-px lg:block bg-gradient-to-r from-primary/50 to-transparent shadow-[0_0_10px_rgba(156,255,59,0.5)]"
                  aria-hidden="true"
                />
              )}
              <div className="relative z-10 border border-[#232323] bg-[#0A0A0A] rounded-[32px] p-8 hover:border-primary hover:shadow-[0_0_30px_rgba(156,255,59,0.15)] hover:-translate-y-2 transition-all duration-500">
                <span className="block font-display text-6xl lg:text-7xl font-black bg-gradient-to-b from-primary to-primary/20 bg-clip-text text-transparent font-orbitron mb-6 drop-shadow-[0_0_15px_rgba(156,255,59,0.3)]">
                  {n}
                </span>
                <h3 className="font-display text-xl font-bold text-white font-orbitron">{title}</h3>
                <p className="mt-3 text-sm text-[#C7CBCE] leading-relaxed font-outfit">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FEATURED ROADMAPS ────────────────────────────────────────────────────────
function FeaturedRoadmapsSection() {
  return (
    <section className="py-24 md:py-32 bg-[#F9FAF5] relative overflow-hidden" aria-labelledby="roadmaps-heading">
      {/* Top right illustration */}
      <img 
        src="/study_illustration.png" 
        alt="" 
        className="hidden lg:block absolute right-0 lg:right-[5%] top-12 w-72 lg:w-96 object-contain opacity-80 mix-blend-multiply pointer-events-none"
        aria-hidden="true"
      />
      <div className="container-page relative z-10">
        <SectionHeader
          eyebrow="Featured Roadmaps"
          title="Start learning the right way"
          subtitle="Tuned progression charts designed to take you from a curious beginner to a productive engineer."
          id="roadmaps-heading"
          theme="light"
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ROADMAPS.slice(0, 3).map((r) => (
            <div
              key={r.slug}
              className="bg-white border border-slate-200/60 rounded-[1.5rem] flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 ease-out group"
            >
              <div className="p-8 pb-0 space-y-5 flex-1">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-blue-50/50 px-3 py-1 text-[10px] font-bold text-blue-600 border border-blue-100/50 tracking-widest uppercase">
                    {DOMAIN_NAME_MAP[r.domain]}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight tracking-tight">
                  {r.title}
                </h3>
                
                <p className="text-sm font-medium leading-relaxed text-slate-500">
                  {r.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="rounded-full bg-slate-50 border border-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {r.difficulty}
                  </span>
                  <span className="rounded-full bg-slate-50 border border-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {r.duration}
                  </span>
                </div>
              </div>
              
              <div className="p-8 pt-8 mt-auto">
                <Link to="/roadmaps" className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 transition-colors tracking-widest uppercase group-hover:text-blue-700">
                  View Roadmap <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center">
            <Link
              to="/roadmaps"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all tracking-wide"
            >
            View All Roadmaps <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── FEATURED TUTORIALS ───────────────────────────────────────────────────────
function FeaturedTutorialsSection() {
  return (
    <section className="py-24 md:py-32 bg-black relative overflow-hidden" aria-labelledby="tutorials-heading">
      {/* Decorative image blending from top right edge of screen */}
      <img 
        src="/code_ui.png" 
        alt="" 
        className="absolute top-0 right-0 w-72 md:w-[450px] lg:w-[600px] object-contain hidden md:block opacity-40 mix-blend-screen grayscale contrast-125 pointer-events-none [mask-image:radial-gradient(ellipse_at_top_right,black_40%,transparent_80%)] z-0"
        aria-hidden="true" 
      />

      <div className="container-page relative z-10">
        <SectionHeader
          eyebrow="Tutorial Sandbox"
          title="Learn by doing"
          subtitle="Explore comprehensive sandbox articles to hone your active implementation skills."
          id="tutorials-heading"
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TUTORIALS.slice(0, 4).map((t) => (
            <Link
              key={t.slug}
              to="/tutorials/$slug"
              params={{ slug: t.slug }}
              className="group bg-[#0a0a0a] border border-white/10 flex flex-col overflow-hidden rounded-[1.5rem] hover:border-white/20 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 ease-out"
            >
              <div
                className="aspect-[16/9] w-full relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${DOMAIN_TEXT_COLORS[t.domain]}11 0%, ${DOMAIN_TEXT_COLORS[t.domain]}00 100%)`,
                }}
                aria-hidden="true"
              >
                <div className="absolute inset-0 grid place-items-center">
                  <div
                    className="h-14 w-14 rounded-[12px] grid place-items-center shadow-lg transition-transform duration-500 group-hover:scale-110"
                    style={{ background: DOMAIN_KEY_COLORS[t.domain], color: DOMAIN_TEXT_COLORS[t.domain] }}
                  >
                    <BookOpen className="h-6 w-6" />
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6 space-y-4">
                <div>
                  <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-white border border-white/10 tracking-widest uppercase">
                    {DOMAIN_NAME_MAP[t.domain]}
                  </span>
                </div>
                <h3 className="text-xl font-bold leading-tight line-clamp-2 text-white group-hover:text-blue-400 transition-colors tracking-tight">
                  {t.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 flex-1">{t.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{t.readMinutes} min read</span>
                  <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.difficulty}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link
            to="/tutorials"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all tracking-wide"
          >
            Browse All Tutorials <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── INTERNSHIP HIGHLIGHTS ────────────────────────────────────────────────────
const HIGHLIGHTS = [
  { icon: Globe, title: "100% Remote Operations", desc: "Collaborate directly on remote infrastructures from any region in India." },
  { icon: Award, title: "Verifiable Certification", desc: "Gain certificates validated by the Infynux Academy board." },
  { icon: Code2, title: "Real Production Codebase", desc: "Publish pull requests to real customer apps, bypassing sandbox restrictions." },
];

function InternshipHighlightsSection() {
  return (
    <section className="py-24 md:py-32 bg-[#F9FAF5] overflow-hidden relative" aria-labelledby="internship-highlight-heading">
      <div className="container-page relative z-10">
        <div className="relative overflow-hidden rounded-[40px] bg-[#F4F7EB] border border-[#222] p-6 md:p-16 lg:p-20 shadow-[0_20px_80px_rgba(0,0,0,0.1)] group transition-all duration-700 hover:shadow-[0_30px_100px_rgba(143,204,30,0.2)] hover:border-black">
          <div className="relative z-10 grid items-center gap-16 lg:grid-cols-2">
            <div className="text-left space-y-5">
              <span className="inline-block rounded-full border border-[#222] bg-[#F9FAF5] px-3.5 py-1 text-xs font-semibold text-black font-orbitron tracking-wider">
                INDUSTRIAL LAUNCHPAD
              </span>
              <h2
                className="font-display text-4xl md:text-5xl lg:text-7xl font-black text-black font-orbitron leading-[1.1] tracking-tight drop-shadow-sm"
                id="internship-highlight-heading"
              >
                Real engineering.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-lime-500">Real credentials.</span>
              </h2>
              <p className="text-black leading-relaxed font-outfit">
                Submit an application for your selected domain. Build features, resolve live issues, and launch production-grade modules.
              </p>
              <Link
                to="/internships"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-black shadow-[0_4px_15px_rgba(156,255,59,0.3)] transition-all hover:bg-lime-400 hover:scale-[1.02] font-orbitron"
              >
                Apply for Internship <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6">
              {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-5 rounded-2xl border border-[#222] bg-[#F9FAF5] p-6 hover:border-black hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary border border-[#222] text-black shadow-[0_4px_15px_rgba(156,255,59,0.3)]">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="text-left">
                    <p className="text-base font-bold text-black font-orbitron">{title}</p>
                    <p className="mt-1.5 text-sm text-black font-outfit leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── BENEFITS ─────────────────────────────────────────────────────────────────
const BENEFITS = [
  "100% free access. No premium filters.",
  "Clear progression roadmaps from zero to active builder.",
  "Commercial development experience on live codebases.",
  "Cryptographically verifiable credentials.",
  "A tangible portfolio to show hiring teams.",
  "Dedicated direct support channels with mentors.",
  "Mock interviews and CV architecture support.",
  "Join a network of India's top tech builders.",
];

function BenefitsSection() {
  return (
    <section className="py-24 md:py-32 bg-white" aria-labelledby="benefits-heading">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-left space-y-4 relative">
            <img src="/zerocost.png" alt="0% Cost" className="w-40 h-auto md:w-56 mb-6 object-contain mix-blend-multiply contrast-125 brightness-110" />
            <span className="block text-sm font-semibold uppercase tracking-widest text-primary font-display">Academy Merits</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight font-orbitron" id="benefits-heading">
              Everything you need,<br />zero costs.
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg max-w-md">
              No subscription gates. No locked content. Infynux Academy runs on a commitment to deliver premium tech training to all.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2" role="list">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" aria-hidden="true" />
                <span className="text-base font-semibold text-slate-800 leading-snug">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 bg-black" aria-labelledby="testimonials-heading">
      <div className="container-page">
        <SectionHeader
          eyebrow="Student Reviews"
          title="Validated by our cohort"
          subtitle="Real testimonials from students who successfully launched their tech careers."
          id="testimonials-heading"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="flex flex-col justify-between bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 hover:bg-white/5 hover:-translate-y-1 hover:border-white/20 transition-all duration-300">
              <div className="space-y-5 text-left">
                <div className="flex gap-1" aria-label={`${t.stars} out of 5 stars`}>
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-lg font-medium leading-relaxed text-slate-300 tracking-tight">"{t.quote}"</p>
              </div>
              <div className="mt-8 flex items-center gap-4 pt-6 border-t border-white/10">
                <div
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-bold text-white bg-red-600 shadow-sm"
                  aria-hidden="true"
                >
                  {t.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div className="text-left">
                  <p className="text-base font-bold text-white tracking-tight">{t.name}</p>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{t.college}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section className="py-24 md:py-32 bg-white" aria-labelledby="faq-heading">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-2 items-start">
          <div className="sticky top-24 space-y-8">
            <SectionHeader
              eyebrow="Support"
              title="Frequently asked questions"
              subtitle="Everything you need to know to get started."
              id="faq-heading"
              theme="light"
              align="left"
            />
            <div className="hidden lg:block relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 p-8">
              <img 
                src="/man_asking_question.png" 
                alt="Man asking a question"
                className="w-full h-full object-contain mix-blend-multiply opacity-80"
              />
            </div>
          </div>
          <dl className="space-y-4">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                openIdx === i
                  ? "border-indigo-100 bg-indigo-50/30 shadow-md scale-[1.01]"
                  : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm"
              }`}
            >
              <dt>
                <button
                  type="button"
                  className={`flex w-full items-center justify-between gap-6 px-8 py-6 text-left text-lg md:text-xl font-bold transition-colors tracking-tight ${openIdx === i ? "text-indigo-600" : "text-slate-800"}`}
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  aria-expanded={openIdx === i}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${openIdx === i ? "rotate-180 text-indigo-500" : "rotate-0"}`}
                    aria-hidden="true"
                  />
                </button>
              </dt>
              <dd
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: openIdx === i ? "600px" : "0" }}
              >
                <p className={`px-8 pb-8 text-base leading-relaxed text-left ${openIdx === i ? "text-slate-600" : "text-slate-500"}`}>{faq.answer}</p>
              </dd>
            </div>
          ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

// ─── NEWSLETTER ───────────────────────────────────────────────────────────────
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) { setMsg("Please enter a valid email."); setState("error"); return; }
    setState("loading");
    // Mock success message for now until the real API is implemented
    setTimeout(() => {
      setState("success");
      setMsg("You're subscribed! 🎉 We'll keep you updated.");
      setEmail("");
    }, 800);
  };

  return (
    <section className="py-24 md:py-32 bg-[#F9FAF5]" aria-labelledby="newsletter-heading">
      <div className="container-page max-w-4xl relative">
        {/* The peering man image positioned behind the card */}
        <div className="flex justify-center -mb-[180px] md:-mb-[220px] relative z-0">
          <img src="/peering_man_transparent.png" alt="Man holding card" className="w-[450px] md:w-[650px] object-contain drop-shadow-xl pointer-events-none opacity-90" />
        </div>
        
        <div className="text-center rounded-[40px] border-4 border-[#222] bg-[#0A0A0A] p-12 md:p-20 shadow-[0_30px_80px_rgba(0,0,0,0.15)] relative overflow-hidden z-10 mt-10">
          {/* Maximalist glow behind the form */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary font-orbitron">Stay Updated</span>
            <h2 className="mt-4 font-display text-5xl md:text-6xl lg:text-7xl font-black text-white font-orbitron tracking-tight" id="newsletter-heading">
              Never miss an update
            </h2>
            <p className="mt-6 text-[#C7CBCE] font-outfit text-xl font-bold">
              Stay informed on newly published roadmaps, tutorials, and remote internships.
            </p>
            {state === "success" ? (
              <div className="mt-10 rounded-2xl border-2 border-emerald-400 bg-emerald-500/10 px-8 py-6 text-lg font-black text-emerald-400 font-orbitron backdrop-blur-md">
                {msg}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-4">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 rounded-2xl border-2 border-[#333] bg-[#111] px-8 py-6 text-lg font-bold text-white placeholder:text-[#C7CBCE]/50 font-outfit focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                />
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-primary text-black px-10 py-6 text-lg font-black shadow-[0_4px_30px_rgba(156,255,59,0.3)] hover:bg-lime-400 hover:shadow-[0_8px_40px_rgba(156,255,59,0.4)] transition-all disabled:opacity-60 font-orbitron whitespace-nowrap"
                >
                  {state === "loading" ? (
                    <span className="flex items-center gap-2">
                      <span className="block h-5 w-5 animate-spin rounded-full border-4 border-black border-t-transparent" />
                      Subscribing...
                    </span>
                  ) : (
                    <><Mail className="h-6 w-6" />Subscribe</>
                  )}
                </button>
              </form>
            )}
          {state === "error" && (
            <p className="mt-3 text-xs text-red-500 font-orbitron" role="alert">{msg}</p>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Shared: SectionHeader ────────────────────────────────────────────────────
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  id,
  theme = "dark"
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  id?: string;
  theme?: "light" | "dark";
}) {
  return (
    <div className="max-w-2xl text-left space-y-3 mb-10 relative z-10">
      <span className="text-sm font-semibold uppercase tracking-wider text-primary font-orbitron">{eyebrow}</span>
      <h2 className={`font-display text-5xl font-black md:text-6xl lg:text-7xl font-orbitron leading-[1.1] tracking-tight drop-shadow-sm ${theme === 'dark' ? 'text-white' : 'text-black'}`} id={id}>
        {title}
      </h2>
      {subtitle && <p className={`leading-relaxed font-outfit text-sm ${theme === 'dark' ? 'text-[#C7CBCE]' : 'text-black'}`}>{subtitle}</p>}
    </div>
  );
}
