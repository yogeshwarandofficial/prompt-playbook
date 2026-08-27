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

// Vibrant domain palette
const DOMAIN_COLORS: Record<DomainKey, string> = {
  web:       "#3B82F6",
  cloud:     "#F59E0B",
  app:       "#10B981",
  ai:        "#8B5CF6",
  marketing: "#F43F5E",
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
        <div className="flex flex-wrap gap-4">
          {[
            { Icon: MapPin, label: "100% Remote" },
            { Icon: Award, label: "Verifiable Certificate" },
            { Icon: Briefcase, label: "Professional Mentorship" },
          ].map(({ Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-xl border border-black bg-white px-4 py-2.5 text-slate-700 shadow-sm text-xs font-semibold uppercase tracking-wider"
            >
              <Icon className="h-4 w-4 text-slate-500" /> {label}
            </span>
          ))}
        </div>
      </section>

      {/* Internship cards */}
      <section className="container-page pb-24">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((d) => (
              <article
                key={d.key}
                className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300 ease-out text-left group relative overflow-hidden"
              >
                <div
                  className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-slate-100"
                >
                  <img 
                    src={`/ui_${d.key}.png`} 
                    alt={d.name} 
                    className="absolute inset-0 w-full h-full object-cover scale-[1.35] transition-transform duration-500 group-hover:scale-[1.45]" 
                  />
                </div>
                
                <div className="flex flex-col flex-1 p-5 sm:p-6 relative z-10 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 transition-colors group-hover:text-black">
                      {d.name}
                    </h3>
                    <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-sm">
                      {d.description}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2 font-orbitron">
                      Skills Required
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                    {d.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-slate-100 mt-auto space-y-4 px-5 pb-5 sm:px-6 sm:pb-6">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-1">4–8 WEEKS</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">REMOTE</span>
                  <span className="rounded-full bg-emerald-50 text-emerald-600 px-3 py-1">CERTIFICATE ✓</span>
                </div>
                <button
                  type="button"
                  onClick={() => openFor(d.key)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all"
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
