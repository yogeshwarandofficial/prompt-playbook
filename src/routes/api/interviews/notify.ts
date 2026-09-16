import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

/**
 * POST /api/interviews/notify  — thin proxy to NestJS.
 * The actual email is now sent automatically by InterviewsService.scheduleInterview().
 * This route remains only to support the "Resend Invitation" button in the admin UI.
 */
export const Route = createFileRoute("/api/interviews/notify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { applicantName, applicantEmail, scheduledAt, meetingLink } = body ?? {};

          if (!applicantEmail || !applicantName || !scheduledAt) {
            return Response.json(
              { success: false, message: "Missing required fields." },
              { status: 400 }
            );
          }

          // Re-use the backend EmailService via a direct Resend call for manual resends
          const API_URL = process.env.VITE_API_URL || "http://localhost:3001";

          const backendRes = await fetch(`${API_URL}/api/interviews/resend-invite`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ applicantName, applicantEmail, scheduledAt, meetingLink }),
          });

          const data = await backendRes.json().catch(() => ({}));
          return Response.json(data, { status: backendRes.ok ? 200 : backendRes.status });
        } catch (err) {
          console.error("[api/interviews/notify proxy]", err);
          return Response.json(
            { success: false, message: "Server error sending notification." },
            { status: 500 }
          );
        }
      },
    },
  },
});
