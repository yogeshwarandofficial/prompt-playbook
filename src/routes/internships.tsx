import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Award, MapPin, Briefcase, ArrowRight, HelpCircle, ChevronDown, BookOpen } from "lucide-react";
import { PageHeader } from "./roadmaps";
import { ApplicationModal } from "@/components/site/ApplicationModal";
import { createSeoHead, getBreadcrumbSchema, getInternshipProgramSchema, getFaqSchema } from "@/lib/seo";
import { JsonLd } from "@/components/site/JsonLd";
import { type DomainKey } from "@/data/content";

export const Route = createFileRoute("/internships")({
  head: () =>
    createSeoHead({
      title: "Remote Tech Internships for Students & Freshers | Infynux Academy",
      description:
        "Apply for remote tech internships in Web Development, Cloud AWS, App Development, AI & Automation, and Digital Marketing. Build portfolio projects with mentorship and verifiable certificates.",
      path: "/internships",
    }),
  component: InternshipsPage,
});

const DEFAULT_INTERNSHIPS = [
  {
    id: "web-dev",
    key: "web" as DomainKey,
    name: "Web Development Internship",
    description: "Build full-stack web applications using React, TypeScript, Node.js, and databases with weekly guidance and milestone reviews.",
    skills: ["React", "JavaScript", "HTML/CSS", "Node.js", "Git", "REST APIs"],
    duration: "1–3 Months",
    image: "/ui_web.png",
    roadmapSlug: "full-stack-web-development",
  },
  {
    id: "cloud-aws",
    key: "cloud" as DomainKey,
    name: "Cloud AWS Internship",
    description: "Design and deploy scalable cloud infrastructure using AWS core services, IAM, S3, EC2, and serverless architectures.",
    skills: ["AWS", "EC2", "S3", "Lambda", "IAM", "CloudWatch"],
    duration: "1–3 Months",
    image: "/ui_cloud.png",
    roadmapSlug: "cloud-aws",
  },
  {
    id: "app-dev",
    key: "app" as DomainKey,
    name: "App Development Internship",
    description: "Develop cross-platform and native mobile apps with Flutter and Kotlin, implementing real-time features and responsive UI.",
    skills: ["Flutter", "Dart", "Kotlin", "Firebase", "REST APIs"],
    duration: "1–3 Months",
    image: "/ui_app.png",
    roadmapSlug: "app-development",
  },
  {
    id: "ai-automation",
    key: "ai" as DomainKey,
    name: "AI & Automation Internship",
    description: "Work on artificial intelligence applications, workflow automation with Python, LLM integrations, and modern AI pipelines.",
    skills: ["Python", "LangChain", "OpenAI API", "Workflow Automation", "Data Handling"],
    duration: "1–3 Months",
    image: "/ui_ai.png",
    roadmapSlug: "ai-automation",
  },
  {
    id: "digital-marketing",
    key: "marketing" as DomainKey,
    name: "Digital Marketing Internship",
    description: "Execute data-driven digital marketing campaigns, on-page and technical SEO, content strategies, and social media growth.",
    skills: ["SEO", "Google Analytics 4", "Meta Ads", "Content Strategy", "Email Marketing"],
    duration: "1–2 Months",
    image: "/ui_marketing.png",
    roadmapSlug: "digital-marketing",
  },
  {
    id: "video-editing",
    key: "video" as DomainKey,
    name: "Video Editing & Production Internship",
    description: "Create compelling visual stories, master Premiere Pro and DaVinci Resolve, color grading, and dynamic social content.",
    skills: ["Premiere Pro", "DaVinci Resolve", "After Effects", "Color Grading", "Audio Mixing"],
    duration: "1–2 Months",
    image: "/ui_video.png",
    roadmapSlug: "video-editing",
  },
];

const INTERNSHIP_FAQS = [
  {
    q: "Who is eligible to apply for Infynux Academy internships?",
    a: "College students, fresh graduates, and self-taught developers across India and worldwide seeking structured practical experience and project mentorship are welcome to apply.",
  },
  {
    q: "Are the internships completely remote?",
    a: "Yes, all internships at Infynux Academy are 100% remote. Tasks, milestones, and feedback are managed online, allowing learners to participate flexibly alongside their college schedule.",
  },
  {
    q: "Will I receive a completion certificate?",
    a: "Yes. Upon completing your assigned milestones and submitting your final project review, you will receive a verifiable digital certificate with a unique certificate ID.",
  },
  {
    q: "Is there any registration or participation fee?",
    a: "No. Infynux Academy provides open educational resources and project opportunities to support student learning and career growth.",
  },
];

function InternshipsPage() {
  const [open, setOpen] = useState(false);
  const [defaultDomain, setDefaultDomain] = useState<string | undefined>();
  const [courses, setCourses] = useState<any[]>(DEFAULT_INTERNSHIPS);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    // Fetch active courses from the Academy database
    const fetchCourses = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/courses`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCourses(data);
          }
        }
      } catch (err) {
        // Safe fallback already initialized with DEFAULT_INTERNSHIPS
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

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Internships", path: "/internships" },
  ]);

  const programSchema = getInternshipProgramSchema();
  const faqSchema = getFaqSchema(INTERNSHIP_FAQS);

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={programSchema} />
      <JsonLd schema={faqSchema} />

      <PageHeader
        crumbs={[{ label: "Home", to: "/" }, { label: "Internships" }]}
        title="Remote Tech Internships for Students & Freshers"
        subtitle="Real experience. Real projects. Verifiable certificate. Work on guided industry-standard tasks from anywhere in India."
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
            { Icon: MapPin, label: "100% Remote in India & Worldwide" },
            { Icon: Award, label: "Verifiable Digital Certificate" },
            { Icon: Briefcase, label: "Practical Project Experience" },
          ].map(({ Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-700 shadow-sm text-xs font-semibold uppercase tracking-wider"
            >
              <Icon className="h-4 w-4 text-indigo-600" /> {label}
            </span>
          ))}
        </div>
      </section>

      {/* Internship cards */}
      <section className="container-page pb-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {courses.map((course) => (
            <article
              key={course.id || course.key}
              className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300 ease-out text-left group relative overflow-hidden"
            >
              <div
                className="relative w-full overflow-hidden border-b border-slate-100"
                style={{ height: '320px' }}
              >
                <img 
                  src={course.image || `/ui_${course.key}.png`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/ui_web.png';
                  }}
                  alt={`${course.name} opportunity at Infynux Academy`} 
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105" 
                  width="600"
                  height="320"
                  loading="lazy"
                />
              </div>
              
              <div className="flex flex-col flex-1 p-5 sm:p-6 relative z-10 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 transition-colors group-hover:text-black">
                    {course.name}
                  </h2>
                  <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-sm">
                    {course.description}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2 font-orbitron">
                    Skills Required & Covered
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {course.skills && course.skills.map((s: string) => (
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
                  <span className="rounded-full bg-slate-100 px-3 py-1">100% REMOTE</span>
                  <span className="rounded-full bg-emerald-50 text-emerald-600 px-3 py-1">CERTIFICATE ✓</span>
                </div>
                <button
                  type="button"
                  onClick={() => openFor(course.name)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all"
                  aria-label={`Apply for ${course.name}`}
                >
                  Apply for {course.name} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Preparation Cross-Links (Topic Cluster Linking) */}
      <section className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="container-page max-w-4xl text-center">
          <span className="inline-block rounded-full bg-indigo-50 border border-indigo-200 px-4 py-1 text-xs font-bold text-indigo-700 uppercase tracking-widest mb-4">
            Prepare Before You Apply
          </span>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
            Want to Sharpen Your Skills First?
          </h2>
          <p className="mt-4 text-slate-600 text-base max-w-2xl mx-auto leading-relaxed">
            Follow our beginner-friendly roadmaps and step-by-step coding tutorials to gain the foundational skills you need before starting your internship projects.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/roadmaps"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-all shadow-sm"
            >
              Explore Free Roadmaps <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/tutorials"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <BookOpen className="h-4 w-4 text-slate-500" /> Browse Tutorials
            </Link>
          </div>
        </div>
      </section>

      {/* Internship FAQs */}
      <section className="container-page py-20 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Frequently Asked Questions About Internships
          </h2>
          <p className="mt-3 text-slate-600 text-sm">
            Everything you need to know about eligibility, duration, remote workflow, and certificate issuance.
          </p>
        </div>
        <div className="space-y-4">
          {INTERNSHIP_FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                aria-expanded={openFaq === idx}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                    openFaq === idx ? "rotate-180 text-indigo-600" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <ApplicationModal open={open} onClose={() => setOpen(false)} defaultDomain={defaultDomain} />
    </>
  );
}
