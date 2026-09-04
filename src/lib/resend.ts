import { Resend } from "resend";

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY ?? import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not defined.");
    return null;
  }
  return new Resend(apiKey);
}

export function getResendFromEmail() {
  return process.env.RESEND_FROM_EMAIL ?? import.meta.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
}

/** Returns override email if set (for dev), otherwise the original recipient */
export function getResendToEmail(originalEmail: string | string[]) {
  const override = process.env.RESEND_TO_EMAIL_OVERRIDE ?? import.meta.env.RESEND_TO_EMAIL_OVERRIDE;
  if (override && override.trim()) return override.trim();
  return originalEmail;
}
