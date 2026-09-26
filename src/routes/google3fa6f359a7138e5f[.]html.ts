import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/google3fa6f359a7138e5f.html")({
  server: {
    handlers: {
      GET: async () => {
        return new Response("google-site-verification: google3fa6f359a7138e5f.html\n", {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
