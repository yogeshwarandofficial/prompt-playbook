import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
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

          // Parse domain / subdomain from the combined subdomain field
          const parts = subdomain.split("__");
          const domain = parts[0] ?? subdomain;
          const subdomainValue = parts[1] ?? null;

          const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';
          
          let resumeDataUri: string | undefined = undefined;
          if (resumeData && resumeType) {
            const cleanData = resumeData.replace(/\s+/g, "");
            let normalizedType = resumeType.toLowerCase().trim();
            if (normalizedType.includes("pdf")) {
              normalizedType = "application/pdf";
            } else if (normalizedType.includes("msword")) {
              normalizedType = "application/msword";
            } else if (
              normalizedType.includes("wordprocessingml") ||
              normalizedType.includes("docx")
            ) {
              normalizedType =
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            } else if (resumeName?.toLowerCase().endsWith(".pdf")) {
              normalizedType = "application/pdf";
            } else if (resumeName?.toLowerCase().endsWith(".docx")) {
              normalizedType =
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            } else if (resumeName?.toLowerCase().endsWith(".doc")) {
              normalizedType = "application/msword";
            }
            resumeDataUri = `data:${normalizedType};base64,${cleanData}`;
          }
          
          const backendRes = await fetch(`${API_URL}/api/applications`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-forwarded-for': ip,
            },
            body: JSON.stringify({
              name: fullName,
              email: email.toLowerCase(),
              phone: mobile.replace(/\D/g, "").slice(-10),
              college: college,
              domainId: domain,
              specializationId: subdomainValue || undefined,
              resumeUrl: resumeDataUri,
              message: message || undefined
            })
          });

          if (!backendRes.ok) {
            let errorMsg = "Application submission failed. Please try again.";
            try {
              const errBody = await backendRes.json();
              if (Array.isArray(errBody.message)) {
                errorMsg = errBody.message.join(", ");
              } else if (typeof errBody.message === "string") {
                errorMsg = errBody.message;
              }
            } catch {
              const text = await backendRes.text().catch(() => "");
              if (text) errorMsg = text;
            }
            return Response.json(
              { success: false, message: errorMsg },
              { status: backendRes.status }
            );
          }

          const backendApp = await backendRes.json();
          const applicationId = backendApp.id;

          // Emails are now handled asynchronously by the backend service

          return Response.json(
            {
              success: true,
              message: "Application submitted successfully!",
              application_id: applicationId,
            },
            { status: 201 }
          );
        } catch (err: any) {
          console.error("[apply]", err);
          return Response.json(
            { success: false, message: err?.message || "Server error. Please try again." },
            { status: 500 }
          );
        }
      },
    },
  },
});
