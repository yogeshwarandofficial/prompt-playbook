import { Resend } from "resend";

export function getResendClient() {
  const apiKey =
    process.env.RESEND_API_KEY ??
    import.meta.env.RESEND_API_KEY;

  console.log("[Resend Client Init] process.env.RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
  console.log("[Resend Client Init] import.meta.env.RESEND_API_KEY exists:", !!import.meta.env.RESEND_API_KEY);

  if (!apiKey) {
    console.warn("RESEND_API_KEY is not defined in env variables.");
    return null;
  }

  return new Resend(apiKey);
}

export function getResendFromEmail() {
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ??
    import.meta.env.RESEND_FROM_EMAIL;
  return fromEmail || "onboarding@resend.dev";
}

export function getResendToEmail(originalEmail: string | string[]) {
  const override =
    process.env.RESEND_TO_EMAIL_OVERRIDE ??
    import.meta.env.RESEND_TO_EMAIL_OVERRIDE;
  
  if (override && override.trim()) {
    return override.trim();
  }
  
  return originalEmail;
}

