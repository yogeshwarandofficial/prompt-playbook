import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { db } from "@/lib/firebase";
import { collection, query, where, getCountFromServer, addDoc } from "firebase/firestore";
import { contactSchema } from "@/lib/validators";

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
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
          const contactsRef = collection(db, "contacts");
          const q = query(
            contactsRef,
            where("ip_address", "==", ip),
            where("submitted_at", ">=", hourAgo)
          );
          const snapshot = await getCountFromServer(q);
          const count = snapshot.data().count;

          if (count >= 100) {
            return Response.json(
              { success: false, message: "Too many requests. Please try again later." },
              { status: 429 }
            );
          }

          await addDoc(contactsRef, {
            full_name: name,
            email: email.toLowerCase(),
            subject,
            message,
            ip_address: ip,
            submitted_at: new Date().toISOString()
          });

          // Send emails via Resend
          try {
            const { getResendClient, getResendFromEmail, getResendToEmail } = await import("@/lib/resend");
            const resend = getResendClient();
            if (resend) {
              // 1. Confirmation to user
              await resend.emails.send({
                from: `Infynux Academy <${getResendFromEmail()}> `,
                to: getResendToEmail(email.toLowerCase()),
                subject: "We received your message — Infynux Academy",
                html: `
                  <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eaeaea;border-radius:12px">
                    <h2 style="color:#800000;font-size:20px;font-weight:bold;margin-bottom:16px">Hello ${name},</h2>
                    <p style="font-size:16px;line-height:1.5;color:#374151">Thanks for contacting Infynux Academy. We received your message about <strong>"${subject}"</strong> and will get back to you within 24 hours.</p>
                    <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:20px 0">
                      <p style="margin:0;font-size:14px;font-weight:bold;color:#374151">Your Message:</p>
                      <p style="margin:8px 0 0;font-size:14px;color:#4b5563;white-space:pre-wrap">${message}</p>
                    </div>
                    <hr style="border:0;border-top:1px solid #eaeaea;margin:24px 0" />
                    <p style="font-size:14px;font-weight:600;color:#374151">— The Infynux Academy Team</p>
                  </div>
                `,
              });

              // 2. Admin notification
              await resend.emails.send({
                from: `Infynux System <${getResendFromEmail()}>`,
                to: getResendToEmail("support@infynuxsolutions.in"),
                subject: `New Contact: ${subject} — from ${name}`,
                html: `
                  <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eaeaea;border-radius:12px">
                    <h2 style="color:#800000;font-size:20px;font-weight:bold;margin-bottom:16px">New Contact Form Submission</h2>
                    <table style="font-size:14px;line-height:1.8;color:#374151;width:100%">
                      <tr><td><strong>Name:</strong></td><td>${name}</td></tr>
                      <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
                      <tr><td><strong>Subject:</strong></td><td>${subject}</td></tr>
                      <tr><td><strong>IP:</strong></td><td>${ip}</td></tr>
                    </table>
                    <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:20px 0">
                      <p style="margin:0;font-weight:bold">Message:</p>
                      <p style="margin:8px 0 0;white-space:pre-wrap">${message}</p>
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
