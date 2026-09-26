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
import { MessageCircle, BookOpen, Code2, Briefcase, Mail } from "lucide-react";
import { getOrganizationSchema, getWebSiteSchema, SITE_URL, DEFAULT_OG_IMAGE } from "../lib/seo";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-16">
      <div className="max-w-lg text-center">
        <span className="font-orbitron text-xs font-bold uppercase tracking-widest text-[#800000]">Error 404</span>
        <h1 className="mt-2 font-display text-7xl font-black text-slate-900 font-orbitron">404</h1>
        <h2 className="mt-4 font-display text-2xl font-bold text-slate-800">Page not found</h2>
        <p className="mt-2 text-sm text-slate-600 font-outfit max-w-sm mx-auto leading-relaxed">
          The requested page doesn't exist, has been moved, or the link may be outdated. Explore our core learning sections below:
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-[#800000] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_15px_rgba(128,0,0,0.25)] hover:bg-[#6B0000] transition-all"
          >
            Home
          </Link>
          <Link
            to="/roadmaps"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <BookOpen className="h-4 w-4" /> Roadmaps
          </Link>
          <Link
            to="/tutorials"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Code2 className="h-4 w-4" /> Tutorials
          </Link>
          <Link
            to="/internships"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Briefcase className="h-4 w-4" /> Internships
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Mail className="h-4 w-4" /> Contact
          </Link>
        </div>
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
            className="inline-flex items-center justify-center rounded-xl border border-black bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
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
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5" },
      { name: "google-site-verification", content: "Ma6YRQTl3lraifErr73MP_T7VPQpllsXy9FGWbEc8Gs" },
      { title: "Infynux Academy | Free Tech Roadmaps, Tutorials & Internships" },
      {
        name: "description",
        content:
          "Free structured learning roadmaps, practical coding tutorials, and verifiable remote internships in Web Dev, Cloud AWS, App Dev, AI & Automation, and Digital Marketing for students and freshers in India.",
      },
      { name: "author", content: "Infynux Academy" },
      { name: "theme-color", content: "#0A0A0A" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:site_name", content: "Infynux Academy" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Infynux Academy | Free Tech Roadmaps, Tutorials & Internships" },
      {
        property: "og:description",
        content:
          "Master in-demand tech skills with free structured roadmaps, hands-on tutorials, and verified remote internships for students and freshers.",
      },
      { property: "og:url", content: "https://www.infynuxacademy.in/" },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { property: "og:image:alt", content: "Infynux Academy — Free Tech Roadmaps, Tutorials & Internships" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@infynux" },
      { name: "twitter:creator", content: "@infynux" },
      { name: "twitter:title", content: "Infynux Academy | Free Tech Roadmaps, Tutorials & Internships" },
      {
        name: "twitter:description",
        content:
          "Free tech learning roadmaps, coding tutorials, and verifiable remote internships for college students and freshers in India.",
      },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: "https://www.infynuxacademy.in/" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900;1,14..32,400;1,14..32,500&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const orgSchema = getOrganizationSchema();
  const websiteSchema = getWebSiteSchema();

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="Ma6YRQTl3lraifErr73MP_T7VPQpllsXy9FGWbEc8Gs" />
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-black focus:font-orbitron"
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
  const router = useRouter();
  const hideNavbarAndFooter = router.state.location.pathname.startsWith("/intern-portal") || router.state.location.pathname.startsWith("/admin") || router.state.location.pathname === "/login";

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative flex min-h-screen flex-col bg-[#F9FAF5] text-slate-900 overflow-hidden font-sans">
        {/* Subtle mesh background blobs */}
        <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] mix-blend-multiply opacity-50" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-[120px] mix-blend-multiply opacity-50" />
        </div>

        {!hideNavbarAndFooter && <Navbar />}
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        {!hideNavbarAndFooter && <Footer />}

        {!hideNavbarAndFooter && (
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
        )}
      </div>
    </QueryClientProvider>
  );
}
