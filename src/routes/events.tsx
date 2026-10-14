import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, ExternalLink, ChevronRight, MapPin, CheckCircle2 } from "lucide-react";
import { createSeoHead, getBreadcrumbSchema } from "@/lib/seo";
import { EVENTS_PAGE_KEYWORDS } from "@/lib/seo-keywords";
import { JsonLd } from "@/components/site/JsonLd";

export const Route = createFileRoute("/events")({
  head: () =>
    createSeoHead({
      title: "Tech Workshops, Webinars & Developer Events 2026 | Infynux Academy",
      description:
        "Join free interactive tech webinars, live coding workshops, and developer bootcamps hosted by Infynux Academy mentors. Master full stack web development, AWS cloud, and AI engineering.",
      path: "/events",
      keywords: EVENTS_PAGE_KEYWORDS,
      category: "Tech Webinars & Student Workshops",
    }),
  component: EventsPage,
});

export const DEFAULT_EVENTS = [
  {
    id: "tech-webinar-1",
    title: "Mastering Full Stack Web Development",
    description: "Join our interactive webinar to explore the modern tech stack including React, Node.js, and MongoDB. Learn how to build scalable applications from scratch.",
    date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: "/ui_web.png",
    link: "https://infynux.com",
    slug: "mastering-full-stack-web-development"
  },
  {
    id: "cloud-workshop-1",
    title: "AWS Cloud Infrastructure Workshop",
    description: "A hands-on workshop covering AWS core services, serverless architecture, and deployment strategies. Perfect for beginners and intermediate developers.",
    date: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: "/ui_cloud.png",
    link: "https://infynux.com",
    slug: "aws-cloud-infrastructure-workshop"
  },
  {
    id: "ai-talk-1",
    title: "The Future of AI & Automation",
    description: "Discover how AI is shaping the future of tech. We'll discuss LLMs, prompt engineering, and building intelligent automated workflows.",
    date: new Date(new Date().getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: "/ui_ai.png",
    link: "https://infynux.com",
    slug: "future-of-ai-and-automation"
  },
  {
    id: "infyhackathon-1",
    title: "INFYHACKATHON 1.0 - AI & Cloud Innovation",
    description: "",
    date: "2026-02-15T09:00:00.000Z",
    imageUrl: null,
    link: "100% Online (Discord & Zoom)",
    slug: "infyhackathon-1-0"
  }
];

function formatEventLocation(link?: string | null): string {
  if (!link || link.trim() === "") return "100% Online";
  if (link.startsWith("http://") || link.startsWith("https://")) {
    return "100% Online (Virtual)";
  }
  return link;
}

function EventsPage() {
  const [events, setEvents] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
  ]);

  useEffect(() => {
    const fetchEvents = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout for cold starts

      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/events`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setEvents(data);
            return;
          }
        }
        // Fallback to defaults if empty or error
        setEvents(DEFAULT_EVENTS);
      } catch (e) {
        console.error("Failed to fetch events:", e);
        setEvents(DEFAULT_EVENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const allEvents = events || DEFAULT_EVENTS;
  const now = new Date().getTime();

  // Separate upcoming and completed events by date
  const upcomingEvents = allEvents.filter(
    (e) => new Date(e.date).getTime() >= now
  );
  const completedEvents = allEvents.filter(
    (e) => new Date(e.date).getTime() < now
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] font-sans selection:bg-indigo-500/30">
      <JsonLd schema={breadcrumbSchema} />
      <main className="flex-grow pt-32 pb-24">
        <div className="mx-auto max-w-6xl px-6 space-y-16">
          {/* Breadcrumb & Page Header */}
          <div>
            <nav aria-label="Breadcrumb" className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">Home</Link>
                </li>
                <ChevronRight className="h-3 w-3 text-slate-600" />
                <li className="text-slate-300">Events</li>
              </ol>
            </nav>

            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold font-display text-white sm:text-5xl lg:text-6xl tracking-tight mb-4">
                Academy <span className="bg-[length:200%_auto] animate-text-shine bg-gradient-to-r from-emerald-400 via-primary to-emerald-400 bg-clip-text text-transparent">Events</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl font-light">
                Join our exclusive webinars, workshops, and tech talks. Connect with industry experts and elevate your skills.
              </p>
            </div>
          </div>

          {/* 1. UPCOMING EVENTS SECTION */}
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div>
                <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2.5">
                  Upcoming Events
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {upcomingEvents.length} Active
                  </span>
                </h2>
                <p className="text-sm text-slate-400 mt-1">Register and participate in live sessions</p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="group relative flex flex-col rounded-3xl bg-slate-900/50 border border-slate-800 overflow-hidden animate-pulse">
                    <div className="aspect-[16/9] bg-slate-800/50"></div>
                    <div className="flex flex-col flex-grow p-6">
                      <div className="w-1/3 h-3 bg-slate-800 rounded mb-4"></div>
                      <div className="w-3/4 h-6 bg-slate-800 rounded mb-3"></div>
                      <div className="w-full h-16 bg-slate-800/50 rounded mb-6 flex-grow"></div>
                      <div className="w-full h-10 bg-slate-800 rounded-xl"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-slate-900/30 rounded-3xl border border-slate-800">
                <Calendar className="w-12 h-12 text-slate-600 mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No upcoming events right now</h3>
                <p className="text-slate-400 text-sm text-center">New workshops and hackathons will be announced soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="group relative flex flex-col rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden">
                    {event.imageUrl ? (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img 
                          src={event.imageUrl} 
                          alt={event.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] bg-slate-800/80 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-slate-600" />
                      </div>
                    )}
                    <div className="flex flex-col flex-grow p-6">
                      <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString(undefined, { 
                          weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
                        })}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 leading-tight font-display">{event.title}</h3>
                      <p className="text-slate-400 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
                        {event.description}
                      </p>
                      {event.slug ? (
                        <Link 
                          to="/events/$slug"
                          params={{ slug: event.slug }}
                          className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors text-sm"
                        >
                          View Details <ExternalLink className="w-4 h-4" />
                        </Link>
                      ) : event.link && (
                        <a 
                          href={event.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors text-sm"
                        >
                          View Details <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 2. COMPLETED EVENTS SECTION */}
          {/* Displays only: Name, When conducted, Where */}
          <section className="space-y-6 pt-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div>
                <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2.5">
                  Completed Events
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {completedEvents.length} Past
                  </span>
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Past workshops, webinars, and hackathons conducted by Infynux Academy
                </p>
              </div>
            </div>

            {completedEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-slate-900/20 rounded-3xl border border-slate-800/60">
                <p className="text-slate-500 text-sm">No completed events in the archive yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {completedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="relative flex flex-col justify-between p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all shadow-sm"
                  >
                    <div>
                      {/* Status Pill */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                          <CheckCircle2 className="w-3 h-3" />
                          Conducted
                        </span>
                      </div>

                      {/* 1. Name */}
                      <h3 className="text-lg font-bold text-white mb-4 leading-snug font-display">
                        {event.title}
                      </h3>
                    </div>

                    {/* 2. When & 3. Where Conducted */}
                    <div className="pt-4 border-t border-slate-800/60 space-y-2.5 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-400/80 shrink-0" />
                        <span>
                          <strong className="text-slate-300 font-medium">When:</strong>{" "}
                          {new Date(event.date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-400/80 shrink-0" />
                        <span className="truncate">
                          <strong className="text-slate-300 font-medium">Where:</strong>{" "}
                          {formatEventLocation(event.link)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
