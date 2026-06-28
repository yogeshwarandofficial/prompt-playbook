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
  web:       "rgba(59,  130, 246, 0.12)",
  cloud:     "rgba(217, 119,   6, 0.12)",
  app:       "rgba(5,   150, 105, 0.12)",
  ai:        "rgba(124,  58, 237, 0.12)",
  marketing: "rgba(225,  29,  72, 0.12)",
};

const DOMAIN_TEXT_COLORS: Record<DomainKey, string> = {
  web:       "#3B82F6",
  cloud:     "#D97706",
  app:       "#059669",
  ai:        "#7C3AED",
  marketing: "#E11D48",
};

export function DomainBadge({ domain }: { domain: DomainKey }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-orbitron"
      style={{
        color: DOMAIN_TEXT_COLORS[domain],
        background: DOMAIN_KEY_COLORS[domain],
        border: `1px solid ${DOMAIN_TEXT_COLORS[domain]}33`,
      }}
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
      className="relative overflow-hidden pb-16 pt-20 md:pb-24 md:pt-28 bg-gradient-to-br from-[#F8F6F4] via-white to-[#fdf0f0]"
      aria-label="Hero"
    >
      {/* Decorative maroon gradient orb */}
      <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/4 translate-x-1/4 rounded-full bg-[#800000]/6 blur-[100px]" />

      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Text column */}
        <div className="max-w-xl animate-fade-up text-left space-y-7">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#800000]/20 bg-[#800000]/6 px-3.5 py-1.5 text-xs font-semibold text-[#800000] font-orbitron tracking-wider">
            <Zap className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            FREE ACADEMIC PLATFORM
          </span>
          <h1 className="font-display text-4xl font-black leading-[1.1] text-slate-900 sm:text-5xl lg:text-6xl tracking-tight">
            LEARN.<br />
            <span className="bg-gradient-to-r from-[#800000] via-[#C41E3A] to-[#FF6B6B] bg-clip-text text-transparent">BUILD.</span><br />
            GET HIRED.
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 font-outfit">
            Free structured roadmaps, hands-on tutorials, and real remote internships. Bridge the gap between university and industrial excellence.
          </p>
          <div className="flex flex-wrap gap-4 pt-1">
            <Link
              to="/roadmaps"
              className="inline-flex items-center gap-2 rounded-xl bg-[#800000] px-6 py-3.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(128,0,0,0.25)] transition-all hover:bg-[#6B0000] hover:shadow-[0_4px_28px_rgba(128,0,0,0.35)] hover:scale-[1.02] active:scale-[0.98] font-orbitron"
            >
              Explore Roadmaps <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/internships"
              className="inline-flex items-center gap-2 rounded-xl border border-[#800000]/20 bg-white px-6 py-3.5 text-sm font-bold text-[#800000] shadow-sm transition-all hover:border-[#800000]/40 hover:bg-[#800000]/5 hover:scale-[1.02] font-orbitron"
            >
              Apply for Internship
            </Link>
          </div>

          {/* Trust bar */}
          <div className="flex flex-wrap items-center gap-8 border-t border-slate-200 pt-8">
            {[
              { icon: Users, value: "1,000+", label: "Students Trained" },
              { icon: BookOpen, value: "5", label: "Specializations" },
              { icon: Award, value: "100%", label: "Free Tuition" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#800000]/8 border border-[#800000]/12 text-[#800000]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="block text-sm font-black text-slate-900 font-orbitron">{value}</span>
                  <span className="block text-xs text-slate-500 font-outfit">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero illustration card */}
        <div className="hidden items-center justify-center lg:flex">
          <div className="animate-float relative w-96">
            <div className="relative rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-xl p-8 shadow-[0_8px_40px_rgba(128,0,0,0.08)]">
              <div className="mb-6 flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-[#800000] to-[#C41E3A] text-white shadow-[0_4px_15px_rgba(128,0,0,0.25)]">
                  <Code2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="h-3 w-32 rounded bg-[#800000]/15" />
                  <div className="mt-2 h-2.5 w-20 rounded bg-slate-200" />
                </div>
              </div>
              <div className="space-y-4">
                {(["web", "cloud", "ai"] as DomainKey[]).map((key, i) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${80 - i * 15}%`, backgroundColor: DOMAIN_TEXT_COLORS[key] }}
                      />
                    </div>
                    <span className="text-xs font-semibold font-orbitron" style={{ color: DOMAIN_TEXT_COLORS[key] }}>
                      {DOMAIN_NAME_MAP[key]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl bg-[#800000]/5 border border-[#800000]/10 p-4">
                <div className="flex justify-between text-xs text-slate-500 font-outfit">
                  <span>Academy Average Progress</span>
                  <span className="font-semibold text-[#800000]">84%</span>
                </div>
                <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-[#800000] to-[#C41E3A] shadow-sm" />
                </div>
              </div>
            </div>
            <div className="absolute -left-10 -top-4 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 font-orbitron">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                VERIFIED CREDENTIALS
              </div>
            </div>
            <div className="absolute -bottom-4 -right-8 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 font-orbitron">
                <Globe className="h-4 w-4 text-[#800000]" aria-hidden="true" />
                <span>100% ONLINE</span>
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
    <section className="py-20 md:py-28 bg-white" aria-labelledby="features-heading">
      <div className="container-page">
        <SectionHeader
          eyebrow="Why Infynux"
          title="Engineered for career launch"
          subtitle="A premium learning ecosystem built to transfer you from raw skills to corporate hires."
          id="features-heading"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="glass rounded-2xl p-6 hover:bg-white/90 hover:-translate-y-1 hover:border-[#800000]/15 hover:shadow-[0_8px_30px_rgba(128,0,0,0.08)] transition-all duration-300 ease-out group"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#800000]/8 border border-[#800000]/12 text-[#800000] group-hover:bg-[#800000] group-hover:text-white group-hover:shadow-[0_4px_15px_rgba(128,0,0,0.25)] transition-all duration-300">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-display text-base font-bold text-slate-800 font-orbitron">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 font-outfit">{desc}</p>
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
};

function DomainsSection() {
  const tutorialCounts = TUTORIALS.reduce<Record<string, number>>((acc, t) => {
    acc[t.domain] = (acc[t.domain] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className="py-20 md:py-28 bg-[#F8F6F4]" aria-labelledby="domains-heading">
      <div className="container-page">
        <SectionHeader
          eyebrow="Popular Domains"
          title="Choose your learning path"
          subtitle="Explore five in-demand disciplines with structured roadmaps tuned for immediate application."
          id="domains-heading"
        />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {DOMAINS.map((domain) => (
            <Link
              key={domain.key}
              to="/roadmaps"
              className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-center hover:border-[#800000]/20 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(128,0,0,0.08)] transition-all duration-300 ease-out group"
            >
              <div
                className="grid h-12 w-12 place-items-center rounded-xl transition-all duration-300"
                style={{
                  background: DOMAIN_KEY_COLORS[domain.key],
                  color: DOMAIN_TEXT_COLORS[domain.key],
                }}
                aria-hidden="true"
              >
                {DOMAIN_ICONS[domain.key]}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800 font-orbitron group-hover:text-[#800000] transition-colors">{domain.name}</p>
                <p className="text-xs text-slate-400 font-outfit">{tutorialCounts[domain.key] || 0} tutorials</p>
              </div>
            </Link>
          ))}
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
    <section className="py-20 md:py-28 bg-white" aria-labelledby="process-heading">
      <div className="container-page">
        <SectionHeader
          eyebrow="The Pipeline"
          title="How it works"
          subtitle="Your four-stage pathway from basic syntax to verified engineering credentials."
          id="process-heading"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ n, title, desc }, i) => (
            <div key={n} className="relative group">
              {i < STEPS.length - 1 && (
                <div
                  className="absolute left-full top-10 z-0 hidden h-[1px] w-full -translate-y-px lg:block bg-gradient-to-r from-[#800000]/30 to-transparent"
                  aria-hidden="true"
                />
              )}
              <div className="relative z-10 glass rounded-2xl p-6 hover:bg-white/95 hover:shadow-[0_8px_30px_rgba(128,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                <span className="font-display text-3xl font-black bg-gradient-to-r from-[#800000] to-[#C41E3A] bg-clip-text text-transparent font-orbitron">
                  {n}
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-slate-800 font-orbitron">{title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed font-outfit">{desc}</p>
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
    <section className="py-20 md:py-28 bg-[#F8F6F4]" aria-labelledby="roadmaps-heading">
      <div className="container-page">
        <SectionHeader
          eyebrow="Featured Roadmaps"
          title="Start learning the right way"
          subtitle="Tuned progression charts designed to take you from a curious beginner to a productive engineer."
          id="roadmaps-heading"
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ROADMAPS.slice(0, 3).map((r) => (
            <div
              key={r.slug}
              className="glass overflow-hidden rounded-2xl flex flex-col justify-between hover:bg-white/95 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(128,0,0,0.08)] transition-all duration-300 ease-out"
              style={{ borderTop: `3px solid ${DOMAIN_TEXT_COLORS[r.domain]}` }}
            >
              <div className="p-6 space-y-4">
                <DomainBadge domain={r.domain} />
                <h3 className="font-display text-lg font-bold text-slate-800 font-orbitron">{r.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500 font-outfit line-clamp-2">{r.description}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-orbitron">
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5">{r.difficulty}</span>
                  <span>{r.duration}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50">
                <Link to="/roadmaps" className="text-sm font-semibold text-[#800000] hover:text-[#6B0000] transition-colors font-orbitron tracking-wider">
                  View Roadmap →
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/roadmaps"
            className="inline-flex items-center gap-2 rounded-xl border border-[#800000]/20 bg-white px-6 py-3 text-sm font-semibold text-[#800000] transition-all hover:bg-[#800000] hover:text-white hover:shadow-[0_4px_20px_rgba(128,0,0,0.2)] font-orbitron"
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
    <section className="py-20 md:py-28 bg-white" aria-labelledby="tutorials-heading">
      <div className="container-page">
        <SectionHeader
          eyebrow="Tutorial Sandbox"
          title="Learn by doing"
          subtitle="Explore comprehensive sandbox articles to hone your active implementation skills."
          id="tutorials-heading"
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TUTORIALS.slice(0, 4).map((t) => (
            <Link
              key={t.slug}
              to="/tutorials/$slug"
              params={{ slug: t.slug }}
              className="group glass flex flex-col overflow-hidden rounded-2xl hover:bg-white/95 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(128,0,0,0.08)] transition-all duration-300 ease-out"
            >
              <div
                className="aspect-[16/9] w-full relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${DOMAIN_TEXT_COLORS[t.domain]}22 0%, ${DOMAIN_TEXT_COLORS[t.domain]}06 100%)`,
                }}
                aria-hidden="true"
              >
                <div className="absolute inset-0 grid place-items-center">
                  <div
                    className="h-12 w-12 rounded-xl grid place-items-center"
                    style={{ background: DOMAIN_KEY_COLORS[t.domain], color: DOMAIN_TEXT_COLORS[t.domain] }}
                  >
                    <BookOpen className="h-6 w-6" />
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5 space-y-3">
                <div>
                  <DomainBadge domain={t.domain} />
                </div>
                <h3 className="font-display text-sm font-bold leading-snug line-clamp-2 text-slate-800 font-orbitron group-hover:text-[#800000] transition-colors">
                  {t.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-outfit line-clamp-2 flex-1">{t.description}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-orbitron pt-1">
                  <span>{t.readMinutes} min read</span>
                  <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5">{t.difficulty}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/tutorials"
            className="inline-flex items-center gap-2 rounded-xl border border-[#800000]/20 bg-white px-6 py-3 text-sm font-semibold text-[#800000] transition-all hover:bg-[#800000] hover:text-white hover:shadow-[0_4px_20px_rgba(128,0,0,0.2)] font-orbitron"
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
    <section className="py-20 md:py-28 bg-[#F8F6F4]" aria-labelledby="internship-highlight-heading">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#800000] via-[#9B0000] to-[#C41E3A] p-8 md:p-14 shadow-[0_16px_48px_rgba(128,0,0,0.25)]">
          {/* decorative orb */}
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-white/5 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-black/10 blur-[80px] pointer-events-none" />
          <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2">
            <div className="text-left space-y-5">
              <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold text-white font-orbitron tracking-wider">
                🚀 INDUSTRIAL LAUNCHPAD
              </span>
              <h2
                className="font-display text-3xl font-black text-white md:text-4xl font-orbitron leading-tight"
                id="internship-highlight-heading"
              >
                Real engineering.<br />Real credentials.
              </h2>
              <p className="text-white/75 leading-relaxed font-outfit">
                Submit an application for your selected domain. Build features, resolve live issues, and launch production-grade modules.
              </p>
              <Link
                to="/internships"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#800000] shadow-[0_4px_15px_rgba(0,0,0,0.15)] transition-all hover:bg-white/90 hover:scale-[1.02] font-orbitron"
              >
                Apply for Internship <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4">
              {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4 rounded-xl border border-white/15 bg-white/10 p-5 backdrop-blur-md hover:bg-white/15 transition-all">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/20 border border-white/20 text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white font-orbitron">{title}</p>
                    <p className="mt-1 text-xs text-white/70 font-outfit leading-relaxed">{desc}</p>
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
    <section className="py-20 md:py-28 bg-white" aria-labelledby="benefits-heading">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-left space-y-4">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#800000] font-orbitron">Academy Merits</span>
            <h2 className="font-display text-3xl font-black md:text-4xl text-slate-900 font-orbitron" id="benefits-heading">
              Everything you need,<br />zero costs.
            </h2>
            <p className="text-slate-500 leading-relaxed font-outfit">
              No subscription gates. No locked content. Infynux Academy runs on a commitment to deliver premium tech training to all.
            </p>
          </div>
          <ul className="grid gap-3.5 sm:grid-cols-2" role="list">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left hover:border-[#800000]/20 hover:bg-white transition-all">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#800000]" aria-hidden="true" />
                <span className="text-sm text-slate-600 font-outfit">{benefit}</span>
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
    <section className="py-20 md:py-28 bg-[#F8F6F4]" aria-labelledby="testimonials-heading">
      <div className="container-page">
        <SectionHeader
          eyebrow="Student Reviews"
          title="Validated by our cohort"
          subtitle="Real testimonials from students who successfully launched their tech careers."
          id="testimonials-heading"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="flex flex-col justify-between glass rounded-2xl p-6 hover:bg-white/95 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(128,0,0,0.07)] transition-all duration-300">
              <div className="space-y-4 text-left">
                <div className="flex gap-0.5" aria-label={`${t.stars} out of 5 stars`}>
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-sm italic leading-relaxed text-slate-600 font-outfit">"{t.quote}"</p>
              </div>
              <div className="mt-6 flex items-center gap-3.5 pt-4 border-t border-slate-100">
                <div
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-bold text-white font-orbitron"
                  style={{ background: "linear-gradient(135deg, #800000 0%, #C41E3A 100%)" }}
                  aria-hidden="true"
                >
                  {t.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800 font-orbitron">{t.name}</p>
                  <p className="text-[11px] text-slate-400 font-outfit">{t.college}</p>
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
    <section className="py-20 md:py-28 bg-white" aria-labelledby="faq-heading">
      <div className="container-page max-w-3xl">
        <SectionHeader
          eyebrow="Support"
          title="Frequently asked questions"
          subtitle="Everything you need to know to get started."
          id="faq-heading"
        />
        <dl className="mt-12 space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-xl border transition-all duration-200 ${
                openIdx === i
                  ? "border-[#800000]/20 bg-[#800000]/3 shadow-sm"
                  : "border-slate-200 bg-white hover:border-[#800000]/15"
              }`}
            >
              <dt>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-semibold text-slate-800 font-orbitron"
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  aria-expanded={openIdx === i}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#800000] transition-transform duration-300 ${openIdx === i ? "rotate-180" : "rotate-0"}`}
                    aria-hidden="true"
                  />
                </button>
              </dt>
              <dd
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: openIdx === i ? "400px" : "0" }}
              >
                <p className="px-6 pb-5 text-sm leading-relaxed text-slate-500 font-outfit text-left">{faq.answer}</p>
              </dd>
            </div>
          ))}
        </dl>
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
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setState("success");
        setMsg(data.message || "You're subscribed! 🎉 We'll keep you updated.");
        setEmail("");
      } else {
        setState("error");
        setMsg(data.message || "Something went wrong.");
      }
    } catch {
      setState("error");
      setMsg("Network error. Please try again.");
    }
  };

  return (
    <section className="py-20 md:py-28 bg-[#F8F6F4]" aria-labelledby="newsletter-heading">
      <div className="container-page max-w-2xl">
        <div className="text-center rounded-3xl border border-[#800000]/12 bg-white p-8 md:p-14 shadow-[0_8px_40px_rgba(128,0,0,0.06)]">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#800000] font-orbitron">Stay Updated</span>
          <h2 className="mt-3 font-display text-3xl font-black text-slate-900 font-orbitron" id="newsletter-heading">
            Never miss an update
          </h2>
          <p className="mt-3 text-slate-500 font-outfit">
            Stay informed on newly published roadmaps, tutorials, and remote internships.
          </p>
          {state === "success" ? (
            <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-sm text-emerald-700 font-orbitron">
              {msg}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 font-outfit focus:border-[#800000] focus:outline-none focus:ring-2 focus:ring-[#800000]/15 transition-all"
              />
              <button
                type="submit"
                disabled={state === "loading"}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#800000] px-6 py-3.5 text-sm font-bold text-white shadow-[0_4px_15px_rgba(128,0,0,0.20)] hover:bg-[#6B0000] hover:shadow-[0_4px_20px_rgba(128,0,0,0.30)] transition-all disabled:opacity-60 font-orbitron whitespace-nowrap"
              >
                {state === "loading" ? (
                  <span className="flex items-center gap-1.5">
                    <span className="block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Subscribing...
                  </span>
                ) : (
                  <><Mail className="h-4 w-4" />Subscribe</>
                )}
              </button>
            </form>
          )}
          {state === "error" && (
            <p className="mt-3 text-xs text-red-500 font-orbitron" role="alert">{msg}</p>
          )}
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
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  id?: string;
}) {
  return (
    <div className="max-w-2xl text-left space-y-3 mb-10">
      <span className="text-sm font-semibold uppercase tracking-wider text-[#800000] font-orbitron">{eyebrow}</span>
      <h2 className="font-display text-3xl font-black text-slate-900 md:text-4xl font-orbitron leading-tight" id={id}>
        {title}
      </h2>
      {subtitle && <p className="text-slate-500 leading-relaxed font-outfit text-sm">{subtitle}</p>}
    </div>
  );
}
