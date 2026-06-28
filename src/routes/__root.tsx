import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "../components/site/Navbar";
import { Footer } from "../components/site/Footer";
import { MessageCircle } from "lucide-react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-[#800000]">404</h1>
        <h2 className="mt-4 font-display text-2xl font-semibold text-slate-800">Page not found</h2>
        <p className="mt-2 text-sm text-slate-500 font-outfit">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#800000] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_15px_rgba(128,0,0,0.25)] hover:bg-[#6B0000] hover:shadow-[0_4px_20px_rgba(128,0,0,0.35)] transition-all"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold text-slate-800">Something went wrong</h1>
        <p className="mt-2 text-sm text-slate-500 font-outfit">
          We hit an unexpected error. Try again, or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-xl bg-[#800000] px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_15px_rgba(128,0,0,0.2)] hover:bg-[#6B0000] transition-all"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

// Force light theme always
const THEME_SCRIPT = `
(function(){
  try {
    document.documentElement.setAttribute('data-theme', 'light');
  } catch(e) {}
})();
`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Infynux Academy — Learn, Build, Get Hired" },
      { name: "description", content: "Free learning roadmaps, tutorials, and remote internships in Web Dev, Cloud, App Dev, AI, and Digital Marketing." },
      { name: "author", content: "Infynux Academy" },
      { property: "og:title", content: "Infynux Academy — Learn, Build, Get Hired" },
      { property: "og:description", content: "Free learning roadmaps, tutorials, and remote internships for students and freshers in India." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Infynux Academy" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@infynux" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900;1,14..32,400;1,14..32,500&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-[#800000] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative flex min-h-screen flex-col bg-[#F8F6F4] text-slate-900 overflow-hidden font-sans">
        {/* Subtle soft maroon background orbs */}
        <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
          <div className="absolute -top-[20%] -left-[10%] h-[700px] w-[700px] rounded-full bg-[#800000]/5 blur-[120px]" />
          <div className="absolute bottom-0 right-[-5%] h-[600px] w-[600px] rounded-full bg-[#C41E3A]/5 blur-[100px]" />
          <div className="absolute top-[40%] left-[45%] h-[400px] w-[400px] rounded-full bg-[#FF6B6B]/3 blur-[80px]" />
        </div>

        <Navbar />
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <Footer />

        {/* Floating WhatsApp Button */}
        <a
          href="https://whatsapp.com/channel/0029VbCVGAtBVJkxGWCc4002"
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-[0_4px_15px_rgba(37,211,102,0.3)] transition-all hover:-translate-y-1 hover:bg-[#20bd5a] hover:shadow-[0_6px_20px_rgba(37,211,102,0.4)] font-orbitron"
          aria-label="Join student community on WhatsApp"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline">Join student community</span>
        </a>
      </div>
    </QueryClientProvider>
  );
}
