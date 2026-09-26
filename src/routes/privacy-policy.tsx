import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Shield, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";
import { createSeoHead, getBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/site/JsonLd";

export const Route = createFileRoute("/privacy-policy")({
  head: () =>
    createSeoHead({
      title: "Privacy Policy | Infynux Academy",
      description:
        "Read the official Privacy Policy of Infynux Academy. Learn how we handle student data, internship applications, and website analytics with integrity and security.",
      path: "/privacy-policy",
    }),
  component: PrivacyPolicyPage,
});

export function PrivacyPolicyPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy-policy" },
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
              <li className="text-slate-600">Privacy Policy</li>
            </ol>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-100 uppercase tracking-wider">
              <Shield className="h-3.5 w-3.5" /> Trust & Compliance
            </span>
            <span className="text-xs text-slate-400 font-mono">Last Updated: March 2026</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight leading-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600 text-lg leading-relaxed">
            Your privacy and confidence are paramount to Infynux Academy. This policy explains how we collect, store, and safeguard your data when you access our roadmaps, tutorials, and remote internships.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-page py-16 text-left max-w-4xl mx-auto space-y-12">
        <div className="prose prose-slate max-w-none space-y-8 font-sans">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Eye className="h-6 w-6 text-indigo-600" /> 1. Information We Collect
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Infynux Academy collects information that you provide voluntarily when using our educational services, applying for internships, or contacting our team:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Contact Information:</strong> Full name, email address, phone number, and city/region provided via contact and newsletter forms.</li>
              <li><strong>Internship Applications:</strong> Academic details, college/university name, degree, branch, graduation year, GitHub profile, LinkedIn URL, and domain preference.</li>
              <li><strong>Usage & Technical Data:</strong> Browser type, operating system, pages visited, referral sources, and IP addresses collected via privacy-focused analytics to improve site performance.</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Lock className="h-6 w-6 text-indigo-600" /> 2. How We Use Your Information
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We process your data strictly for genuine educational and operational purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Reviewing and processing remote tech internship applications.</li>
              <li>Delivering learning materials, roadmap updates, and tutorial notifications.</li>
              <li>Issuing and cryptographically verifying completion certificates.</li>
              <li>Responding to support requests, student inquiries, and technical questions.</li>
              <li>Monitoring platform stability, eliminating spam, and enhancing user experience.</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-6 w-6 text-indigo-600" /> 3. Data Protection & Sharing Policy
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We uphold strict data ethics:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>No Sale of Personal Data:</strong> We never sell, rent, or trade your personal information to third-party advertisers or data brokers.</li>
              <li><strong>Industry Partner Sharing:</strong> For enrolled internship participants, your verified portfolio projects and resume details may only be shared with verified hiring partners with your explicit consent.</li>
              <li><strong>Security Standards:</strong> We enforce HTTPS transmission across all endpoints, encrypted storage, and least-privilege administrative access.</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-indigo-600" /> 4. Your Rights & Contact Details
            </h2>
            <p className="text-slate-600 leading-relaxed">
              You retain full rights to request access to your submitted data, request corrections, or ask for deletion of your application records at any time.
            </p>
            <p className="text-slate-600 leading-relaxed">
              If you have any questions or privacy concerns, please contact our Data Governance team:
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-sm space-y-2">
              <p><strong>Entity:</strong> Infynux Academy / Infynux Solutions</p>
              <p><strong>Email:</strong> <a href="mailto:support@infynuxsolutions.in" className="text-indigo-600 font-semibold underline">support@infynuxsolutions.in</a></p>
              <p><strong>Phone:</strong> +91 70108 50923</p>
              <p><strong>Location:</strong> India (Remote-first)</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
