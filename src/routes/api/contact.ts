import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

/**
 * POST /api/contact  — thin proxy to the NestJS ContactController.
 * All business logic (rate-limiting, DB persistence, email sending) lives in the backend.
 */
export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const API_URL = process.env.VITE_API_URL || "http://localhost:3001";

          const ip =
            request.headers.get("x-forwarded-for")?.split(",")[0] ||
            request.headers.get("x-real-ip") ||
            "unknown";

          const backendRes = await fetch(`${API_URL}/api/contact`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-forwarded-for": ip,
            },
            body: JSON.stringify(body),
          });

          const data = await backendRes.json().catch(() => ({}));

          return Response.json(data, { status: backendRes.status });
        } catch (err) {
          console.error("[api/contact proxy]", err);
          return Response.json(
            { success: false, message: "Server error. Please try again." },
            { status: 500 }
          );
        }
      },
    },
  },
});
