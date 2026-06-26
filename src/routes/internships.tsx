import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Award, MapPin, Briefcase, ArrowRight } from "lucide-react";
import { DOMAINS, DOMAIN_COLORS, type DomainKey } from "@/data/content";
import { PageHeader } from "./roadmaps";
import { ApplicationModal } from "@/components/site/ApplicationModal";

export const Route = createFileRoute("/internships")({
  head: () => ({
    meta: [
      { title: "Internship Opportunities — Infynux Academy" },
      { name: "description", content: "Apply for remote internships in Web Dev, Cloud, App Dev, AI & Automation, and Digital Marketing. Get a certificate." },
      { property: "og:title", content: "Internship Opportunities — Infynux Academy" },
      { property: "og:description", content: "Remote-first internships with real projects and certificates." },
    ],
  }),
  component: InternshipsPage,
});

const DOMAIN_TO_DEFAULT: Record<DomainKey, string> = {
  web: "Full Stack Development",
  cloud: "AWS",
  app: "Flutter",
  ai: "AI & Automation",
  marketing: "Digital Marketing",
};

function InternshipsPage() {
  const [open, setOpen] = useState(false);
  const [defaultDomain, setDefaultDomain] = useState<string | undefined>();

  const openFor = (key?: DomainKey) => {
    setDefaultDomain(key ? DOMAIN_TO_DEFAULT[key] : undefined);
    setOpen(true);
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", to: "/" }, { label: "Internships" }]}
        title="Internships"
        subtitle="Real experience. Real projects. Real certificate."
      />
      <section className="container-page">
        <div className="-mt-6 mb-10 flex flex-wrap gap-3">
          {[
            { Icon: MapPin, label: "Remote" },
            { Icon: Award, label: "Certificate Provided" },
            { Icon: Briefcase, label: "Mentorship Included" },
          ].map(({ Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium shadow-sm">
              <Icon className="h-3.5 w-3.5 text-primary" /> {label}
            </span>
          ))}
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((d) => (
            <article key={d.key} className="flex flex-col rounded-2xl border border-border bg-surface p-6 hover-lift">
              <span
                className="grid h-14 w-14 place-items-center rounded-2xl text-2xl"
                style={{ background: `color-mix(in oklch, ${DOMAIN_COLORS[d.key]} 18%, transparent)` }}
              >
                {d.icon}
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold">{d.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{d.description}</p>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Skills Required</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {d.skills.map((s) => (
                    <span key={s} className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground">{s}</span>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-muted px-2.5 py-1 font-medium">4–8 Weeks</span>
                <span className="rounded-full bg-muted px-2.5 py-1 font-medium">Remote</span>
                <span className="rounded-full bg-[oklch(0.66_0.15_165_/_0.15)] px-2.5 py-1 font-medium text-[color:var(--color-success)]">Certificate ✓</span>
              </div>

              <button
                type="button"
                onClick={() => openFor(d.key)}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-md gradient-hero px-4 py-2.5 text-sm font-semibold text-white shadow-brand transition-transform hover:-translate-y-0.5"
              >
                Apply Now <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>
      </section>

      <ApplicationModal open={open} onClose={() => setOpen(false)} defaultDomain={defaultDomain} />
    </>
  );
}
