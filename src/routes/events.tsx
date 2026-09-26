import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, ExternalLink, ChevronRight } from "lucide-react";
import { createSeoHead, getBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/site/JsonLd";

export const Route = createFileRoute("/events")({
  head: () =>
    createSeoHead({
      title: "Tech Workshops, Webinars & Events | Infynux Academy",
      description:
        "Join free tech webinars, hands-on workshops, and developer events hosted by Infynux Academy. Learn full-stack development, AWS, AI, and career skills.",
      path: "/events",
    }),
  component: EventsPage,
});

function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
  ]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/events`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (e) {
        console.error("Failed to fetch events", e);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] font-sans selection:bg-indigo-500/30">
      <JsonLd schema={breadcrumbSchema} />
      <main className="flex-grow pt-32 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <ChevronRight className="h-3 w-3 text-slate-600" />
              <li className="text-slate-300">Events</li>
            </ol>
          </nav>

          <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl font-bold font-display text-white sm:text-5xl lg:text-6xl tracking-tight mb-4">
              Academy <span className="bg-[length:200%_auto] animate-text-shine bg-gradient-to-r from-emerald-400 via-primary to-emerald-400 bg-clip-text text-transparent">Events</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl font-light">
              Join our exclusive webinars, workshops, and tech talks. Connect with industry experts and elevate your skills.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-80 rounded-3xl bg-slate-800/50 animate-pulse border border-slate-700/50" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800">
              <Calendar className="w-16 h-16 text-slate-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No upcoming events</h3>
              <p className="text-slate-400 text-center">Check back later for new workshops and tech talks.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
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
                    {event.link && (
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
        </div>
      </main>
    </div>
  );
}
