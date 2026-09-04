const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID;
const APPLICANT_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_APPLICANT_ID || process.env.VITE_EMAILJS_TEMPLATE_APPLICANT_ID;
const ADMIN_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ADMIN_ID || process.env.VITE_EMAILJS_TEMPLATE_ADMIN_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY;
const PRIVATE_KEY = import.meta.env.VITE_EMAILJS_PRIVATE_KEY || process.env.VITE_EMAILJS_PRIVATE_KEY;

async function callEmailJS(templateId: string, templateParams: Record<string, unknown>) {
  if (!SERVICE_ID || !templateId || !PUBLIC_KEY) {
    console.warn("EmailJS credentials missing. Check your environment variables.");
    return;
  }

  const payload: Record<string, unknown> = {
    service_id: SERVICE_ID,
    template_id: templateId,
    user_id: PUBLIC_KEY,
    template_params: templateParams,
  };

  if (PRIVATE_KEY) {
    payload.accessToken = PRIVATE_KEY;
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`EmailJS Error: ${text}`);
  }
}

/** Send confirmation email to the applicant */
export async function sendApplicantEmail(params: Record<string, unknown>) {
  if (!APPLICANT_TEMPLATE_ID) {
    console.warn("VITE_EMAILJS_TEMPLATE_APPLICANT_ID not set.");
    return;
  }
  await callEmailJS(APPLICANT_TEMPLATE_ID, params);
}

/** Send admin notification email to support@infynuxsolutions.in */
export async function sendAdminEmail(params: Record<string, unknown>) {
  if (!ADMIN_TEMPLATE_ID) {
    console.warn("VITE_EMAILJS_TEMPLATE_ADMIN_ID not set.");
    return;
  }
  await callEmailJS(ADMIN_TEMPLATE_ID, params);
}
