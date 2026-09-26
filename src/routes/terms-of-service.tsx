import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, FileCheck, CheckCircle2, ShieldAlert, Award, HelpCircle } from "lucide-react";
import { createSeoHead, getBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/site/JsonLd";

export const Route = createFileRoute("/terms-of-service")({
  head: () =>
    createSeoHead({
      title: "Terms of Service | Infynux Academy",
      description:
        "Review the official Terms of Service of Infynux Academy. Read our guidelines on accessing free roadmaps, tutorials, internship applications, and verifiable credentials.",
      path: "/terms-of-service",
    }),
  component: TermsOfServicePage,
});

export function TermsOfServicePage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Terms of Service", path: "/terms-of-service" },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      {/* Header */}
      <section className="bg-white pt-32 pb-12 border-b border-slate-100 shadow-sm relative z-10">
        <div className="container-page text-left">
          <nav aria-label="Breadcrumb" className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
              </li>
              <ChevronRight className="h-3 w-3 text-slate-300" />
              <li className="text-slate-600">Terms of Service</li>
            </ol>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-100 uppercase tracking-wider">
              <FileCheck className="h-3.5 w-3.5" /> Legal Agreement
            </span>
            <span className="text-xs text-slate-400 font-mono">Effective: March 2026</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight leading-tight">
            Terms of Service
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600 text-lg leading-relaxed">
            Welcome to Infynux Academy. By accessing our platform, learning roadmaps, coding tutorials, and internship programs, you agree to comply with the terms set forth below.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-page py-16 text-left max-w-4xl mx-auto space-y-12">
        <div className="prose prose-slate max-w-none space-y-8 font-sans">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-indigo-600" /> 1. Free Educational Access
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Infynux Academy provides open, free access to developer roadmaps, technical tutorials, and educational curriculum. You are granted a personal, non-exclusive, non-transferable license to learn, implement code examples, and build project prototypes for personal and educational growth.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Redistributing, selling, or commercializing our curated curriculum verbatim without attribution is strictly prohibited.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="h-6 w-6 text-indigo-600" /> 2. Internship Program & Certification
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Participation in our remote internship program is subject to review and availability:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Application Integrity:</strong> Applicants must provide accurate academic, identity, and contact information. False credentials disqualify applicants immediately.</li>
              <li><strong>Completion Criteria:</strong> Certificates of completion are awarded solely upon satisfactory submission of assigned milestones, code reviews, and project demonstrations.</li>
              <li><strong>Cryptographic Verification:</strong> Every issued certificate includes a unique verification token recorded in our public verification database. Tampering with certificates invalidates credential status.</li>
              <li><strong>No Employment Guarantee:</strong> While internships provide authentic industry portfolio experience and mentorship, participation does not constitute a guaranteed offer of full-time employment unless explicitly contracted.</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-indigo-600" /> 3. Code of Conduct & Acceptable Use
            </h2>
            <p className="text-slate-600 leading-relaxed">
              All students, community members, and interns agree to maintain a respectful and productive professional environment:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Do not upload malicious code, reverse-engineer proprietary portal features, or abuse API endpoints.</li>
              <li>Maintain academic honesty — plagiarism or submitting uncredited third-party code as your original internship project is grounds for dismissal.</li>
              <li>Treat mentors, peers, and client stakeholders with professional respect across WhatsApp, Discord, or email channels.</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-indigo-600" /> 4. Disclaimers & Governing Law
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Educational materials are provided on an "as-is" basis. Infynux Academy continually updates tutorials to reflect current software versions, but cannot warrant that third-party APIs, libraries, or tools will remain unchanged indefinitely.
            </p>
            <p className="text-slate-600 leading-relaxed">
              These terms are governed by the laws of India. For questions or contractual inquiries, contact:
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-sm space-y-2">
              <p><strong>Entity:</strong> Infynux Academy / Infynux Solutions</p>
              <p><strong>Support Email:</strong> <a href="mailto:support@infynuxsolutions.in" className="text-indigo-600 font-semibold underline">support@infynuxsolutions.in</a></p>
              <p><strong>Phone:</strong> +91 70108 50923</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
