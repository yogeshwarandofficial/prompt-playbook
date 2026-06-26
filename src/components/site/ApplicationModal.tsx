import { useEffect, useRef, useState, type FormEvent } from "react";
import { X, CheckCircle2, Loader2, Upload, FileText } from "lucide-react";
import { SUBDOMAIN_GROUPS } from "@/data/content";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultDomain?: string;
}

type FieldErrors = Partial<Record<
  "fullName" | "email" | "mobile" | "college" | "subdomain" | "agreement" | "file",
  string
>>;

const NAME_RE = /^[A-Za-z\u00C0-\u017F'\- ]{2,100}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MOBILE_RE = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;

export function ApplicationModal({ open, onClose, defaultDomain }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => firstFieldRef.current?.focus(), 50);
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setSuccess(false);
      setErrors({});
      setFile(null);
    }
  }, [open, defaultDomain]);

  if (!open) return null;

  const validateFile = (f: File | null): string | undefined => {
    if (!f) return undefined;
    const ok = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!ok.includes(f.type) && !/\.(pdf|docx?|)$/i.test(f.name)) {
      return "Only PDF, DOC, or DOCX files are accepted.";
    }
    if (f.size > 5 * 1024 * 1024) return "File size must be under 5MB.";
    return undefined;
  };

  const onFileChange = (f: File | null) => {
    const err = validateFile(f);
    setErrors((e) => ({ ...e, file: err }));
    if (!err) setFile(f);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("fullName") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const mobile = String(fd.get("mobile") || "").trim();
    const college = String(fd.get("college") || "").trim();
    const subdomain = String(fd.get("subdomain") || "");
    const agreement = fd.get("agreement") === "on";

    const next: FieldErrors = {};
    if (!NAME_RE.test(fullName)) next.fullName = "Enter your full name (letters only, 2–100 chars).";
    if (!EMAIL_RE.test(email) || email.length > 254) next.email = "Enter a valid email address.";
    if (!MOBILE_RE.test(mobile)) next.mobile = "Enter a valid 10-digit Indian mobile number.";
    if (college.length < 3 || college.length > 150) next.college = "Enter your school or college (3–150 chars).";
    if (!subdomain) next.subdomain = "Please choose an internship domain.";
    if (!agreement) next.agreement = "You must agree to continue.";
    const fileErr = validateFile(file);
    if (fileErr) next.file = fileErr;

    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    // Simulated submission — no backend.
    await new Promise((r) => setTimeout(r, 1100));
    setSubmitting(false);
    setSuccess(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-title"
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        className="relative w-full sm:max-w-xl rounded-t-2xl sm:rounded-2xl bg-surface shadow-xl max-h-[92vh] overflow-y-auto"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-surface px-6 py-4">
          <div>
            <h2 id="apply-title" className="font-display text-xl font-bold">
              Internship Application
            </h2>
            <p className="text-sm text-muted-foreground">Fill in the details below to apply</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="px-6 py-10 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[oklch(0.66_0.15_165_/_0.15)] text-[color:var(--color-success)] animate-fade-up">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold">Application Submitted!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We've received your application. We'll reach out within 2–3 business days.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 inline-flex items-center justify-center rounded-md gradient-hero px-5 py-2.5 text-sm font-semibold text-white shadow-brand"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4" noValidate>
            <Field label="Full Name" error={errors.fullName} htmlFor="fullName">
              <input
                ref={firstFieldRef}
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                className={inputCls(errors.fullName)}
                placeholder="Aarav Sharma"
                aria-describedby={errors.fullName ? "fullName-err" : undefined}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email Address" error={errors.email} htmlFor="email">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={inputCls(errors.email)}
                  placeholder="you@example.com"
                  aria-describedby={errors.email ? "email-err" : undefined}
                />
              </Field>
              <Field label="Mobile Number" error={errors.mobile} htmlFor="mobile">
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  autoComplete="tel"
                  required
                  className={inputCls(errors.mobile)}
                  placeholder="9876543210"
                  aria-describedby={errors.mobile ? "mobile-err" : undefined}
                />
              </Field>
            </div>
            <Field label="School / College Name" error={errors.college} htmlFor="college">
              <input
                id="college"
                name="college"
                type="text"
                required
                className={inputCls(errors.college)}
                placeholder="e.g. IIT Madras"
                aria-describedby={errors.college ? "college-err" : undefined}
              />
            </Field>
            <Field label="Internship Domain" error={errors.subdomain} htmlFor="subdomain">
              <select
                id="subdomain"
                name="subdomain"
                required
                defaultValue={defaultDomain || ""}
                className={inputCls(errors.subdomain)}
                aria-describedby={errors.subdomain ? "subdomain-err" : undefined}
              >
                <option value="" disabled>Select a domain…</option>
                {SUBDOMAIN_GROUPS.map((g) => (
                  <optgroup key={g.label} label={g.label}>
                    {g.options.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </Field>
            <Field label="Additional Message" htmlFor="message" hint="Optional · max 500 chars">
              <textarea
                id="message"
                name="message"
                rows={3}
                maxLength={500}
                className={inputCls()}
                placeholder="Tell us a bit about yourself…"
              />
            </Field>

            <div>
              <span className="block text-sm font-medium">Resume <span className="text-muted-foreground font-normal">(optional · PDF/DOC/DOCX, max 5MB)</span></span>
              <label
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  const f = e.dataTransfer.files?.[0] || null;
                  onFileChange(f);
                }}
                className={cn(
                  "mt-1.5 flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-6 text-center transition-colors",
                  dragging ? "border-primary bg-primary/5" : "border-input hover:border-primary/60",
                  errors.file && "border-destructive",
                )}
              >
                {file ? (
                  <span className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-primary" />
                    {file.name} <span className="text-muted-foreground">({(file.size / 1024).toFixed(0)} KB)</span>
                  </span>
                ) : (
                  <span className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
                    <Upload className="h-5 w-5" />
                    Drop your resume here, or click to browse
                  </span>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="sr-only"
                  onChange={(e) => onFileChange(e.target.files?.[0] || null)}
                />
              </label>
              {file && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="mt-2 text-xs text-muted-foreground underline hover:text-foreground"
                >
                  Remove file
                </button>
              )}
              {errors.file && <p className="mt-1 text-xs text-destructive">{errors.file}</p>}
            </div>

            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" name="agreement" className="mt-1 h-4 w-4 accent-[color:var(--color-primary)]" />
              <span className="text-muted-foreground">
                I agree to the <a href="#" className="text-primary underline">Terms</a> and{" "}
                <a href="#" className="text-primary underline">Privacy Policy</a>.
              </span>
            </label>
            {errors.agreement && <p className="-mt-2 text-xs text-destructive">{errors.agreement}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md gradient-hero px-5 py-3 text-sm font-semibold text-white shadow-brand transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Submitting…" : "Submit Application"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label, error, htmlFor, hint, children,
}: {
  label: string; error?: string; htmlFor: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={htmlFor} className="text-sm font-medium">{label}</label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      <div className="mt-1.5">{children}</div>
      {error && <p id={`${htmlFor}-err`} className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function inputCls(err?: string) {
  return cn(
    "w-full rounded-md border bg-surface px-3 py-2.5 text-sm transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring",
    err ? "border-destructive" : "border-input",
  );
}
