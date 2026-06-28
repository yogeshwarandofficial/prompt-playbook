import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Award, MapPin, Briefcase, ArrowRight } from "lucide-react";
import { DOMAINS, type DomainKey } from "@/data/content";
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

// Light-mode domain palette
const DOMAIN_TEXT_COLORS: Record<DomainKey, string> = {
  web:       "#3B82F6",
  cloud:     "#D97706",
  app:       "#059669",
  ai:        "#7C3AED",
  marketing: "#E11D48",
};

const DOMAIN_KEY_COLORS: Record<DomainKey, string> = {
  web:       "rgba(59,  130, 246, 0.10)",
  cloud:     "rgba(217, 119,   6, 0.10)",
  app:       "rgba(5,   150, 105, 0.10)",
  ai:        "rgba(124,  58, 237, 0.10)",
  marketing: "rgba(225,  29,  72, 0.10)",
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

      {/* Trust badges */}
      <section className="container-page mt-8 mb-10">
        <div className="flex flex-wrap gap-3">
          {[
            { Icon: MapPin, label: "100% Remote" },
            { Icon: Award, label: "Verifiable Certificate" },
            { Icon: Briefcase, label: "Professional Mentorship" },
          ].map(({ Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-xl border border-[#800000]/15 bg-[#800000]/5 px-4 py-2 text-[#800000] font-orbitron shadow-sm text-xs font-semibold"
            >
              <Icon className="h-4 w-4" /> {label}
            </span>
          ))}
        </div>
      </section>

      {/* Internship cards */}
      <section className="container-page pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((d) => (
            <article
              key={d.key}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#800000]/20 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(128,0,0,0.08)] transition-all duration-300 ease-out text-left group"
            >
              <div className="space-y-4">
                {/* Domain icon */}
                <span
                  className="grid h-14 w-14 place-items-center rounded-2xl text-2xl"
                  style={{
                    background: DOMAIN_KEY_COLORS[d.key],
                    color: DOMAIN_TEXT_COLORS[d.key],
                    border: `1px solid ${DOMAIN_TEXT_COLORS[d.key]}30`,
                  }}
                >
                  {d.icon}
                </span>
                <h2 className="font-display text-xl font-bold text-slate-800 font-orbitron group-hover:text-[#800000] transition-colors">
                  {d.name}
                </h2>
                <p className="text-sm text-slate-500 font-outfit leading-relaxed line-clamp-3">{d.description}</p>

                {/* Skills */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-orbitron">Skills Required</p>
                  <div className="flex flex-wrap gap-1.5">
                    {d.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-500 font-orbitron"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-5">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-orbitron">
                  <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-slate-500 font-semibold">4–8 WEEKS</span>
                  <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-slate-500 font-semibold">REMOTE</span>
                  <span className="rounded-full bg-[#800000]/8 border border-[#800000]/15 px-2.5 py-1 text-[#800000] font-semibold">CERTIFICATE ✓</span>
                </div>
                <button
                  type="button"
                  onClick={() => openFor(d.key)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#800000] px-4 py-3 text-sm font-bold text-white shadow-[0_4px_15px_rgba(128,0,0,0.20)] transition-all hover:bg-[#6B0000] hover:shadow-[0_4px_20px_rgba(128,0,0,0.30)] hover:scale-[1.02] active:scale-[0.98] font-orbitron"
                >
                  Apply Now <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <ApplicationModal open={open} onClose={() => setOpen(false)} defaultDomain={defaultDomain} />
    </>
  );
}
