import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      this.logger.warn('RESEND_API_KEY not configured — emails will be skipped.');
    }
  }

  private get fromEmail(): string {
    return this.config.get<string>('RESEND_FROM_EMAIL') ?? 'onboarding@resend.dev';
  }

  /** Send an email. Returns true on success, false on failure (never throws). */
  async send(opts: {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
  }): Promise<boolean> {
    if (!this.resend) {
      this.logger.warn(`Email skipped (no API key): ${opts.subject} → ${opts.to}`);
      return false;
    }
    try {
      const { error } = await this.resend.emails.send({
        from: opts.from ?? `Infynux Academy <${this.fromEmail}>`,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
      });
      if (error) {
        this.logger.error(`Resend error for "${opts.subject}": ${JSON.stringify(error)}`);
        return false;
      }
      this.logger.log(`Email sent: "${opts.subject}" → ${opts.to}`);
      return true;
    } catch (err) {
      this.logger.error(`Email send exception for "${opts.subject}":`, err);
      return false;
    }
  }

  // ─── Interview Invitation ──────────────────────────────────────────────────

  async sendInterviewInvitation(opts: {
    applicantName: string;
    applicantEmail: string;
    scheduledAt: Date;
    meetingLink?: string | null;
    interviewId: string;
  }): Promise<boolean> {
    const dateStr = opts.scheduledAt.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const timeStr = opts.scheduledAt.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const meetingSection = opts.meetingLink
      ? `<div style="text-align:center;margin:28px 0;">
          <a href="${opts.meetingLink}" target="_blank" rel="noopener noreferrer"
             style="display:inline-block;background:#6d28d9;color:#ffffff;font-size:15px;font-weight:700;
                    text-decoration:none;padding:14px 36px;border-radius:8px;letter-spacing:0.5px;">
            JOIN INTERVIEW
          </a>
          <p style="margin:10px 0 0;font-size:12px;color:#6b7280;word-break:break-all;">${opts.meetingLink}</p>
        </div>`
      : `<p style="color:#6b7280;font-style:italic;">No meeting link has been provided yet. Please contact the Academy team.</p>`;

    const html = `<!DOCTYPE html>
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
            <p style="margin:0 0 16px;font-size:16px;color:#374151;">Hello <strong>${opts.applicantName}</strong>,</p>
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
              If you have any questions, please reply to this email or contact the Academy team.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px 32px;border-top:1px solid #f3f4f6;">
            <p style="margin:0;font-size:14px;font-weight:700;color:#374151;">Regards,</p>
            <p style="margin:4px 0 0;font-size:14px;color:#6d28d9;font-weight:700;">Infynux Academy</p>
            <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;">
              This email was sent to ${opts.applicantEmail} because you applied for an internship at Infynux Academy.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    return this.send({
      to: opts.applicantEmail,
      subject: 'Infynux Academy — Interview Scheduled',
      html,
    });
  }

  // ─── Contact Form ──────────────────────────────────────────────────────────

  async sendContactConfirmation(opts: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<boolean> {
    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eaeaea;border-radius:12px">
        <h2 style="color:#800000;font-size:20px;font-weight:bold;margin-bottom:16px">Hello ${opts.name},</h2>
        <p style="font-size:16px;line-height:1.5;color:#374151">Thanks for contacting Infynux Academy. We received your message about <strong>"${opts.subject}"</strong> and will get back to you within 24 hours.</p>
        <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:20px 0">
          <p style="margin:0;font-size:14px;font-weight:bold;color:#374151">Your Message:</p>
          <p style="margin:8px 0 0;font-size:14px;color:#4b5563;white-space:pre-wrap">${opts.message}</p>
        </div>
        <hr style="border:0;border-top:1px solid #eaeaea;margin:24px 0" />
        <p style="font-size:14px;font-weight:600;color:#374151">— The Infynux Academy Team</p>
      </div>`;
    return this.send({ to: opts.email, subject: 'We received your message — Infynux Academy', html });
  }

  async sendContactAdminNotification(opts: {
    name: string;
    email: string;
    subject: string;
    message: string;
    ip: string;
  }): Promise<boolean> {
    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eaeaea;border-radius:12px">
        <h2 style="color:#800000;font-size:20px;font-weight:bold;margin-bottom:16px">New Contact Form Submission</h2>
        <table style="font-size:14px;line-height:1.8;color:#374151;width:100%">
          <tr><td><strong>Name:</strong></td><td>${opts.name}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${opts.email}</td></tr>
          <tr><td><strong>Subject:</strong></td><td>${opts.subject}</td></tr>
          <tr><td><strong>IP:</strong></td><td>${opts.ip}</td></tr>
        </table>
        <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:20px 0">
          <p style="margin:0;font-weight:bold">Message:</p>
          <p style="margin:8px 0 0;white-space:pre-wrap">${opts.message}</p>
        </div>
      </div>`;
    return this.send({
      from: `Infynux System <${this.fromEmail}>`,
      to: 'support@infynuxsolutions.in',
      subject: `New Contact: ${opts.subject} — from ${opts.name}`,
      html,
    });
  }

  // ─── Newsletter Welcome ────────────────────────────────────────────────────

  async sendNewsletterWelcome(email: string): Promise<boolean> {
    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eaeaea;border-radius:12px">
        <h2 style="color:#6d28d9;font-size:24px;font-weight:bold;margin-bottom:16px">Welcome to Infynux Academy! 🎉</h2>
        <p style="font-size:16px;line-height:1.5;color:#374151">Thanks for subscribing to our newsletter. You'll be the first to know about new learning roadmaps, tutorial updates, and exclusive remote internship openings.</p>
        <hr style="border:0;border-top:1px solid #eaeaea;margin:24px 0" />
        <p style="font-size:14px;color:#6b7280">If you have any questions, feel free to reply to this email.</p>
        <p style="font-size:14px;font-weight:600;color:#374151;margin-top:8px">— The Infynux Academy Team</p>
      </div>`;
    return this.send({ to: email, subject: 'Welcome to Infynux Academy! 🚀', html });
  }
}
