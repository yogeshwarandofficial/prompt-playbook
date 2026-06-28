import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useRef, useState, useEffect } from "react";
import { X, Upload, CheckCircle2, Loader2, AlertCircle, FileText } from "lucide-react";
import { SUBDOMAIN_GROUPS } from "@/data/content";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

type ModalState = "idle" | "loading" | "success" | "error";

interface Props {
  open: boolean;
  domain?: string;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  mobile: string;
  college: string;
  subdomain: string;
  message: string;
  agreement: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  mobile?: string;
  college?: string;
  subdomain?: string;
  message?: string;
  agreement?: string;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.fullName || data.fullName.trim().length < 2) errors.fullName = "Name must be at least 2 characters";
  else if (!/^[A-Za-z\u00C0-\u017F'\- ]{2,100}$/.test(data.fullName.trim())) errors.fullName = "Name can only contain letters, spaces, and hyphens";
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errors.email = "Please enter a valid email address";
  if (!data.mobile || !/^(?:\+?91[\s-]?)?[6-9]\d{9}$/.test(data.mobile.trim())) errors.mobile = "Enter a valid 10-digit Indian mobile number";
  if (!data.college || data.college.trim().length < 3) errors.college = "College name must be at least 3 characters";
  if (!data.subdomain) errors.subdomain = "Please select an internship domain";
  if (data.message && data.message.length > 500) errors.message = "Message must be at most 500 characters";
  if (!data.agreement) errors.agreement = "You must accept the terms to proceed";
  return errors;
}

const INITIAL: FormData = {
  fullName: "", email: "", mobile: "", college: "",
  subdomain: "", message: "", agreement: false,
};

export function ApplicationModal({ open, domain, onClose }: Props) {
  const [formData, setFormData] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof FormData, boolean>>({} as Record<keyof FormData, boolean>);
  const [state, setState] = useState<ModalState>("idle");
  const [serverMsg, setServerMsg] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Pre-select domain when opened from a specific card
  useEffect(() => {
    if (open) {
      if (domain) {
        const matched = SUBDOMAIN_GROUPS.find((g) =>
          g.label.toLowerCase().includes(domain.toLowerCase()) ||
          domain.toLowerCase().includes(g.label.toLowerCase())
        );
        if (matched) {
          setFormData((prev) => ({ ...prev, subdomain: `${matched.label}__${matched.options[0]}` }));
        }
      }
      setTimeout(() => firstFieldRef.current?.focus(), 100);
    } else {
      // Reset on close
      setTimeout(() => {
        setFormData(INITIAL);
        setErrors({});
        setTouched({} as Record<keyof FormData, boolean>);
        setState("idle");
        setServerMsg("");
        setResumeFile(null);
        setResumeError("");
      }, 300);
    }
  }, [open, domain]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (touched[name as keyof FormData]) {
      const newErrors = validate({ ...formData, [name]: type === "checkbox" ? checked : value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FormErrors] }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FormErrors] }));
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    const ALLOWED = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!ALLOWED.includes(file.type)) {
      setResumeError("Only PDF, DOC, or DOCX files are accepted.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeError("File size must be under 5MB.");
      return;
    }
    setResumeFile(file);
    setResumeError("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {} as Record<keyof FormData, boolean>);
    setTouched(allTouched);

    const validationErrors = validate(formData);
    let hasFileError = false;
    if (!resumeFile) {
      setResumeError("Please upload your resume document.");
      hasFileError = true;
    }

    if (Object.keys(validationErrors).length > 0 || hasFileError) {
      setErrors(validationErrors);
      return;
    }

    setState("loading");
    setServerMsg("");

    try {
      let resumeUrl: string | null = null;
      if (resumeFile) {
        const fileExt = resumeFile.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(fileName, resumeFile);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          setState("error");
          setServerMsg("Failed to upload resume. Please try again.");
          return;
        }

        const { data: urlData } = supabase.storage
          .from("resumes")
          .getPublicUrl(fileName);

        resumeUrl = urlData.publicUrl;
      }

      const payload: Record<string, string | null | boolean> = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        college: formData.college.trim(),
        subdomain: formData.subdomain,
        message: formData.message.trim() || null,
        resumeUrl,
        agreement: formData.agreement,
      };

      const res = await fetch("/api/internships/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setState("success");
      } else if (res.status === 429) {
        setState("error");
        setServerMsg("Too many applications from this email. Please try again tomorrow.");
      } else if (data.errors) {
        setState("idle");
        setErrors(data.errors);
        const allTouched = Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {} as Record<keyof FormData, boolean>);
        setTouched(allTouched);
      } else {
        setState("error");
        setServerMsg(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setServerMsg("Network error. Check your connection and try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-lg bg-white border border-slate-200 text-slate-900 p-8 shadow-[0_16px_48px_rgba(128,0,0,0.12)] rounded-2xl"
        aria-describedby="modal-desc"
      >
        <DialogHeader className="text-left">
          <DialogTitle className="font-display text-2xl font-bold text-slate-900 font-orbitron tracking-wide">
            Internship Application
          </DialogTitle>
          <DialogDescription id="modal-desc" className="text-slate-500 font-outfit text-sm mt-2">
            Fill in the details below to apply for an internship at Infynux Academy.
          </DialogDescription>
        </DialogHeader>

        {/* SUCCESS STATE */}
        {state === "success" ? (
          <div className="flex flex-col items-center py-10 text-center space-y-5">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-[#800000]/8 shadow-[0_4px_20px_rgba(128,0,0,0.15)] border border-[#800000]/15">
              <CheckCircle2 className="h-10 w-10 text-[#800000]" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 font-orbitron tracking-wide">
              APPLICATION SUBMITTED!
            </h3>
            <p className="text-sm text-slate-500 max-w-xs font-outfit leading-relaxed">
              We'll review your credentials and reach out to you at your verified email address within <strong className="text-slate-700">2–3 business days</strong>.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#800000] px-6 py-3.5 text-sm font-bold text-white shadow-[0_4px_15px_rgba(128,0,0,0.2)] hover:bg-[#6B0000] transition-all font-orbitron"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-5 text-left" noValidate>
            {/* Error banner */}
            {state === "error" && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-600 font-orbitron" role="alert">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {serverMsg || "Submission failed. Please try again."}
              </div>
            )}

            {/* Full Name */}
            <Field label="Full Name" id="fullName" error={errors.fullName} required>
              <input
                ref={firstFieldRef}
                id="fullName" name="fullName" type="text"
                value={formData.fullName} onChange={handleChange} onBlur={handleBlur}
                placeholder="Ravi Kumar"
                className={fieldClass(!!errors.fullName)}
                autoComplete="name"
              />
            </Field>

            {/* Email */}
            <Field label="Email Address" id="email" error={errors.email} required>
              <input
                id="email" name="email" type="email"
                value={formData.email} onChange={handleChange} onBlur={handleBlur}
                placeholder="you@example.com"
                className={fieldClass(!!errors.email)}
                autoComplete="email"
              />
            </Field>

            {/* Mobile */}
            <Field label="Mobile Number" id="mobile" error={errors.mobile} required>
              <input
                id="mobile" name="mobile" type="tel"
                value={formData.mobile} onChange={handleChange} onBlur={handleBlur}
                placeholder="9876543210"
                className={fieldClass(!!errors.mobile)}
                autoComplete="tel"
              />
            </Field>

            {/* College */}
            <Field label="School / College Name" id="college" error={errors.college} required>
              <input
                id="college" name="college" type="text"
                value={formData.college} onChange={handleChange} onBlur={handleBlur}
                placeholder="ABC Engineering College"
                className={fieldClass(!!errors.college)}
                autoComplete="organization"
              />
            </Field>

            {/* Domain */}
            <Field label="Internship Domain" id="subdomain" error={errors.subdomain} required>
              <select
                id="subdomain" name="subdomain"
                value={formData.subdomain} onChange={handleChange} onBlur={handleBlur}
                className={fieldClass(!!errors.subdomain)}
              >
                <option value="" className="text-slate-400">— Select a domain —</option>
                {SUBDOMAIN_GROUPS.map((group) =>
                  group.options.map((opt) => (
                    <option key={`${group.label}__${opt}`} value={`${group.label}__${opt}`}>
                      {group.label} — {opt}
                    </option>
                  ))
                )}
              </select>
            </Field>

            {/* Message */}
            <Field label="Additional Message" id="message" error={errors.message} hint="Optional · max 500 chars">
              <textarea
                id="message" name="message"
                value={formData.message} onChange={handleChange} onBlur={handleBlur}
                placeholder="Tell us a bit about yourself, your skills, and why you're interested..."
                rows={3}
                className={fieldClass(!!errors.message)}
              />
              <span className={cn("block text-right text-[10px] mt-1 font-orbitron", formData.message.length > 490 ? "text-amber-500" : "text-slate-400")}>
                {formData.message.length}/500
              </span>
            </Field>

            {/* Resume Upload */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 font-orbitron">
                Resume File <span className="text-red-500">*</span>{" "}
                <span className="text-xs text-slate-400 font-outfit">(PDF/DOC/DOCX · max 5MB)</span>
              </label>
              {resumeFile ? (
                <div className="flex items-center gap-3 rounded-xl border border-[#800000]/15 bg-[#800000]/5 px-4 py-3.5">
                  <FileText className="h-4 w-4 text-[#800000]" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800 font-orbitron">{resumeFile.name}</p>
                    <p className="text-xs text-slate-400 font-outfit">{(resumeFile.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResumeFile(null)}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    aria-label="Remove resume"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  className={cn(
                    "cursor-pointer rounded-xl border-2 border-dashed px-4 py-7 text-center transition-all duration-300",
                    isDragging
                      ? "border-[#800000] bg-[#800000]/5 shadow-[0_0_15px_rgba(128,0,0,0.08)]"
                      : "border-slate-200 hover:border-[#800000]/30 hover:bg-[#800000]/3"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload resume"
                  onKeyDown={(e) => { if (e.key === "Enter") fileInputRef.current?.click(); }}
                >
                  <Upload className="mx-auto h-6 w-6 text-slate-400" aria-hidden="true" />
                  <p className="mt-2.5 text-sm text-slate-600 font-outfit">
                    <span className="font-semibold text-[#800000]">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-400 font-outfit mt-1">PDF, DOC, DOCX — max 5MB</p>
                </div>
              )}
              <input
                ref={fileInputRef} type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
              />
              {resumeError && (
                <p className="mt-1 text-xs text-red-500 font-orbitron" role="alert">{resumeError}</p>
              )}
            </div>

            {/* Agreement */}
            <div className="space-y-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  id="agreement" name="agreement" type="checkbox"
                  checked={formData.agreement} onChange={handleChange}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-[#800000] focus:ring-[#800000]/30 focus:ring-2 focus:ring-offset-0"
                />
                <span className="text-sm text-slate-500 font-outfit select-none">
                  I agree to the{" "}
                  <a href="#" className="text-[#800000] hover:underline">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-[#800000] hover:underline">Privacy Policy</a>
                </span>
              </label>
              {errors.agreement && touched.agreement && (
                <p className="mt-1 text-xs text-red-500 font-orbitron" role="alert">{errors.agreement}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={state === "loading"}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#800000] px-5 py-3.5 text-sm font-bold text-white shadow-[0_4px_15px_rgba(128,0,0,0.20)] hover:bg-[#6B0000] hover:shadow-[0_4px_20px_rgba(128,0,0,0.30)] transition-all disabled:cursor-not-allowed disabled:opacity-60 font-orbitron"
            >
              {state === "loading" ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> SUBMITTING APPLICATION...</>
              ) : (
                "SUBMIT APPLICATION"
              )}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function fieldClass(hasError: boolean) {
  return cn(
    "w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 font-outfit transition-all focus:outline-none focus:ring-2",
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-[#800000] focus:ring-[#800000]/10"
  );
}

function Field({
  label,
  id,
  children,
  error,
  required,
  hint,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 font-orbitron">
        {label}
        {required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}
        {hint && <span className="ml-1 text-xs text-slate-400 font-outfit">({hint})</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-red-500 font-orbitron" role="alert" aria-live="polite">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
