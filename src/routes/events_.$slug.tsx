import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Calendar, Clock, Globe, Users, Trophy, FileText, MonitorPlay, Hourglass, Ticket, ArrowLeft } from "lucide-react";
import { createSeoHead } from "@/lib/seo";
import { DEFAULT_EVENTS } from "./events";

export const Route = createFileRoute("/events_/$slug")({
  loader: ({ params }) => {
    return { slug: params.slug };
  },
  head: ({ loaderData }) => {
    const defaultEvent = DEFAULT_EVENTS.find(e => e.slug === loaderData?.slug);
    const title = defaultEvent ? `${defaultEvent.title} | Infynux Academy Events` : "Tech Event | Infynux Academy";
    const description = defaultEvent?.description || "Join our upcoming live tech events, workshops and bootcamps.";
    
    return createSeoHead({
      title,
      description,
      path: `/events/${loaderData?.slug}`,
      category: "Tech Webinars & Student Workshops",
    });
  },
  component: EventDetailsPage,
});

function EventDetailsPage() {
  const { slug } = useParams({ from: "/events_/$slug" });
  const defaultEvent = DEFAULT_EVENTS.find(e => e.slug === slug);
  const [event, setEvent] = useState<any>(defaultEvent || null);
  const [loading, setLoading] = useState(true);

  // Time calculations
  const [countdown, setCountdown] = useState({
    days: "00", hours: "00", mins: "00", secs: "00", hasStarted: false
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/events/slug/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setEvent(data);
        }
      } catch (e) {
        console.error("Failed to fetch event", e);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  useEffect(() => {
    if (!event) return;
    const targetDate = new Date(event.date).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance < 0) {
        setCountdown({ days: "00", hours: "00", mins: "00", secs: "00", hasStarted: true });
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        mins: String(mins).padStart(2, "0"),
        secs: String(secs).padStart(2, "0"),
        hasStarted: false,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [event]);

  if (loading && !event) {
    return (
      <div className="min-h-screen bg-[#05070B] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8DFF32] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#05070B] flex items-center justify-center flex-col text-white">
        <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
        <Link to="/events" className="text-[#8DFF32] hover:underline flex items-center gap-2">
          <ArrowLeft /> Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative selection:bg-[#8DFF32] selection:text-black bg-[#05070B] text-[#F7F9F5] font-sans overflow-x-hidden pt-20 pb-20">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[50vh] bg-[#8DFF32]/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen z-0"></div>
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0 hidden sm:block"></div>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-12 sm:space-y-16">
        
        {/* Breadcrumb */}
        <div className="animate-fade-up flex items-center gap-2 text-xs sm:text-sm font-medium text-[#8B96A8]">
          <Link to="/events" className="hover:text-white transition-colors flex items-center gap-1.5 sm:gap-2">
             <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Back to Events
          </Link>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span className="text-[#8DFF32] truncate max-w-[150px] sm:max-w-none">{event.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
            
            {/* Headline */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-4xl min-[375px]:text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] sm:leading-[1.1] text-white">
                {event.title.split(' ').map((word: string, i: number, arr: string[]) => {
                  if (i === arr.length - 1 || i === arr.length - 2) {
                    return <span key={i} className="text-[#8DFF32]">{word} </span>;
                  }
                  return word + " ";
                })}
              </h1>
              <p className="text-base min-[375px]:text-lg sm:text-xl text-[#8B96A8] font-medium leading-relaxed max-w-2xl">
                {event.description}
              </p>
            </div>

            {/* Quick Meta Row - 2 Column on Mobile */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-start sm:items-center gap-4 sm:gap-6 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-[#8B96A8] font-bold uppercase tracking-wider mb-0.5 truncate">Date</p>
                  <p className="text-sm font-bold text-white truncate">
                    {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-[#8B96A8] font-bold uppercase tracking-wider mb-0.5 truncate">Time</p>
                  <p className="text-sm font-bold text-white truncate">
                    {new Date(event.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
                <div className="w-10 h-10 shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-[#8B96A8] font-bold uppercase tracking-wider mb-0.5 truncate">Location</p>
                  <p className="text-sm font-bold text-white truncate">100% Online</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4 sm:pt-6 flex items-center">
              <a href={event.link || "#"} target="_blank" rel="noreferrer" className="w-full sm:w-auto h-14 min-h-[48px] px-8 inline-flex items-center justify-center gap-3 bg-[#8DFF32] text-[#05070B] text-sm sm:text-base font-extrabold rounded-full hover:bg-white transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(141,255,50,0.2)] hover:shadow-[0_0_30px_rgba(141,255,50,0.4)]">
                Register for Event
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              </a>
            </div>
          </div>

          {/* Right: Event Poster */}
          <div className="lg:col-span-5 animate-fade-up relative [perspective:1000px] mx-auto w-full max-w-[400px] sm:max-w-none mt-4 lg:mt-0" style={{ animationDelay: '300ms' }}>
            <div className="absolute inset-0 bg-[#8DFF32]/20 blur-[50px] rounded-full animate-[pulseGlow_3s_ease-in-out_infinite_alternate] pointer-events-none"></div>
            
            <div className="transition-transform duration-500 hover:rotate-y-[-5deg] hover:rotate-x-[2deg] hover:scale-[1.02] relative z-10 bg-white/5 backdrop-blur-xl p-2 sm:p-3 rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] border border-white/10">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#0B1220] group">
                <img src={event.imageUrl || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200"} alt={event.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-transparent to-transparent opacity-90"></div>
                
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <div>
                    <p className="text-[#8DFF32] font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-1 shadow-black drop-shadow-md">Exclusive Event</p>
                    <p className="text-white font-extrabold text-lg sm:text-xl shadow-black drop-shadow-md leading-tight">{event.title}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bento Box Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 pt-8 sm:pt-12 border-t border-white/5">
          
          {/* Main Details (Spans 2 columns) */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 p-5 min-[375px]:p-6 sm:p-8 rounded-3xl animate-fade-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
              <FileText className="text-[#8DFF32] w-5 h-5 sm:w-6 sm:h-6" />
              About the Event
            </h2>
            <div className="prose prose-invert max-w-none text-sm sm:text-base text-[#8B96A8] leading-relaxed">
              <p>{event.description}</p>
              
              <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 hover:bg-white/10 transition-colors">
                  <Users className="text-[#8DFF32] mt-0.5 w-5 h-5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Open to All</h4>
                    <p className="text-xs text-[#8B96A8] mt-1 leading-relaxed">Participate solo or with friends. Everyone is welcome to join and learn.</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 hover:bg-white/10 transition-colors">
                  <Trophy className="text-[#19C96B] mt-0.5 w-5 h-5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Skill Up</h4>
                    <p className="text-xs text-[#8B96A8] mt-1 leading-relaxed">Gain industry insights, hands-on knowledge and elevate your tech career.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Widgets (Spans 1 column) */}
          <div className="space-y-5 sm:space-y-6 lg:col-span-1">
            
            {/* Live Countdown Widget */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 min-[375px]:p-6 sm:p-6 rounded-3xl animate-fade-up relative overflow-hidden" style={{ animationDelay: '300ms' }}>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#8DFF32]/10 rounded-full blur-2xl"></div>
              
              <h3 className="text-xs sm:text-sm font-bold text-[#8B96A8] uppercase tracking-wider mb-4 flex items-center gap-2">
                {!countdown.hasStarted && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                {countdown.hasStarted ? 'Event Status' : 'Event Starts In'}
              </h3>
              
              {countdown.hasStarted ? (
                <div className="py-4 text-[#8DFF32] font-bold uppercase tracking-widest text-center">
                  Event has started!
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2 sm:gap-3 text-center">
                  <div className="flex-1 bg-[#05070B] rounded-xl p-2 min-[375px]:p-3 border border-white/10 shadow-inner">
                    <span className="block text-xl min-[375px]:text-2xl font-black text-white">{countdown.days}</span>
                    <span className="text-[9px] min-[375px]:text-[10px] text-[#8B96A8] font-bold uppercase">Days</span>
                  </div>
                  <div className="flex-1 bg-[#05070B] rounded-xl p-2 min-[375px]:p-3 border border-white/10 shadow-inner">
                    <span className="block text-xl min-[375px]:text-2xl font-black text-white">{countdown.hours}</span>
                    <span className="text-[9px] min-[375px]:text-[10px] text-[#8B96A8] font-bold uppercase">Hrs</span>
                  </div>
                  <div className="flex-1 bg-[#05070B] rounded-xl p-2 min-[375px]:p-3 border border-white/10 shadow-inner">
                    <span className="block text-xl min-[375px]:text-2xl font-black text-white">{countdown.mins}</span>
                    <span className="text-[9px] min-[375px]:text-[10px] text-[#8B96A8] font-bold uppercase">Min</span>
                  </div>
                  <div className="flex-1 bg-[#05070B] rounded-xl p-2 min-[375px]:p-3 border border-white/10 shadow-[0_0_10px_rgba(141,255,50,0.1)]">
                    <span className="block text-xl min-[375px]:text-2xl font-black text-[#8DFF32]">{countdown.secs}</span>
                    <span className="text-[9px] min-[375px]:text-[10px] text-[#8DFF32]/70 font-bold uppercase">Sec</span>
                  </div>
                </div>
              )}
            </div>

            {/* Event Details Summary */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 min-[375px]:p-6 sm:p-6 rounded-3xl animate-fade-up" style={{ animationDelay: '400ms' }}>
              <ul className="space-y-4">
                <li className="flex items-center justify-between pb-4 border-b border-white/5">
                  <span className="text-sm text-[#8B96A8] flex items-center gap-2">
                    <MonitorPlay className="w-4 h-4" /> Format
                  </span>
                  <span className="text-sm font-bold text-white">100% Online</span>
                </li>
                <li className="flex items-center justify-between pb-4 border-b border-white/5">
                  <span className="text-sm text-[#8B96A8] flex items-center gap-2">
                    <Hourglass className="w-4 h-4" /> Duration
                  </span>
                  <span className="text-sm font-bold text-white">Event</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm text-[#8B96A8] flex items-center gap-2">
                    <Ticket className="w-4 h-4" /> Entry Fee
                  </span>
                  <span className="px-2 py-1 bg-[#8DFF32]/10 text-[#8DFF32] text-xs font-bold rounded uppercase">Free</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </main>
      
      <style>{`
        @keyframes pulseGlow {
          0% { opacity: 0.3; filter: blur(30px); }
          100% { opacity: 0.6; filter: blur(50px); }
        }
      `}</style>
    </div>
  );
}
