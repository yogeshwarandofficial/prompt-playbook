import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mail, Phone, MapPin, Clock, Loader2, CheckCircle2 } from "lucide-react";
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
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSent(true);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
        title="Let's talk"
        subtitle="Questions, collaborations, or feedback — we'd love to hear from you."
      />
      <section className="container-page py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-surface p-6 sm:p-8" noValidate>
            <h2 className="font-display text-xl font-bold">Send us a message</h2>
            <p className="mt-1 text-sm text-muted-foreground">We typically reply within 24 hours.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
              <textarea id="message" name="message" rows={5} required maxLength={1000} className={inp(errs.message)} placeholder="Tell us more…" />
            </CField>
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-md gradient-hero px-5 py-3 text-sm font-semibold text-white shadow-brand transition-transform hover:-translate-y-0.5 disabled:opacity-70"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Sending…" : "Send Message"}
            </button>
            {sent && (
              <p className="mt-4 inline-flex items-center gap-2 text-sm text-[color:var(--color-success)]">
                <CheckCircle2 className="h-4 w-4" /> Thanks — your message has been sent.
              </p>
            )}
          </form>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="font-display text-base font-semibold">Contact information</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <Info Icon={Mail} label="hello@infynuxacademy.com" />
                <Info Icon={Phone} label="+91 90000 00000" />
                <Info Icon={MapPin} label="Bengaluru, Karnataka, India" />
                <Info Icon={Clock} label="Mon–Fri · 9AM – 6PM IST" />
              </ul>
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted">
              <div
                className="h-full w-full gradient-soft grid place-items-center text-sm text-muted-foreground"
                aria-label="Map placeholder"
              >
                <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> Map preview</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="container-page max-w-3xl pb-20">
        <h2 className="mb-6 font-display text-2xl font-bold text-center">Quick answers</h2>
        <Accordion items={FAQS.slice(0, 6)} />
      </section>
    </>
  );
}

function Info({ Icon, label }: { Icon: typeof Mail; label: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span>{label}</span>
    </li>
  );
}

function CField({ label, id, err, children }: { label: string; id: string; err?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <div className="mt-1.5">{children}</div>
      {err && <p className="mt-1 text-xs text-destructive">{err}</p>}
    </div>
  );
}

function inp(err?: string) {
  return cn(
    "w-full rounded-md border bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring",
    err ? "border-destructive" : "border-input",
  );
}
