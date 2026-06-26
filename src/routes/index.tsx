import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, BookOpen, Award, Users, Compass, Sparkles, ShieldCheck,
  CheckCircle2, Star, Rocket,
} from "lucide-react";
import { DOMAINS, ROADMAPS, TUTORIALS, TESTIMONIALS, FAQS, DOMAIN_COLORS } from "@/data/content";
import { Accordion } from "@/components/site/Accordion";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Infynux Academy — Learn, Build, Get Hired" },
      { name: "description", content: "Free learning roadmaps, tutorials, and remote internships in Web Dev, Cloud, App Dev, AI, and Digital Marketing." },
      { property: "og:title", content: "Infynux Academy — Learn, Build, Get Hired" },
      { property: "og:description", content: "Structured learning paths and real internship opportunities for students and freshers." },
    ],
  }),
  component: Home,
});

const FEATURES = [
  { Icon: Compass, title: "Structured Roadmaps", text: "Beginner-to-advanced paths for every domain we teach." },
  { Icon: BookOpen, title: "Free Tutorials", text: "Practical, hands-on guides with real code samples." },
  { Icon: Rocket, title: "Real Internships", text: "Apply for remote internships and ship real projects." },
  { Icon: Award, title: "Certificate on Completion", text: "Verifiable certificate to show recruiters." },
  { Icon: Users, title: "Mentor Support", text: "Weekly check-ins with experienced engineers." },
  { Icon: ShieldCheck, title: "Career Guidance", text: "Resume reviews and interview prep included." },
];

const STEPS = [
  { title: "Choose a Domain", text: "Pick the field that excites you most." },
  { title: "Follow the Roadmap", text: "Move from beginner to advanced step by step." },
  { title: "Complete Tutorials", text: "Build small projects to lock in your skills." },
  { title: "Apply for Internship", text: "Ship real work and earn a certificate." },
];

const BENEFITS = [
  "Free access to all learning resources",
  "Structured, opinionated learning paths",
  "Real-world project experience",
  "Verifiable internship certificate",
  "Portfolio-worthy projects to showcase",
  "Dedicated mentor support",
  "Resume & interview guidance",
  "Remote-first, work from anywhere",
];

function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Domains />
      <Process />
      <FeaturedRoadmaps />
      <FeaturedTutorials />
      <InternshipHighlight />
      <Benefits />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 gradient-soft" />
      <div
        aria-hidden="true"
        className="absolute -top-32 left-1/2 -z-10 h-[640px] w-[640px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="container-page pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-medium text-muted-foreground animate-fade-up">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Free Learning Platform · Built for Students
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl md:text-6xl animate-fade-up">
            Learn. Build. <span className="gradient-text">Get Hired.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg animate-fade-up">
            Free structured roadmaps, practical tutorials, and remote internships — everything you need to go from beginner to job-ready in tech.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-up">
            <Link
              to="/roadmaps"
              className="inline-flex items-center justify-center gap-2 rounded-md gradient-hero px-5 py-3 text-sm font-semibold text-white shadow-brand transition-transform hover:-translate-y-0.5"
            >
              Explore Roadmaps <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/internships"
              className="inline-flex items-center justify-center rounded-md border border-input bg-surface px-5 py-3 text-sm font-semibold hover:bg-muted"
            >
              Apply for Internship
            </Link>
          </div>
          <dl className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-6 text-center">
            {[
              ["500+", "Students"],
              ["5", "Domains"],
              ["100%", "Free"],
            ].map(([n, l]) => (
              <div key={l} className="rounded-xl border border-border bg-surface/70 p-4 backdrop-blur">
                <dt className="font-display text-2xl font-bold gradient-text">{n}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</span>
      )}
      <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function Features() {
  return (
    <section className="py-20">
      <div className="container-page">
        <SectionHeader eyebrow="Why Infynux" title="Built for students, by builders" subtitle="Everything you need to learn, ship, and land your first role." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-border bg-surface p-6 hover-lift">
              <div className="grid h-11 w-11 place-items-center rounded-xl gradient-hero text-white shadow-brand">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Domains() {
  return (
    <section className="py-20 bg-muted/40">
      <div className="container-page">
        <SectionHeader eyebrow="Popular Domains" title="Pick your path" subtitle="Five focused tracks, all with structured roadmaps and tutorials." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {DOMAINS.map((d) => (
            <Link
              key={d.key}
              to="/roadmaps"
              className="group rounded-2xl border border-border bg-surface p-5 hover-lift"
            >
              <span
                className="grid h-11 w-11 place-items-center rounded-xl text-xl"
                style={{ background: `color-mix(in oklch, ${DOMAIN_COLORS[d.key]} 18%, transparent)` }}
              >
                {d.icon}
              </span>
              <h3 className="mt-4 font-display text-base font-semibold">{d.short}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{d.tutorials} tutorials</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Explore <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="py-20">
      <div className="container-page">
        <SectionHeader eyebrow="Learning Process" title="Four simple steps" subtitle="Our funnel makes the path obvious so you don't get stuck." />
        <ol className="grid gap-5 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border border-border bg-surface p-6">
              <span className="font-display text-4xl font-extrabold gradient-text">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-base font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FeaturedRoadmaps() {
  return (
    <section className="py-20 bg-muted/40">
      <div className="container-page">
        <SectionHeader eyebrow="Roadmaps" title="Featured learning paths" />
        <div className="grid gap-5 md:grid-cols-3">
          {ROADMAPS.slice(0, 3).map((r) => (
            <article key={r.slug} className="flex flex-col rounded-2xl border border-border bg-surface p-6 hover-lift">
              <div className="flex items-center justify-between">
                <DomainBadge domain={r.domain} />
                <span className="text-xs text-muted-foreground">{r.duration}</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{r.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{r.description}</p>
              <Link
                to="/roadmaps"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary"
              >
                View roadmap <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/roadmaps" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            View all roadmaps <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedTutorials() {
  return (
    <section className="py-20">
      <div className="container-page">
        <SectionHeader eyebrow="Tutorials" title="Latest from our library" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {TUTORIALS.slice(0, 4).map((t) => (
            <Link
              key={t.slug}
              to="/tutorials"
              className="flex flex-col rounded-2xl border border-border bg-surface p-5 hover-lift"
            >
              <div
                className="mb-4 aspect-[16/9] rounded-lg"
                style={{
                  background: `linear-gradient(135deg, color-mix(in oklch, ${DOMAIN_COLORS[t.domain]} 60%, transparent), color-mix(in oklch, ${DOMAIN_COLORS[t.domain]} 25%, transparent))`,
                }}
                aria-hidden="true"
              />
              <DomainBadge domain={t.domain} />
              <h3 className="mt-3 font-display text-base font-semibold leading-snug line-clamp-2">{t.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground line-clamp-3">{t.description}</p>
              <span className="mt-3 text-xs text-muted-foreground">{t.readMinutes} min read</span>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/tutorials" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Browse all tutorials <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function InternshipHighlight() {
  return (
    <section className="py-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl gradient-hero px-8 py-14 text-white shadow-xl md:px-14 md:py-20">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
              Start Your Career With Us
            </h2>
            <p className="mt-4 text-white/85">
              Remote internships, real projects, real mentorship — and a certificate that proves it.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {["Remote Work", "Certificate", "Real Projects"].map((t) => (
                <div key={t} className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                  <p className="font-display font-semibold">{t}</p>
                </div>
              ))}
            </div>
            <Link
              to="/internships"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-primary shadow-md transition-transform hover:-translate-y-0.5"
            >
              Apply for Internship <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section className="py-20 bg-muted/40">
      <div className="container-page">
        <SectionHeader eyebrow="Student Benefits" title="Everything you get, for free" />
        <ul className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-[color:var(--color-success)]" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-20">
      <div className="container-page">
        <SectionHeader eyebrow="Testimonials" title="Loved by students across India" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-2xl border border-border bg-surface p-6">
              <div className="flex gap-0.5 text-[color:var(--color-warning)]">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 flex-1 text-sm text-foreground/85">"{t.quote}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full gradient-hero text-sm font-semibold text-white">
                  {t.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.college}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="py-20 bg-muted/40">
      <div className="container-page max-w-3xl">
        <SectionHeader eyebrow="FAQ" title="Frequently asked questions" />
        <Accordion items={FAQS} />
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section className="py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
          <h2 className="font-display text-2xl font-bold">Stay Updated</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Get notified about new tutorials and internship openings.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
              setDone(true);
            }}
            className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
          >
            <label className="sr-only" htmlFor="newsletter">Email</label>
            <input
              id="newsletter"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-md border border-input bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md gradient-hero px-5 py-2.5 text-sm font-semibold text-white shadow-brand"
            >
              Subscribe
            </button>
          </form>
          {done && (
            <p className="mt-3 text-sm text-[color:var(--color-success)]">Thanks! You're on the list.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export function DomainBadge({ domain }: { domain: keyof typeof DOMAIN_COLORS }) {
  const d = DOMAINS.find((x) => x.key === domain)!;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{
        background: `color-mix(in oklch, ${DOMAIN_COLORS[domain]} 16%, transparent)`,
        color: DOMAIN_COLORS[domain],
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: DOMAIN_COLORS[domain] }} />
      {d.short}
    </span>
  );
}
