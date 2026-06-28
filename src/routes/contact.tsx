import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mail, Phone, MapPin, Clock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { FAQS } from "@/data/content";
import { PageHeader } from "./roadmaps";
import { Accordion } from "@/components/site/Accordion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Infynux Academy" },
      { name: "description", content: "Reach out to Infynux Academy for internship queries, collaborations, or support." },
      { property: "og:title", content: "Contact Infynux Academy" },
      { property: "og:description", content: "We typically respond within 24 hours on business days." },
    ],
  }),
  component: ContactPage,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
type Errs = Partial<Record<"name" | "email" | "subject" | "message", string>>;

function ContactPage() {
  const [errs, setErrs] = useState<Errs>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const subject = String(fd.get("subject") || "").trim();
    const message = String(fd.get("message") || "").trim();
    const next: Errs = {};
    if (name.length < 2) next.name = "Enter your name.";
    if (!EMAIL_RE.test(email)) next.email = "Enter a valid email.";
    if (subject.length < 5) next.subject = "Subject must be at least 5 characters.";
    if (message.length < 20) next.message = "Message must be at least 20 characters.";
    setErrs(next);
    if (Object.keys(next).length) return;
    setSubmitting(true);
    setSent(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSent(true);
        (e.target as HTMLFormElement).reset();
      } else {
        if (data.errors) {
          setErrs(data.errors);
        } else {
          setErrs({ message: data.message || "Failed to send message. Please try again." });
        }
      }
    } catch {
      setErrs({ message: "Network error. Please check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
        title="Let's talk"
        subtitle="Questions, collaborations, or feedback — we'd love to hear from you."
      />

      <section className="container-page py-16 text-left">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm"
            noValidate
          >
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900 font-orbitron tracking-wide">
                Send us a message
              </h2>
              <p className="text-sm text-slate-500 font-outfit mt-1">We typically reply within 24 hours.</p>
            </div>

            {errs.message && !errs.name && !errs.email && !errs.subject && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-600 font-orbitron" role="alert">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {errs.message}
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <CField label="Full Name" id="name" err={errs.name}>
                <input id="name" name="name" type="text" required className={inp(errs.name)} placeholder="Your name" />
              </CField>
              <CField label="Email Address" id="email" err={errs.email}>
                <input id="email" name="email" type="email" required className={inp(errs.email)} placeholder="you@example.com" />
              </CField>
            </div>

            <CField label="Subject" id="subject" err={errs.subject}>
              <input id="subject" name="subject" type="text" required className={inp(errs.subject)} placeholder="What's this about?" />
            </CField>

            <CField label="Message" id="message" err={errs.message}>
              <textarea id="message" name="message" rows={5} required maxLength={1000} className={inp(errs.message)} placeholder="Tell us more about how we can support you…" />
            </CField>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#800000] px-6 py-3.5 text-sm font-bold text-white shadow-[0_4px_15px_rgba(128,0,0,0.20)] hover:bg-[#6B0000] hover:shadow-[0_4px_20px_rgba(128,0,0,0.30)] transition-all disabled:opacity-75 font-orbitron"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending Message...</span>
                </>
              ) : (
                <span>Send Message</span>
              )}
            </button>

            {sent && (
              <p className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-600 font-orbitron">
                <CheckCircle2 className="h-4 w-4 animate-pulse" />
                <span>Thanks! Your message has been sent successfully.</span>
              </p>
            )}
          </form>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="font-display text-lg font-bold text-slate-900 font-orbitron tracking-wide">
                Contact information
              </h3>
              <ul className="space-y-4 text-sm font-outfit" role="list">
                <Info Icon={Mail} label="support@infynuxsolutions.in" />
                <Info Icon={Phone} label="7010850923" />
                <Info Icon={MapPin} label="Thiruvarur, Tamilnadu, India" />
                <Info Icon={Clock} label="Mon–Fri · 9AM – 6PM IST" />
              </ul>
            </div>

            {/* Map */}
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 relative shadow-inner">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15668.618991750598!2d79.62372439366579!3d10.772594639912061!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a55476a6cf37d71%3A0x6b77242d54e4df5e!2sThiruvarur%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1719652504229!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Thiruvarur Location Map"
                className="absolute inset-0"
              />
            </div>
          </aside>
        </div>
      </section>

      {/* Quick FAQ */}
      <section className="container-page max-w-3xl pb-24 text-left">
        <h2 className="mb-8 font-display text-2xl font-bold text-slate-900 text-center font-orbitron tracking-wide">
          Quick Answers
        </h2>
        <Accordion items={FAQS.slice(0, 6)} />
      </section>
    </>
  );
}

function Info({ Icon, label }: { Icon: typeof Mail; label: string }) {
  return (
    <li className="flex items-center gap-3.5">
      <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#800000]/12 bg-[#800000]/6 text-[#800000] shadow-sm shrink-0">
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-slate-600 font-outfit">{label}</span>
    </li>
  );
}

function CField({ label, id, err, children }: { label: string; id: string; err?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 font-orbitron">{label}</label>
      {children}
      {err && (
        <p className="mt-1 flex items-center gap-1 text-xs text-red-500 font-orbitron" role="alert">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {err}
        </p>
      )}
    </div>
  );
}

function inp(err?: string) {
  return cn(
    "w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 font-outfit transition-all focus:outline-none focus:ring-2",
    err
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-[#800000] focus:ring-[#800000]/10"
  );
}
