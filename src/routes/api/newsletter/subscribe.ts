import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getServerSupabase } from "@/lib/supabase";
import { newsletterSchema } from "@/lib/validators";

export const Route = createFileRoute("/api/newsletter/subscribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const supabase = getServerSupabase();
          const body = await request.json();
          const parsed = newsletterSchema.safeParse(body);
          if (!parsed.success) {
            return Response.json(
              { success: false, errors: parsed.error.flatten().fieldErrors },
              { status: 400 }
            );
          }

          const { email } = parsed.data;

          // Check if already subscribed to prevent duplicate welcome emails
          const { data: existing } = await supabase
            .from("newsletter_subscribers")
            .select("id")
            .eq("email", email.toLowerCase())
            .maybeSingle();

          if (existing) {
            return Response.json(
              { success: true, message: "You're already subscribed! 🎉" },
              { status: 200 }
            );
          }

          // Upsert — do nothing if already subscribed
          const { error } = await supabase
            .from("newsletter_subscribers")
            .upsert({ email: email.toLowerCase() }, { onConflict: "email", ignoreDuplicates: true });

          if (error) throw error;

          // Send welcome email via Resend
          try {
            const { getResendClient, getResendFromEmail, getResendToEmail } = await import("@/lib/resend");
            const resend = getResendClient();
            if (resend) {
              await resend.emails.send({
                from: `Infynux Academy <${getResendFromEmail()}>`,
                to: email.toLowerCase(),
                subject: "Welcome to Infynux Academy! 🚀",
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; rounded: 12px;">
                    <h2 style="color: #6d28d9; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Welcome to Infynux Academy! 🎉</h2>
                    <p style="font-size: 16px; line-height: 1.5; color: #374151;">Thanks for subscribing to our newsletter. You'll be the first to know about new learning roadmaps, tutorial updates, and exclusive remote internship openings.</p>
                    <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 24px 0;" />
                    <p style="font-size: 14px; color: #6b7280;">If you have any questions, feel free to reply to this email.</p>
                    <p style="font-size: 14px; font-weight: 600; color: #374151; margin-top: 8px;">— The Infynux Academy Team</p>
                  </div>
                `,
              });
            }
          } catch (emailErr) {
            console.warn("Failed to send welcome email:", emailErr);
          }

          return Response.json(
            { success: true, message: "You're subscribed! 🎉" },
            { status: 200 }
          );
        } catch (err) {
          console.error("[newsletter]", err);
          return Response.json(
            { success: false, message: "Server error. Please try again." },
            { status: 500 }
          );
        }
      },
    },
  },
});
