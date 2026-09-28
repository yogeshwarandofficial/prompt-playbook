import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Calendar, Clock, Globe, Users, Trophy, FileText, MonitorPlay, Hourglass, Ticket, ArrowLeft } from "lucide-react";
import { createSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/events_/$slug")({
  component: EventDetailsPage,
});

function EventDetailsPage() {
  const { slug } = useParams({ from: "/events_/$slug" });
  const [event, setEvent] = useState<any>(null);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center flex-col text-white">
        <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
        <Link to="/events" className="text-brand-green hover:underline flex items-center gap-2">
          <ArrowLeft /> Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative selection:bg-emerald-400 selection:text-black bg-[#0a0a0a] text-white font-sans overflow-x-hidden pt-20">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen z-0"></div>
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0"></div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-16">
        
        {/* Breadcrumb */}
        <div className="animate-fade-up flex items-center gap-2 text-sm font-medium text-gray-500">
          <Link to="/events" className="hover:text-gray-300 transition-colors flex items-center gap-2">
             <ArrowLeft className="w-5 h-5" /> Back to Events
          </Link>
          <span className="w-1 h-1 rounded-full bg-gray-600"></span>
          <span className="text-emerald-400">{event.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
            
          

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-white">
                {event.title.split(' ').map((word: string, i: number, arr: string[]) => {
                  if (i === arr.length - 1 || i === arr.length - 2) {
                    return <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">{word} </span>;
                  }
                  return word + " ";
                })}
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 font-medium leading-relaxed max-w-2xl">
                {event.description}
              </p>
            </div>

            {/* Quick Meta Row */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
                  <Calendar className="text-xl w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Date</p>
                  <p className="text-sm font-semibold text-white">
                    {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
                  <Clock className="text-xl w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Time</p>
                  <p className="text-sm font-semibold text-white">
                    {new Date(event.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
                  <Globe className="text-xl w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Location</p>
                  <p className="text-sm font-semibold text-white">100% Online</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4 flex items-center gap-4">
              <a href={event.link || "#"} target="_blank" rel="noreferrer" className="h-14 px-8 inline-flex items-center justify-center gap-3 bg-white text-black text-base font-extrabold rounded-full hover:bg-gray-200 transition-all transform hover:-translate-y-1 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                Register for Event
                <ArrowUpRight className="text-lg w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right: Event Poster */}
          <div className="lg:col-span-5 animate-fade-up relative [perspective:1000px]" style={{ animationDelay: '300ms' }}>
            <div className="absolute inset-0 bg-emerald-400/20 blur-[60px] rounded-full animate-[pulseGlow_3s_ease-in-out_infinite_alternate] pointer-events-none"></div>
            
            <div className="transition-transform duration-500 hover:rotate-y-[-5deg] hover:rotate-x-[2deg] hover:scale-[1.02] relative z-10 bg-[#18181b]/60 backdrop-blur-xl p-2 rounded-[2rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] border border-white/10">
              <div className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-gray-900 group">
                <img src={event.imageUrl || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200"} alt={event.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1s] ease-out" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80"></div>
                
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1 shadow-black drop-shadow-md">Exclusive Event</p>
                    <p className="text-white font-extrabold text-xl shadow-black drop-shadow-md">{event.title}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bento Box Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/5">
          
          {/* Main Details (Spans 2 columns) */}
          <div className="md:col-span-2 bg-[#18181b]/60 backdrop-blur-xl border border-white/5 p-8 rounded-[24px] animate-fade-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <FileText className="text-emerald-400 text-2xl w-6 h-6" />
              About the Event
            </h2>
            <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed">
              <p>{event.description}</p>
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                  <Users className="text-emerald-400 text-xl mt-0.5 w-6 h-6" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Open to All</h4>
                    <p className="text-xs text-gray-500 mt-1">Participate solo or with friends. Everyone is welcome to join and learn.</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                  <Trophy className="text-amber-400 text-xl mt-0.5 w-6 h-6" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Skill Up</h4>
                    <p className="text-xs text-gray-500 mt-1">Gain industry insights, hands-on knowledge and elevate your tech career.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Widgets (Spans 1 column) */}
          <div className="space-y-6 md:col-span-1">
            
            {/* Live Countdown Widget */}
            <div className="bg-[#18181b]/60 backdrop-blur-xl border border-white/5 p-6 rounded-[24px] animate-fade-up relative overflow-hidden" style={{ animationDelay: '300ms' }}>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl"></div>
              
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                {!countdown.hasStarted && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                {countdown.hasStarted ? 'Event Status' : 'Event Starts In'}
              </h3>
              
              {countdown.hasStarted ? (
                <div className="py-4 text-emerald-400 font-bold uppercase tracking-widest text-center">
                  Event has started!
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-[#0a0a0a] rounded-lg p-2 border border-white/10">
                    <span className="block text-2xl font-black text-white">{countdown.days}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Days</span>
                  </div>
                  <div className="bg-[#0a0a0a] rounded-lg p-2 border border-white/10">
                    <span className="block text-2xl font-black text-white">{countdown.hours}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Hrs</span>
                  </div>
                  <div className="bg-[#0a0a0a] rounded-lg p-2 border border-white/10">
                    <span className="block text-2xl font-black text-white">{countdown.mins}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Min</span>
                  </div>
                  <div className="bg-[#0a0a0a] rounded-lg p-2 border border-white/10">
                    <span className="block text-2xl font-black text-emerald-400">{countdown.secs}</span>
                    <span className="text-[10px] text-emerald-400/70 font-bold uppercase">Sec</span>
                  </div>
                </div>
              )}
            </div>

            {/* Event Details Summary */}
            <div className="bg-[#18181b]/60 backdrop-blur-xl border border-white/5 p-6 rounded-[24px] animate-fade-up" style={{ animationDelay: '400ms' }}>
              <ul className="space-y-4">
                <li className="flex items-center justify-between pb-4 border-b border-white/5">
                  <span className="text-sm text-gray-400 flex items-center gap-2">
                    <MonitorPlay className="w-4 h-4" /> Format
                  </span>
                  <span className="text-sm font-bold text-white">100% Online</span>
                </li>
                <li className="flex items-center justify-between pb-4 border-b border-white/5">
                  <span className="text-sm text-gray-400 flex items-center gap-2">
                    <Hourglass className="w-4 h-4" /> Duration
                  </span>
                  <span className="text-sm font-bold text-white">Event</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm text-gray-400 flex items-center gap-2">
                    <Ticket className="w-4 h-4" /> Entry Fee
                  </span>
                  <span className="px-2 py-1 bg-emerald-400/10 text-emerald-400 text-xs font-bold rounded uppercase">Free</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </main>
      
      <style>{`
        @keyframes pulseGlow {
          0% { opacity: 0.5; filter: blur(20px); }
          100% { opacity: 0.8; filter: blur(30px); }
        }
      `}</style>
    </div>
  );
}
