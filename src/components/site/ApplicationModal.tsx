import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRef, useState, useEffect } from "react";
import { Upload, CheckCircle2, Loader2, AlertCircle, FileText, X } from "lucide-react";
import { SUBDOMAIN_GROUPS } from "@/data/content";
import { cn } from "@/lib/utils";

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
      const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file!);
        });

      const resumeData = await toBase64(resumeFile!);

      const payload: Record<string, string | null | boolean> = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        college: formData.college.trim(),
        subdomain: formData.subdomain,
        message: formData.message.trim() || null,
        resumeData,
        resumeName: resumeFile!.name,
        resumeType: resumeFile!.type,
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
        className="max-h-[95vh] w-[95vw] overflow-y-auto sm:max-w-[640px] p-0 bg-gradient-to-b from-[#090909] to-[#050505] border border-[#7CFF2B]/20 rounded-[24px] sm:rounded-[28px] shadow-[0_0_60px_rgba(124,255,43,0.08),0_30px_80px_rgba(0,0,0,0.75)] text-white font-sans [&>button]:hidden"
        aria-describedby="modal-desc"
      >
        <div className="px-5 py-5 sm:px-8 sm:py-7 sm:pb-5 flex justify-between items-start border-b border-white/5">
          <div>
            <div className="flex items-center gap-3.5">
              <div className="w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] rounded-full flex items-center justify-center shrink-0 bg-transparent">
                <img 
                  src="/INfynux-Logo 1.png" 
                  alt="Infynux Academy Logo"
                  className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.45)] drop-shadow-[0_0_18px_rgba(124,255,43,0.08)]"
                />
              </div>
              <h2 className="text-[22px] sm:text-[26px] font-extrabold text-white">
                Infynux <span className="text-[#7CFF2B]">Academy</span>
              </h2>
            </div>
            <p id="modal-desc" className="mt-2 text-[#8F9B8F] text-sm leading-relaxed max-w-[95%] sm:max-w-[85%]">
              Apply for a remote internship and become part of the Infynux Academy engineering pipeline.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-[#777] hover:text-white text-3xl leading-none cursor-pointer transition-colors pt-1 px-1"
          >
            &times;
          </button>
        </div>

        {/* SUCCESS STATE */}
        {state === "success" ? (
          <div className="flex flex-col items-center py-16 px-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#7CFF2B]/10 shadow-[0_4px_20px_rgba(124,255,43,0.15)] border border-[#7CFF2B]/20">
              <CheckCircle2 className="h-10 w-10 text-[#7CFF2B]" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              APPLICATION SUBMITTED!
            </h3>
            <p className="text-[#8F9B8F] text-[15px] leading-relaxed max-w-sm mx-auto">
              We'll review your credentials and reach out to you at your verified email address within <strong className="text-white">2–3 business days</strong>.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 w-full max-w-xs p-4 rounded-[18px] bg-gradient-to-r from-[#69FF2A] to-[#28E56A] text-[#050505] text-base font-extrabold transition-all hover:-translate-y-0.5 shadow-[0_12px_30px_rgba(124,255,43,0.25)] hover:shadow-[0_18px_40px_rgba(124,255,43,0.35)]"
            >
              CLOSE WINDOW
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-6 sm:px-8 sm:py-7 sm:pb-8" noValidate>
            
            {state === "error" && (
              <div className="mb-6 flex items-start gap-3 rounded-[16px] border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm text-red-400" role="alert">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {serverMsg || "Submission failed. Please try again."}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
              
              <Field label="Full Name" id="fullName" error={errors.fullName} required className="sm:col-span-2">
                <input
                  ref={firstFieldRef}
                  id="fullName" name="fullName" type="text"
                  value={formData.fullName} onChange={handleChange} onBlur={handleBlur}
                  placeholder="Yogeshwaran D"
                  className={fieldClass(!!errors.fullName)}
                  autoComplete="name"
                />
              </Field>

              <Field label="Email Address" id="email" error={errors.email} required>
                <input
                  id="email" name="email" type="email"
                  value={formData.email} onChange={handleChange} onBlur={handleBlur}
                  placeholder="you@example.com"
                  className={fieldClass(!!errors.email)}
                  autoComplete="email"
                />
              </Field>

              <Field label="Mobile Number" id="mobile" error={errors.mobile} required>
                <input
                  id="mobile" name="mobile" type="tel"
                  value={formData.mobile} onChange={handleChange} onBlur={handleBlur}
                  placeholder="9876543210"
                  className={fieldClass(!!errors.mobile)}
                  autoComplete="tel"
                />
              </Field>

              <Field label="School / College Name" id="college" error={errors.college} required className="sm:col-span-2">
                <input
                  id="college" name="college" type="text"
                  value={formData.college} onChange={handleChange} onBlur={handleBlur}
                  placeholder="ABC Engineering College"
                  className={fieldClass(!!errors.college)}
                  autoComplete="organization"
                />
              </Field>

              <Field label="Internship Domain" id="subdomain" error={errors.subdomain} required className="sm:col-span-2">
                <select
                  id="subdomain" name="subdomain"
                  value={formData.subdomain} onChange={handleChange} onBlur={handleBlur}
                  className={fieldClass(!!errors.subdomain)}
                >
                  <option value="" className="text-[#666]" disabled>Select your preferred domain</option>
                  {SUBDOMAIN_GROUPS.map((group) =>
                    group.options.map((opt) => (
                      <option key={`${group.label}__${opt}`} value={`${group.label}__${opt}`} className="bg-[#101010] text-white">
                        {group.label} — {opt}
                      </option>
                    ))
                  )}
                </select>
              </Field>

              <Field label="Additional Message" id="message" error={errors.message} hint="(Optional · max 500 characters)" className="sm:col-span-2">
                <textarea
                  id="message" name="message"
                  value={formData.message} onChange={handleChange} onBlur={handleBlur}
                  placeholder="Tell us about yourself, your skills, projects, and why you're interested in this internship."
                  className={fieldClass(!!errors.message) + " min-h-[130px] resize-none"}
                />
                <div className="text-right text-[#666] text-xs mt-1.5">
                  <span className={formData.message.length > 490 ? "text-red-400" : ""}>{formData.message.length}</span> / 500
                </div>
              </Field>

              <div className="flex flex-col gap-2.5 sm:col-span-2">
                <label className="text-[13px] text-[#D8D8D8] font-semibold tracking-wide">
                  Resume <span className="text-[#7CFF2B]">*</span>
                </label>
                {resumeFile ? (
                  <div className="flex items-center gap-3 rounded-[20px] border border-[#7CFF2B]/25 bg-[#7CFF2B]/5 px-5 py-4">
                    <FileText className="h-6 w-6 text-[#7CFF2B]" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[15px] font-semibold text-white">{resumeFile.name}</p>
                      <p className="text-[13px] text-[#777]">{(resumeFile.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="rounded-full p-2 text-[#777] hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Remove resume"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "bg-[#090909] border-2 border-dashed rounded-[20px] px-5 py-[30px] text-center transition-all cursor-pointer",
                      isDragging
                        ? "border-[#7CFF2B] bg-[#0d1307]"
                        : "border-[#7CFF2B]/25 hover:border-[#7CFF2B] hover:bg-[#0d1307]"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                  >
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#7CFF2B]/10 flex items-center justify-center text-[#7CFF2B] text-2xl mb-4">
                      &#8679;
                    </div>
                    <div className="text-[15px] text-white">
                      <strong className="text-[#7CFF2B] font-semibold">Click to upload</strong> or drag & drop
                    </div>
                    <p className="text-[#777] mt-1.5 text-[13px]">PDF, DOC or DOCX • Maximum file size 5 MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef} type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                />
                {resumeError && <p className="mt-1 text-xs text-red-400" role="alert">{resumeError}</p>}
              </div>

              <div className="flex flex-col gap-2.5 sm:col-span-2">
                <div className="flex items-start gap-3 mt-2">
                  <input
                    id="agreement" name="agreement" type="checkbox"
                    checked={formData.agreement} onChange={handleChange}
                    className="w-5 h-5 accent-[#7CFF2B] mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="agreement" className="text-[#999] font-normal leading-relaxed text-sm cursor-pointer select-none">
                    I agree to the <a href="#" className="text-[#7CFF2B] no-underline hover:underline">Terms of Service</a> and <a href="#" className="text-[#7CFF2B] no-underline hover:underline">Privacy Policy</a>.
                  </label>
                </div>
                {errors.agreement && touched.agreement && (
                  <p className="text-xs text-red-400 mt-1" role="alert">{errors.agreement}</p>
                )}
              </div>

            </div>

            <button
              type="submit"
              disabled={state === "loading"}
              className="mt-6 w-full p-[18px] border-none rounded-[18px] bg-gradient-to-r from-[#69FF2A] to-[#28E56A] text-[#050505] text-base font-extrabold cursor-pointer transition-all duration-300 tracking-wide shadow-[0_12px_30px_rgba(124,255,43,0.25)] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(124,255,43,0.35)] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2"
            >
              {state === "loading" ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> SUBMITTING...</>
              ) : (
                "SUBMIT APPLICATION"
              )}
            </button>

            <p className="text-center text-[#666] mt-5 text-xs">
              Powered by Infynux Academy • Learn. Build. Get Hired.
            </p>

          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function fieldClass(hasError: boolean) {
  return cn(
    "w-full bg-[#101010] border text-white px-4 py-[15px] rounded-[16px] outline-none transition-all text-[15px] placeholder:text-[#666] focus:ring-4",
    hasError
      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10"
      : "border-[#242424] focus:border-[#7CFF2B] focus:ring-[#7CFF2B]/10"
  );
}

function Field({
  label,
  id,
  children,
  error,
  required,
  hint,
  className
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <label htmlFor={id} className="text-[13px] text-[#D8D8D8] font-semibold tracking-wide flex justify-between items-center">
        <span>
          {label} {required && <span className="text-[#7CFF2B] ml-0.5">*</span>}
        </span>
        {hint && <span className="text-[#777] font-medium ml-2">{hint}</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-400" role="alert">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
