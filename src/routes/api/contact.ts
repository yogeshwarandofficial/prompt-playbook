import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getServerSupabase } from "@/lib/supabase";
import { contactSchema } from "@/lib/validators";

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const supabase = getServerSupabase();
          const body = await request.json();
          const parsed = contactSchema.safeParse(body);
          if (!parsed.success) {
            return Response.json(
              { success: false, errors: parsed.error.flatten().fieldErrors },
              { status: 400 }
            );
          }

          const { name, email, subject, message } = parsed.data;
          const ip =
            request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

          // Rate limit: 100 per IP per hour (relaxed for testing/development)
          const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
          const { count } = await supabase
            .from("contact_submissions")
            .select("*", { count: "exact", head: true })
            .eq("ip_address", ip)
            .gte("submitted_at", hourAgo);

          if ((count ?? 0) >= 100) {
            return Response.json(
              { success: false, message: "Too many requests. Please try again later." },
              { status: 429 }
            );
          }

          const { error } = await supabase.from("contact_submissions").insert({
            full_name: name,
            email: email.toLowerCase(),
            subject,
            message,
            ip_address: ip,
          });

          if (error) throw error;

          // Send emails via Resend
          try {
            const { getResendClient, getResendFromEmail, getResendToEmail } = await import("@/lib/resend");
            const resend = getResendClient();
            if (resend) {
              // 1. Send confirmation email to user
              await resend.emails.send({
                from: `Infynux Academy <${getResendFromEmail()}>`,
                to: email.toLowerCase(),
                subject: "We received your message — Infynux Academy",
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; rounded: 12px;">
                    <h2 style="color: #6d28d9; font-size: 20px; font-weight: bold; margin-bottom: 16px;">Hello ${name},</h2>
                    <p style="font-size: 16px; line-height: 1.5; color: #374151;">Thanks for contacting Infynux Academy. We have received your message regarding <strong>"${subject}"</strong> and our team will get back to you within 24 hours.</p>
                    <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 20px 0;">
                      <p style="margin: 0; font-size: 14px; font-weight: bold; color: #374151;">Your Message:</p>
                      <p style="margin: 8px 0 0 0; font-size: 14px; color: #4b5563; font-style: italic; white-space: pre-wrap;">${message}</p>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 24px 0;" />
                    <p style="font-size: 14px; color: #6b7280;">If this was a mistake, please ignore this email.</p>
                    <p style="font-size: 14px; font-weight: 600; color: #374151; margin-top: 8px;">— The Infynux Academy Team</p>
                  </div>
                `,
              });

              // 2. Send notification email to admin
              await resend.emails.send({
                from: `Infynux System <${getResendFromEmail()}>`,
                to: getResendToEmail("support@infynuxsolutions.in"),
                subject: `New Contact Submission: ${subject}`,
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; rounded: 12px;">
                    <h2 style="color: #6d28d9; font-size: 20px; font-weight: bold; margin-bottom: 16px;">New Contact Inquiry</h2>
                    <dl style="font-size: 14px; line-height: 1.6; color: #374151;">
                      <dt><strong>Name:</strong></dt> <dd>${name}</dd>
                      <dt><strong>Email:</strong></dt> <dd>${email}</dd>
                      <dt><strong>Subject:</strong></dt> <dd>${subject}</dd>
                      <dt><strong>IP Address:</strong></dt> <dd>${ip}</dd>
                    </dl>
                    <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 20px 0;">
                      <p style="margin: 0; font-weight: bold;">Message:</p>
                      <p style="margin: 8px 0 0 0; white-space: pre-wrap;">${message}</p>
                    </div>
                  </div>
                `,
              });
            }
          } catch (emailErr) {
            console.warn("Failed to send contact emails via Resend:", emailErr);
          }

          return Response.json(
            { success: true, message: "Message sent successfully!" },
            { status: 201 }
          );
        } catch (err) {
          console.error("[contact]", err);
          return Response.json(
            { success: false, message: "Server error. Please try again." },
            { status: 500 }
          );
        }
      },
    },
  },
});
