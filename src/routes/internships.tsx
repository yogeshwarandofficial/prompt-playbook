import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Award, MapPin, Briefcase, ArrowRight } from "lucide-react";
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
  video: "Video Editing",
};

// Vibrant domain palette
const DOMAIN_COLORS: Record<DomainKey, string> = {
  web:       "#3B82F6",
  cloud:     "#F59E0B",
  app:       "#10B981",
  ai:        "#8B5CF6",
  marketing: "#F43F5E",
  video:     "#E11D48",
};

function InternshipsPage() {
  const [open, setOpen] = useState(false);
  const [defaultDomain, setDefaultDomain] = useState<string | undefined>();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch active courses from the Academy database
    const fetchCourses = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/courses`);
        console.log("Fetch courses response status:", res.status);
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched courses data:", data);
          setCourses(data);
        } else {
          console.error("Fetch not ok. Status:", res.status, "Text:", await res.text());
        }
      } catch (err) {
        console.error("Failed to fetch courses (Exception):", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  const openFor = (courseName?: string) => {
    setDefaultDomain(courseName);
    setOpen(true);
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", to: "/" }, { label: "Internships" }]}
        title="Internships"
        subtitle="Real experience. Real projects. Real certificate."
        rightElement={
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all"
          >
            Login
          </Link>
        }
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
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {courses.map((course) => (
              <article
                key={course.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300 ease-out text-left group relative overflow-hidden"
              >
                <div
                  className="relative w-full overflow-hidden border-b border-slate-100"
                  style={{ height: '320px' }}
                >
                  <img 
                    src={course.image || `/ui_${course.key}.png`}
                    onError={(e) => {
                      // Safe fallback if the image path doesn't exist
                      (e.target as HTMLImageElement).src = '/ui_web.png';
                    }}
                    alt={course.name} 
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105" 
                  />
                </div>
                
                <div className="flex flex-col flex-1 p-5 sm:p-6 relative z-10 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 transition-colors group-hover:text-black">
                      {course.name}
                    </h3>
                    <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-sm">
                      {course.description}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2 font-orbitron">
                      Skills Required
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                    {course.skills.map((s: string) => (
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
                  <span className="rounded-full bg-slate-100 px-3 py-1 uppercase">{course.duration}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">REMOTE</span>
                  <span className="rounded-full bg-emerald-50 text-emerald-600 px-3 py-1">CERTIFICATE ✓</span>
                </div>
                <button
                  type="button"
                  onClick={() => openFor(course.name)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  Apply Now <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
        )}
      </section>

      <ApplicationModal open={open} onClose={() => setOpen(false)} defaultDomain={defaultDomain} />
    </>
  );
}
