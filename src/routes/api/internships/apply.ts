import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getServerSupabase } from "@/lib/supabase";
import { internshipSchema } from "@/lib/validators";

export const Route = createFileRoute("/api/internships/apply")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const supabase = getServerSupabase();
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
            resumeUrl,
          } = parsed.data;

          const ip =
            request.headers.get("x-forwarded-for")?.split(",")[0] ||
            request.headers.get("x-real-ip") ||
            "unknown";

          // Rate limit: 100 per email per day (relaxed for testing/development)
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
          const { count } = await supabase
            .from("internship_applications")
            .select("*", { count: "exact", head: true })
            .eq("email", email.toLowerCase())
            .gte("submitted_at", dayAgo);

          if ((count ?? 0) >= 100) {
            return Response.json(
              { success: false, message: "Too many applications. Please try again tomorrow." },
              { status: 429 }
            );
          }

          // Parse domain / subdomain from the combined subdomain field
          const parts = subdomain.split("__");
          const domain = parts[0] ?? subdomain;
          const subdomainValue = parts[1] ?? null;

          const { data, error } = await supabase
            .from("internship_applications")
            .insert({
              full_name: fullName,
              email: email.toLowerCase(),
              mobile: mobile.replace(/\D/g, "").slice(-10),
              college_name: college,
              domain,
              subdomain: subdomainValue,
              message: message || null,
              resume_url: resumeUrl || null,
              ip_address: ip,
            })
            .select("id")
            .single();

           if (error) throw error;

          // Send emails via Resend
          try {
            const { getResendClient, getResendFromEmail, getResendToEmail } = await import("@/lib/resend");
            const resend = getResendClient();
            if (resend) {
              // 1. Send confirmation email to applicant
              const res1 = await resend.emails.send({
                from: `Infynux Academy <${getResendFromEmail()}>`,
                to: email.toLowerCase(),
                subject: "Internship Application Received — Infynux Academy 🚀",
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; rounded: 12px;">
                    <h2 style="color: #6d28d9; font-size: 20px; font-weight: bold; margin-bottom: 16px;">Hello ${fullName},</h2>
                    <p style="font-size: 16px; line-height: 1.5; color: #374151;">Thank you for applying for the <strong>"${domain}${subdomainValue ? ` - ${subdomainValue}` : ""}"</strong> internship at Infynux Academy.</p>
                    <p style="font-size: 16px; line-height: 1.5; color: #374151;">We are excited about your application. Our review team will assess your profile and college details, and we'll get back to you within <strong>2-3 business days</strong>.</p>
                    <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 20px 0; font-size: 14px;">
                      <p style="margin: 0; font-weight: bold; color: #374151;">Application Details:</p>
                      <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #4b5563;">
                        <li><strong>Domain:</strong> ${domain}</li>
                        <li><strong>Sub-domain:</strong> ${subdomainValue || "Not specified"}</li>
                        <li><strong>College:</strong> ${college}</li>
                        <li><strong>Mobile:</strong> ${mobile}</li>
                      </ul>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 24px 0;" />
                    <p style="font-size: 14px; color: #6b7280;">If you have any questions, feel free to reply directly to this email.</p>
                    <p style="font-size: 14px; font-weight: 600; color: #374151; margin-top: 8px;">— The Infynux Academy Team</p>
                  </div>
                `,
              });
              if (res1.error) {
                console.error("Resend send confirmation error:", res1.error);
              }

              // 2. Send notification to admin
              const res2 = await resend.emails.send({
                from: `Infynux System <${getResendFromEmail()}>`,
                to: getResendToEmail("support@infynuxsolutions.in"),
                subject: `New Internship Application: ${fullName} (${domain})`,
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; rounded: 12px;">
                    <h2 style="color: #6d28d9; font-size: 20px; font-weight: bold; margin-bottom: 16px;">New Internship Application</h2>
                    <dl style="font-size: 14px; line-height: 1.6; color: #374151;">
                      <dt><strong>Applicant Name:</strong></dt> <dd>${fullName}</dd>
                      <dt><strong>Email:</strong></dt> <dd>${email}</dd>
                      <dt><strong>Mobile:</strong></dt> <dd>${mobile}</dd>
                      <dt><strong>School/College:</strong></dt> <dd>${college}</dd>
                      <dt><strong>Selected Domain:</strong></dt> <dd>${domain} (${subdomainValue || "None"})</dd>
                      <dt><strong>IP Address:</strong></dt> <dd>${ip}</dd>
                      <dt><strong>Resume Document:</strong></dt>
                      <dd>
                        ${resumeUrl 
                          ? `<a href="${resumeUrl}" target="_blank" style="color: #6d28d9; font-weight: bold; text-decoration: underline;">Download / View Resume File</a>`
                          : `<span style="color: #6b7280; font-style: italic;">No resume uploaded</span>`
                        }
                      </dd>
                    </dl>
                    ${message ? `
                    <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 20px 0;">
                      <p style="margin: 0; font-weight: bold;">Applicant Message:</p>
                      <p style="margin: 8px 0 0 0; white-space: pre-wrap;">${message}</p>
                    </div>
                    ` : ""}
                  </div>
                `,
              });
              if (res2.error) {
                console.error("Resend send admin notification error:", res2.error);
              }
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
