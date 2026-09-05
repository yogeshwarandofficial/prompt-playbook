import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { db } from "@/lib/firebase";
import { collection, query, where, getCountFromServer, addDoc } from "firebase/firestore";
import { internshipSchema } from "@/lib/validators";

export const Route = createFileRoute("/api/internships/apply")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          // Server-side validation
          const parsed = internshipSchema.safeParse(body);
          if (!parsed.success) {
            return Response.json(
              { success: false, errors: parsed.error.flatten().fieldErrors },
              { status: 400 }
            );
          }

           const {
            fullName,
            email,
            mobile,
            college,
            subdomain,
            message,
            resumeData,
            resumeName,
            resumeType,
          } = parsed.data;

          const ip =
            request.headers.get("x-forwarded-for")?.split(",")[0] ||
            request.headers.get("x-real-ip") ||
            "unknown";

          // Rate limit: 100 per email per day (relaxed for testing/development)
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
          const internshipsRef = collection(db, "internships");
          const q = query(
            internshipsRef,
            where("email", "==", email.toLowerCase()),
            where("submitted_at", ">=", dayAgo)
          );
          const snapshot = await getCountFromServer(q);
          const count = snapshot.data().count;

          if (count >= 100) {
            return Response.json(
              { success: false, message: "Too many applications. Please try again tomorrow." },
              { status: 429 }
            );
          }

          // Parse domain / subdomain from the combined subdomain field
          const parts = subdomain.split("__");
          const domain = parts[0] ?? subdomain;
          const subdomainValue = parts[1] ?? null;

          const docRef = await addDoc(internshipsRef, {
            full_name: fullName,
            email: email.toLowerCase(),
            mobile: mobile.replace(/\D/g, "").slice(-10),
            college_name: college,
            domain,
            subdomain: subdomainValue,
            message: message || null,
            resume_url: null,
            resume_sent_via_email: true,
            resume_filename: resumeName,
            ip_address: ip,
            submitted_at: new Date().toISOString()
          });
          
          const data = { id: docRef.id };

          // Send emails via Resend
          try {
            const { getResendClient, getResendFromEmail, getResendToEmail } = await import("@/lib/resend");
            const resend = getResendClient();
            if (resend) {
              // 1. Confirmation to applicant
              await resend.emails.send({
                from: `Infynux Academy <${getResendFromEmail()}>`,
                to: getResendToEmail(email.toLowerCase()),
                subject: "Internship Application Received — Infynux Academy 🚀",
                html: `
                  <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eaeaea;border-radius:12px">
                    <h2 style="color:#800000;font-size:20px;font-weight:bold;margin-bottom:16px">Hello ${fullName},</h2>
                    <p style="font-size:16px;line-height:1.5;color:#374151">Thank you for applying for the <strong>${domain} — ${subdomainValue || "General"}</strong> internship at Infynux Academy.</p>
                    <p style="font-size:16px;line-height:1.5;color:#374151">Our team will review your profile and get back to you within <strong>2–3 business days</strong>.</p>
                    <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:20px 0;font-size:14px">
                      <p style="margin:0;font-weight:bold;color:#374151">Application Summary:</p>
                      <ul style="margin:8px 0 0;padding-left:20px;color:#4b5563">
                        <li><strong>Domain:</strong> ${domain}</li>
                        <li><strong>Sub-domain:</strong> ${subdomainValue || "Not specified"}</li>
                        <li><strong>College:</strong> ${college}</li>
                        <li><strong>Mobile:</strong> ${mobile}</li>
                      </ul>
                    </div>
                    <hr style="border:0;border-top:1px solid #eaeaea;margin:24px 0" />
                    <p style="font-size:14px;font-weight:600;color:#374151">— The Infynux Academy Team</p>
                  </div>
                `,
              });

              // 2. Admin notification with resume attachment
              await resend.emails.send({
                from: `Infynux System <${getResendFromEmail()}>`,
                to: getResendToEmail("support@infynuxsolutions.in"),
                subject: `New Internship Application: ${fullName} (${domain})`,
                attachments: [
                  {
                    filename: resumeName,
                    content: Buffer.from(resumeData, "base64"),
                    contentType: resumeType,
                  },
                ],
                html: `
                  <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eaeaea;border-radius:12px">
                    <h2 style="color:#800000;font-size:20px;font-weight:bold;margin-bottom:16px">New Internship Application</h2>
                    <table style="font-size:14px;line-height:1.8;color:#374151;width:100%">
                      <tr><td><strong>Name:</strong></td><td>${fullName}</td></tr>
                      <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
                      <tr><td><strong>Mobile:</strong></td><td>${mobile}</td></tr>
                      <tr><td><strong>College:</strong></td><td>${college}</td></tr>
                      <tr><td><strong>Domain:</strong></td><td>${domain} — ${subdomainValue || "None"}</td></tr>
                      <tr><td><strong>IP:</strong></td><td>${ip}</td></tr>
                      <tr><td><strong>Resume:</strong></td><td>📎 ${resumeName} (attached)</td></tr>
                    </table>
                    ${message ? `
                    <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:20px 0">
                      <p style="margin:0;font-weight:bold">Message:</p>
                      <p style="margin:8px 0 0;white-space:pre-wrap">${message}</p>
                    </div>` : ""}
                  </div>
                `,
              });
            }
          } catch (emailErr) {
            console.warn("Failed to send internship emails via Resend:", emailErr);
          }

          return Response.json(
            {
              success: true,
              message: "Application submitted successfully!",
              application_id: data.id,
            },
            { status: 201 }
          );
        } catch (err) {
          console.error("[apply]", err);
          return Response.json(
            { success: false, message: "Server error. Please try again." },
            { status: 500 }
          );
        }
      },
    },
  },
});
