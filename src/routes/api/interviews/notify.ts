import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

/**
 * POST /api/interviews/notify
 *
 * Sends an interview invitation email to the applicant via Resend.
 * Called by the admin UI AFTER the interview has already been persisted.
 * Email failure returns 502 but the interview record is unaffected.
 *
 * Body:
 *   {
 *     applicantName: string;    // from Application.name
 *     applicantEmail: string;   // from Application.email (the submitted email)
 *     scheduledAt: string;      // ISO date string (UTC)
 *     meetingLink?: string;     // interview join URL
 *     interviewId: string;      // for logging
 *   }
 */
export const Route = createFileRoute("/api/interviews/notify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { applicantName, applicantEmail, scheduledAt, meetingLink, interviewId } = body ?? {};

          if (!applicantEmail || !applicantName || !scheduledAt) {
            return Response.json(
              { success: false, message: "Missing required fields: applicantEmail, applicantName, scheduledAt" },
              { status: 400 }
            );
          }

          // Localise to IST (UTC+5:30)
          const interviewDate = new Date(scheduledAt);
          const dateStr = interviewDate.toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          const timeStr = interviewDate.toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          const meetingSection = meetingLink
            ? `<div style="text-align:center;margin:28px 0;">
                <a href="${meetingLink}" target="_blank" rel="noopener noreferrer"
                   style="display:inline-block;background:#6d28d9;color:#ffffff;font-size:15px;font-weight:700;
                          text-decoration:none;padding:14px 36px;border-radius:8px;letter-spacing:0.5px;">
                  JOIN INTERVIEW
                </a>
                <p style="margin:10px 0 0;font-size:12px;color:#6b7280;word-break:break-all;">${meetingLink}</p>
              </div>`
            : `<p style="color:#6b7280;font-style:italic;">No meeting link has been provided yet. Please contact the Academy team.</p>`;

          const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f8;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#6d28d9 0%,#4f46e5 100%);padding:36px 40px 28px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;">Infynux Academy</h1>
            <p style="margin:8px 0 0;color:#e0d9ff;font-size:14px;">Interview Scheduled</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px 28px;">
            <p style="margin:0 0 16px;font-size:16px;color:#374151;">Hello <strong>${applicantName}</strong>,</p>
            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.7;">
              Congratulations! Your internship application has been shortlisted and your interview has been scheduled.
              We look forward to speaking with you.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#f9f7ff;border:1px solid #e0d9ff;border-radius:10px;margin-bottom:24px;">
              <tr><td style="padding:20px 24px;">
                <h3 style="margin:0 0 16px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#6d28d9;">
                  Interview Details
                </h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:6px 0;font-size:13px;color:#6b7280;width:140px;">Date</td>
                    <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:600;">${dateStr}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:13px;color:#6b7280;">Time</td>
                    <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:600;">${timeStr}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:13px;color:#6b7280;">Timezone</td>
                    <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:600;">IST (UTC+5:30)</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:13px;color:#6b7280;">Interview type</td>
                    <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:600;">Online Interview</td>
                  </tr>
                </table>
              </td></tr>
            </table>
            ${meetingSection}
            <p style="margin:24px 0 0;font-size:14px;color:#374151;line-height:1.7;">
              Please join the meeting a few minutes before the scheduled time.
            </p>
            <p style="margin:12px 0 0;font-size:14px;color:#374151;line-height:1.7;">
              If you have any questions or need to contact Infynux Academy, please reply to this email or contact the Academy team.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px 32px;border-top:1px solid #f3f4f6;">
            <p style="margin:0;font-size:14px;font-weight:700;color:#374151;">Regards,</p>
            <p style="margin:4px 0 0;font-size:14px;color:#6d28d9;font-weight:700;">Infynux Academy</p>
            <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;">
              This email was sent to ${applicantEmail} because you applied for an internship at Infynux Academy.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

          const { getResendClient, getResendFromEmail, getResendToEmail } = await import("@/lib/resend");
          const resend = getResendClient();

          if (!resend) {
            console.warn("[interviews/notify] RESEND_API_KEY not configured.");
            return Response.json(
              { success: false, message: "Email service not configured. The interview is still saved." },
              { status: 503 }
            );
          }

          const { data, error } = await resend.emails.send({
            from: `Infynux Academy <${getResendFromEmail()}>`,
            to: getResendToEmail(applicantEmail),
            subject: "Infynux Academy \u2014 Interview Scheduled",
            html: htmlBody,
          });

          if (error) {
            console.error("[interviews/notify] Resend delivery error:", error);
            return Response.json(
              { success: false, message: `Email delivery failed: ${error.message}. Interview is still saved.` },
              { status: 502 }
            );
          }

          console.log(`[interviews/notify] Sent to ${applicantEmail} (interviewId=${interviewId}, resendId=${data?.id})`);
          return Response.json({ success: true, messageId: data?.id });
        } catch (err) {
          console.error("[interviews/notify] Unexpected error:", err);
          return Response.json(
            { success: false, message: "Server error sending notification." },
            { status: 500 }
          );
        }
      },
    },
  },
});
