import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Cloud,
  Code2,
  Cpu,
  Megaphone,
  Smartphone,
  CheckCircle2,
  Star,
  ChevronDown,
  Users,
  Award,
  Zap,
  Target,
  MessageSquare,
  Briefcase,
  Globe,
  Mail,
  Video,
  Compass,
  Rocket,
  ArrowLeftRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  ROADMAPS,
  TUTORIALS,
  TESTIMONIALS,
  FAQS,
  DOMAINS,
  DOMAIN_NAME_MAP,
  type DomainKey,
} from "@/data/content";
import { createSeoHead, getFaqSchema } from "@/lib/seo";
import { EDUTECH_MASTER_KEYWORDS } from "@/lib/seo-keywords";
import { JsonLd } from "@/components/site/JsonLd";

export const Route = createFileRoute("/")({
  head: () =>
    createSeoHead({
      title: "Infynux Academy | Free Tech Roadmaps, Programming Tutorials & Remote Internships",
      description:
        "India's premier free EdTech platform for college students and freshers. Master Full Stack Web Dev, Cloud AWS, Flutter, and AI with structured roadmaps, tutorials, and verifiable remote internships.",
      path: "/",
      keywords: EDUTECH_MASTER_KEYWORDS,
      category: "EdTech & Software Engineering Education",
    }),
  component: HomePage,
});

// Light-mode domain palette
const DOMAIN_KEY_COLORS: Record<DomainKey, string> = {
  web:       "rgba(156, 255, 59, 0.12)",
  cloud:     "rgba(182, 255, 74, 0.12)",
  app:       "rgba(217, 255, 176, 0.12)",
  ai:        "rgba(156, 255, 59, 0.12)",
  marketing: "rgba(182, 255, 74, 0.12)",
  video:     "rgba(255, 59, 156, 0.12)",
};

const DOMAIN_TEXT_COLORS: Record<DomainKey, string> = {
  web:       "#9CFF3B",
  cloud:     "#B6FF4A",
  app:       "#D9FFB0",
  ai:        "#9CFF3B",
  marketing: "#B6FF4A",
  video:     "#FF3B9C",
};

export function DomainBadge({ domain }: { domain: DomainKey }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 tracking-widest uppercase shadow-sm"
    >
      {DOMAIN_NAME_MAP[domain]}
    </span>
  );
}

function HomePage() {
  return (
    <div className="space-y-0">
      <JsonLd schema={getFaqSchema(FAQS)} />
      <HeroSection />
      <FeaturesSection />
      <DomainsSection />
      <ProcessSection />
      <FeaturedRoadmapsSection />
      <FeaturedTutorialsSection />
      <InternshipHighlightsSection />
      <TestimonialsSection />
      <FAQSection />
      <NewsletterSection />
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const parallaxContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Number Counter Animation for Stats
    const speed = 150;
    const timer = setTimeout(() => {
      const counters = document.querySelectorAll('.counter-val');
      counters.forEach(counter => {
        const updateCount = () => {
          const target = +(counter.getAttribute('data-target') || 0);
          const count = +counter.innerHTML;
          const inc = target / speed;
          if (count < target) {
            counter.innerHTML = Math.ceil(count + inc).toString();
            setTimeout(updateCount, 20);
          } else {
            counter.innerHTML = target.toString();
          }
        };
        updateCount();
      });
    }, 1200);

    // 2. Smooth Mouse Parallax Effect on Image Collage
    const container = parallaxContainerRef.current;
    if (!container) return;

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!window.matchMedia("(pointer: fine)").matches) return;
      
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const x = e.clientX - window.innerWidth / 2;
        const y = e.clientY - window.innerHeight / 2;
        
        const layers = container.querySelectorAll('.parallax-layer');
        layers.forEach(layer => {
          const s = parseFloat(layer.getAttribute('data-speed') || '1');
          const xOff = (x * s) / 80;
          const yOff = (y * s) / 80;
          (layer as HTMLElement).style.transform = `translate3d(${xOff}px, ${yOff}px, 0)`;
        });
      });
    };

    const handleMouseLeave = () => {
      if (!window.matchMedia("(pointer: fine)").matches) return;
      
      cancelAnimationFrame(animationFrameId);
      const layers = container.querySelectorAll('.parallax-layer');
      layers.forEach(layer => {
        const el = layer as HTMLElement;
        el.style.transform = `translate3d(0px, 0px, 0px)`;
        el.style.transition = 'transform 0.5s ease-out';
        setTimeout(() => { el.style.transition = ''; }, 500);
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pb-32 lg:pb-64 min-h-screen flex flex-col justify-center bg-[#f8fafc] z-10" aria-label="Hero">
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-200%) skewX(12deg); }
          100% { transform: translateX(200%) skewX(12deg); }
        }
        @keyframes text-shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .parallax-layer {
          will-change: transform;
        }
      `}</style>

      {/* Fluid Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_15%_50%,_rgba(220,252,231,0.5),_transparent_25%),radial-gradient(circle_at_85%_30%,_rgba(240,253,244,0.8),_transparent_25%)] blur-[60px] pointer-events-none" />
      
      {/* Animated Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-[pulse_10s_infinite] pointer-events-none" />
      <div className="absolute top-40 left-20 w-72 h-72 bg-emerald-50 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-[pulse_10s_infinite_2s] pointer-events-none" />

      <div className="container-page relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center max-w-7xl mx-auto w-full">
          
          <div className="relative z-10 space-y-8 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
              
             

              {/* Massive Typography with Animated Gradient */}
              <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-black leading-[1.05] tracking-tight text-slate-900 animate-fade-up font-display" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
                  LEARN.<br />
                  <span className="bg-gradient-to-r from-emerald-600 via-primary to-emerald-500 bg-[length:300%_auto] bg-clip-text text-transparent animate-[text-shimmer_3s_ease-out_infinite_alternate] inline-block transform hover:scale-105 hover:rotate-1 transition-all duration-300 cursor-default">BUILD.</span><br />
                  GET HIRED.
              </h1>

              {/* Subheading with decorative accents */}
              <div className="animate-fade-up space-y-5 relative" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-2 font-outfit">
                      Free Tech Roadmaps
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Tutorials
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Internships
                  </h2>
                  <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 font-outfit">
                      Access structured roadmaps, hands-on tutorials, and real remote internships. Bridge the gap between university theory and industrial excellence.
                  </p>
              </div>

              {/* Action Buttons */}
              <div className="animate-fade-up flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
                  <Link to="/roadmaps" className="w-full sm:w-auto px-8 py-4 bg-primary text-black text-base font-bold rounded-full hover:bg-secondary hover:shadow-[0_0_40px_-10px_rgba(156,255,59,0.5)] transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group font-orbitron">
                      Explore Roadmaps
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/internships" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-800 text-base font-bold rounded-full border border-slate-200 hover:border-primary hover:text-black shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 font-orbitron">
                      <Briefcase className="w-5 h-5" />
                      Apply for Internship
                  </Link>
              </div>
          </div>

          {/* Right Visual Column (3 Photo Collage) */}
          <div 
            ref={parallaxContainerRef}
            className="relative w-full h-[450px] lg:h-[600px] flex items-center justify-center animate-fade-up mt-10 lg:mt-0 [perspective:1000px]" 
            style={{ animationDelay: '600ms', animationFillMode: 'both' }}
          >
              {/* Background decoration for the cluster */}
              <div className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-emerald-100 to-white rounded-full blur-3xl opacity-50 parallax-layer" data-speed="1" />

              {/* Image 1: Top Right */}
              <div className="absolute top-[5%] right-[5%] w-[45%] aspect-[4/3] z-10 parallax-layer" data-speed="-2">
                  <div className="w-full h-full animate-[float_8s_ease-in-out_1s_infinite]">
                      <img 
                          src="/heroimage3.avif" 
                          alt="Team collaboration" 
                          className="w-full h-full object-cover rounded-3xl border-[6px] border-white/90 shadow-[0_20px_40px_-10px_rgba(156,255,59,0.15)] transform rotate-6 hover:rotate-0 transition-transform duration-500"
                      />
                  </div>
              </div>

              {/* Image 2: Main Center */}
              <div className="relative z-20 w-[55%] aspect-[3/4] parallax-layer" data-speed="1.5">
                  <div className="w-full h-full animate-[float_6s_ease-in-out_infinite]">
                      <img 
                          src="/model.png" 
                          alt="Professional student with laptop" 
                          className="w-full h-full object-cover rounded-3xl border-[6px] border-white/90 shadow-[0_20px_40px_-10px_rgba(156,255,59,0.15)] transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                      />
                      
                      {/* Floating Glass Badge on main image */}
                      <div className="absolute -bottom-6 -right-10 md:-right-16 bg-white/70 backdrop-blur-md px-5 py-3 rounded-2xl shadow-[0_8px_32px_0_rgba(156,255,59,0.15)] border border-white/50">
                          <div className="flex items-center gap-1 mb-1">
                              {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="fill-amber-400 text-amber-400 w-4 h-4" />
                              ))}
                          </div>
                          <p className="text-lg font-black text-slate-900 tracking-tight leading-none font-orbitron">2+ Years</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1 font-outfit">Experience</p>
                      </div>
                  </div>
              </div>

              {/* Image 3: Bottom Left */}
              <div className="absolute bottom-[5%] left-[5%] w-[40%] aspect-square z-30 parallax-layer" data-speed="-1.5">
                  <div className="w-full h-full animate-[float_7s_ease-in-out_2.5s_infinite]">
                      <img 
                          src="/hero4.avif" 
                          alt="Focused coding session" 
                          className="w-full h-full object-cover rounded-[2rem] border-[6px] border-white/90 shadow-[0_20px_40px_-10px_rgba(156,255,59,0.15)] transform -rotate-6 hover:rotate-0 transition-transform duration-500"
                      />
                  </div>
              </div>
          </div>
      </div>

      {/* Floating Stats Glass Bar */}
      <div className="relative lg:absolute mt-16 lg:mt-0 bottom-auto lg:bottom-10 left-1/2 -translate-x-1/2 w-[95%] lg:w-[90%] max-w-5xl animate-fade-up z-20" style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
          <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-6 shadow-[0_8px_32px_0_rgba(156,255,59,0.15)] border border-white relative overflow-hidden">
              {/* Shimmer effect */}
              <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 -translate-x-[200%] animate-[shimmer_3s_infinite_ease-in-out]" />
              
              <div className="flex items-center gap-5 w-full md:w-auto group">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all duration-300">
                      <Users className="w-8 h-8" />
                  </div>
                  <div>
                      <p className="text-3xl font-black text-slate-900 tracking-tight font-orbitron"><span className="counter-val" data-target="100">0</span>+</p>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-outfit">Students Trained</p>
                  </div>
              </div>

              <div className="hidden md:block w-px h-16 bg-slate-200/60" />

              <div className="flex items-center gap-5 w-full md:w-auto group">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all duration-300">
                      <BookOpen className="w-8 h-8" />
                  </div>
                  <div>
                      <p className="text-3xl font-black text-slate-900 tracking-tight font-orbitron"><span className="counter-val" data-target="5">0</span></p>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-outfit">Specializations</p>
                  </div>
              </div>

              <div className="hidden md:block w-px h-16 bg-slate-200/60" />

              <div className="flex items-center gap-5 w-full md:w-auto group">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all duration-300">
                      <Award className="w-8 h-8" />
                  </div>
                  <div>
                      <p className="text-3xl font-black text-slate-900 tracking-tight font-orbitron"><span className="counter-val" data-target="100">0</span>%</p>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-outfit">Free Tuition</p>
                  </div>
              </div>
          </div>
      </div>
    </section>
  );
}


// ─── FEATURES ─────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: BookOpen, title: "Structured Roadmaps", desc: "Follow expert-curated paths from beginner to job-ready, designed for immediate industry deployment." },
  { icon: Code2, title: "Free Tutorials", desc: "Step-by-step documentation, code snippets, and deployment guides at zero cost." },
  { icon: Briefcase, title: "Real Internships", desc: "Work on live commercial applications with local clients, backed by professional guidance." },
  { icon: Award, title: "Verified Certificates", desc: "Secure a shareable digital certificate to instantly boost your CV and LinkedIn profiles." },
  { icon: MessageSquare, title: "Mentor Support", desc: "Clear roadblocks quickly with direct lines of communication to professional mentors." },
  { icon: Target, title: "Career Outcomes", desc: "Dedicated preparation focusing on technical portfolios, resume parsing, and mockup trials." },
];

function FeaturesSection() {
  const [lineActive, setLineActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(() => setLineActive(true), 500);
        observer.disconnect();
      }
    }, { threshold: 0.15 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full py-24 lg:py-32 px-6 overflow-hidden bg-[#050505] text-white" aria-labelledby="features-heading">
      
      {/* Subtle Ambient Glows & Grid */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-30"
        style={{
            backgroundSize: '40px 40px',
            backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
        }}
      />
      <div className="absolute top-1/4 left-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0 -translate-x-1/2" />
      
      {/* Floating Data Nodes */}
      <div className="absolute top-[30%] right-[20%] w-2 h-2 bg-primary rounded-full shadow-[0_0_15px_rgba(156,255,59,0.8)] opacity-40 animate-[float_6s_ease-in-out_infinite] pointer-events-none" />
      <div className="absolute bottom-[40%] left-[10%] w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(156,255,59,0.8)] opacity-30 animate-[float_6s_ease-in-out_infinite_2s] pointer-events-none" />

      <div className="container-page relative z-10 max-w-[1280px] mx-auto">
        
        {/* Top Half: Text & Image Split */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 mb-24 lg:mb-32 relative">
            
            {/* Left: Typography & Messaging */}
            <div className="w-full lg:w-1/2 flex flex-col items-start text-left z-20 relative animate-fade-up">
                
                {/* Decorative subtle grid behind text */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-[radial-gradient(circle,rgba(156,255,59,0.15)_1px,transparent_1px)] bg-[length:8px_8px] opacity-50 pointer-events-none rounded-full" style={{ maskImage: 'radial-gradient(black,transparent)' }} />

                {/* Overline Badge */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-8 h-[2px] bg-primary"></div>
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary font-display">Why Infynux</span>
                </div>

                {/* Main Headline */}
                <h2 id="features-heading" className="font-display text-4xl md:text-5xl lg:text-[4rem] font-black tracking-tighter leading-[1.05] text-white mb-6 lg:mb-8">
                    Everything you need, <br className="hidden md:block" />
                    <span className="text-primary drop-shadow-[0_0_25px_rgba(156,255,59,0.2)] block mt-2">floating in one place.</span>
                </h2>

                {/* Supporting Text */}
                <p className="text-lg text-[#C7CBCE] font-bold leading-relaxed max-w-md font-outfit">
                    A premium learning ecosystem built to transfer you from raw skills to corporate hires.
                </p>
            </div>

            {/* Right: Immersive Visual */}
            <div className="w-full lg:w-1/2 relative animate-fade-up" style={{ animationDelay: '200ms' }}>
                <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square max-w-[500px] mx-auto lg:ml-auto flex items-center justify-end overflow-hidden rounded-3xl">
                    <img 
                        src="/whyinfyimg.avif" 
                        alt="Professional Developer Ecosystem" 
                        className="w-full h-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 ease-out object-right"
                        style={{ maskImage: 'linear-gradient(to left, black 40%, transparent 100%), linear-gradient(to top, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to left, black 40%, transparent 100%), linear-gradient(to top, black 60%, transparent 100%)' }}
                    />
                    {/* Overlay gradient to ensure perfect blend into background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/50 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />
                </div>
            </div>
        </div>

        {/* Bottom Half: The Learning Ecosystem */}
        <div className="relative z-20" id="ecosystem-container" ref={containerRef}>
            
            {/* Desktop Connection Line (Creates the "Ecosystem" journey for top row) */}
            <div className="hidden lg:block absolute top-[68px] left-[15%] right-[15%] h-[1px] border-t border-dashed border-gray-800 z-0" />
            <div 
              className="hidden lg:block absolute top-[68px] left-[15%] h-[1px] bg-primary shadow-[0_0_10px_rgba(156,255,59,0.8)] z-0 transition-all duration-[2s] ease-out" 
              style={{ width: lineActive ? '70%' : '0%' }} 
            />

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
                {FEATURES.map(({ icon: Icon, title, desc }, idx) => (
                  <div 
                    key={title}
                    className={`group relative p-8 lg:p-10 rounded-[24px] bg-[#0a0a0c] border border-[#1f1f22] hover:border-primary/30 hover:bg-[#0c0d10] transition-all duration-500 flex flex-col h-full hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(156,255,59,0.08)] overflow-hidden animate-fade-up`}
                    style={{ animationDelay: `${300 + (idx * 100)}ms` }}
                  >
                    {/* Internal Hover Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(156,255,59,0.05),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    
                    {/* Number Indicator */}
                    <div className="absolute top-6 right-8 text-4xl font-black text-white/[0.03] group-hover:text-white/[0.08] transition-colors duration-500 font-orbitron pointer-events-none">
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    <div className="relative z-10">
                        {/* Icon Container */}
                        <div className="w-16 h-16 rounded-2xl bg-[#121316] border border-white/5 flex items-center justify-center text-primary mb-10 group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(156,255,59,0.05)] group-hover:shadow-[0_0_30px_rgba(156,255,59,0.3)]">
                            <Icon className="h-8 w-8" strokeWidth={2} />
                        </div>
                        
                        <h3 className="font-display text-2xl font-bold text-white mb-4 tracking-tight">{title}</h3>
                        <p className="text-[#C7CBCE] leading-[1.7] font-medium text-sm md:text-base pr-4 font-outfit">
                            {desc}
                        </p>
                    </div>
                  </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}

// ─── DOMAINS ──────────────────────────────────────────────────────────────────
const DOMAIN_ICONS: Record<DomainKey, React.ReactNode> = {
  web:       <Code2 className="h-6 w-6" />,
  cloud:     <Cloud className="h-6 w-6" />,
  app:       <Smartphone className="h-6 w-6" />,
  ai:        <Cpu className="h-6 w-6" />,
  marketing: <Megaphone className="h-6 w-6" />,
  video:     <Video className="h-6 w-6" />,
};

function DomainsSection() {
  const tutorialCounts = TUTORIALS.reduce<Record<string, number>>((acc, t) => {
    acc[t.domain] = (acc[t.domain] || 0) + 1;
    return acc;
  }, {});

  const cardMargins = ["", "lg:mt-6", "lg:-mt-4", "lg:mt-8", "lg:-mt-2"];

  return (
    <section className="relative overflow-hidden py-24 lg:py-32 bg-[#fbfcfd] text-[#0a0f1c]" aria-labelledby="domains-heading">
      
      <style>{`
        @keyframes dashFlow {
          to { stroke-dashoffset: -1000; }
        }
        .animate-flow {
          animation: dashFlow 20s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Ambient Lighting & Background Details */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-40" 
        style={{ backgroundImage: 'radial-gradient(rgba(10, 15, 28, 0.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#fbfcfd] to-transparent pointer-events-none z-0" />
      
      {/* Soft Glowing Orbs */}
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none animate-[pulse_4s_ease-in-out_infinite_alternate] z-0" />
      <div className="absolute bottom-[20%] right-[5%] w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[120px] pointer-events-none animate-[pulse_4s_ease-in-out_infinite_alternate] z-0" style={{ animationDelay: '2s' }} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 lg:mb-24 px-4 lg:px-12 relative z-20">
            
            {/* Typography block */}
            <div className="max-w-2xl animate-fade-up">
                <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                    <span className="w-6 h-[2px] bg-primary rounded-full"></span>
                    <span className="text-sm font-bold uppercase tracking-wider text-[#0a0f1c] font-outfit">Popular Domains</span>
                </div>
                
                <h2 id="domains-heading" className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0a0f1c] mb-6 leading-[1.1] font-display">
                    Choose your <br className="hidden sm:block" />
                    <span className="relative inline-block">
                        learning path
                        {/* Subtle underline accent */}
                        <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00034 7.00004C48.5 2.50001 138 -2.49998 198.5 7.00004" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
                    </span>
                </h2>
                
                <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-lg font-outfit">
                    Explore five in-demand disciplines with structured roadmaps tuned for immediate industrial application.
                </p>
            </div>

            {/* Large Learning/Career Navigation Illustration */}
            <div className="hidden md:flex relative w-[300px] lg:w-[450px] h-[250px] lg:h-[300px] animate-fade-up items-center justify-end" style={{ animationDelay: '200ms' }}>
                {/* Ambient glow */}
                <div className="absolute inset-0 bg-primary/15 blur-[60px] rounded-full animate-[pulse_4s_ease-in-out_infinite_alternate] z-0" />
                
                {/* Main Image */}
                <div className="relative w-full max-w-[380px] h-full rounded-[2rem] overflow-hidden shadow-2xl border border-white/60 animate-[float_6s_ease-in-out_infinite] z-10">
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" alt="Students collaborating and learning" className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0f1c]/30 via-transparent to-transparent" />
                </div>

                {/* Floating Compass Badge (Bottom Left) */}
                <div className="absolute -bottom-4 lg:-bottom-6 -left-4 lg:left-0 bg-white/95 backdrop-blur-xl border border-slate-100 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] p-4 rounded-2xl flex items-center gap-3 animate-[float_6s_ease-in-out_infinite] z-20" style={{ animationDelay: '1.2s' }}>
                    <div className="w-12 h-12 bg-[#f0fdf4] text-primary rounded-[14px] flex items-center justify-center border border-[#dcfce7]">
                        <Compass className="w-6 h-6" />
                    </div>
                    <div className="pr-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 font-outfit">Navigate</p>
                        <p className="text-sm font-black text-slate-800 leading-none font-display">Career Path</p>
                    </div>
                </div>
                
                {/* Floating Accent Node (Top Right) */}
                <div className="absolute top-8 -right-4 lg:right-6 w-12 h-12 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center animate-[float_6s_ease-in-out_infinite] z-20" style={{ animationDelay: '0.6s' }}>
                    <Rocket className="text-primary w-5 h-5" />
                </div>
            </div>
        </div>

        {/* Learning Path Carousel/Grid Container */}
        <div className="relative w-full">
            
            {/* The Continuous Pathway (Desktop Only) */}
            <div className="hidden lg:block absolute top-[45%] left-10 right-10 h-0.5 z-0 pointer-events-none">
                {/* Static dashed background line */}
                <svg width="100%" height="100%" className="absolute inset-0 overflow-visible" preserveAspectRatio="none">
                    <path d="M 0,0 C 200,40 400,-40 600,0 S 1000,-40 1200,0 L 2000,0" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="8 8" vectorEffect="non-scaling-stroke"></path>
                </svg>
                {/* Animated flowing line on top */}
                <svg width="100%" height="100%" className="absolute inset-0 overflow-visible opacity-50" preserveAspectRatio="none">
                    <path d="M 0,0 C 200,40 400,-40 600,0 S 1000,-40 1200,0 L 2000,0" fill="none" stroke="#4ade80" strokeWidth="2" strokeDasharray="10 20" className="animate-flow" vectorEffect="non-scaling-stroke"></path>
                </svg>
            </div>

            {/* Cards Wrapper (Horizontal scroll on mobile, Grid on desktop) */}
            <div className="flex lg:grid lg:grid-cols-5 gap-4 sm:gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory no-scrollbar pb-12 pt-4 px-4 lg:px-0 relative z-10">
                
                {DOMAINS.filter(d => d.key !== 'video').map((domain, idx) => (
                  <Link 
                    key={domain.key}
                    to="/roadmaps" 
                    className={`animate-fade-up group relative flex-shrink-0 w-[260px] lg:w-auto snap-center bg-white rounded-[24px] p-8 border border-slate-200 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(156,255,59,0.2)] hover:-translate-y-1.5 hover:border-primary/40 transition-all duration-500 ease-out flex flex-col items-center text-center overflow-hidden ${cardMargins[idx] || ""}`} 
                    style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                  >
                      {/* Hover Glow Overlay */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(156,255,59,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      
                      <div className="w-16 h-16 rounded-[18px] bg-[#f0fdf4] border border-[#dcfce7] text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-[#0a0f1c] transition-all duration-500 shadow-sm relative z-10">
                          <div className="scale-150">{DOMAIN_ICONS[domain.key]}</div>
                      </div>
                      
                      <span className="text-sm font-extrabold text-slate-800 mb-2 relative z-10 font-orbitron">100+</span>
                      <h3 className="text-xl font-black text-[#0a0f1c] mb-5 leading-tight tracking-tight relative z-10 group-hover:text-primary transition-colors font-display">
                          {domain.name.split(' ').map((word, wIdx) => (
                              <span key={wIdx}>
                                  {word}
                                  {wIdx === 0 && <br/>}
                                  {wIdx > 0 && wIdx < domain.name.split(' ').length - 1 && ' '}
                              </span>
                          ))}
                      </h3>
                      
                      <div className="mt-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 tracking-[0.1em] uppercase relative z-10 font-outfit">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-primary transition-colors"></span>
                          {tutorialCounts[domain.key] || 0} Tutorials
                      </div>
                  </Link>
                ))}

            </div>
            
            {/* Mobile Swipe Hint */}
            <div className="lg:hidden flex justify-center mt-2 pb-6 animate-fade-up" style={{ animationDelay: '600ms' }}>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-200">
                    <ArrowLeftRight className="w-3 h-3" /> Swipe to explore
                </div>
            </div>

        </div>
      </div>
    </section>
  );
}

// ─── PROCESS ──────────────────────────────────────────────────────────────────
const STEPS = [
  { n: "01", icon: Compass, title: "Choose Domain", desc: "Select a core engineering discipline matching your career vision." },
  { n: "02", icon: BookOpen, title: "Study Roadmap", desc: "Navigate the step-by-step structured knowledge paths." },
  { n: "03", icon: Code2, title: "Build Projects", desc: "Acquire real-world logic patterns via sandbox tutorials." },
  { n: "04", icon: Briefcase, title: "Intern & Certify", desc: "Secure a remote internship and land verified credentials." },
];

function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-[#050505] relative overflow-hidden" aria-labelledby="process-heading">
      {/* Subtle radial green glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 rounded-[100%] blur-[120px] pointer-events-none" />
      
      {/* Minimal ambient dots */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="mb-20 md:mb-28 max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                <span className="w-6 h-[2px] bg-primary rounded-full"></span>
                <span className="text-sm font-bold uppercase tracking-wider text-primary font-outfit">The Pipeline</span>
            </div>
            
            <h2 id="process-heading" className="text-4xl md:text-5xl lg:text-[4rem] font-black tracking-tight text-white mb-6 leading-[1.05] font-display">
                How it works
            </h2>
            
            <p className="text-lg md:text-xl text-[#C7CBCE] font-bold leading-relaxed max-w-xl font-outfit">
                Your four-stage pathway from basic syntax to verified engineering credentials.
            </p>
        </div>

        <div className="relative">
          {/* Desktop Track */}
          <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-[#1a1a1a] rounded-full z-0" />
          <div 
            className="hidden md:block absolute top-[43px] h-[4px] w-16 bg-primary rounded-full shadow-[0_0_20px_rgba(156,255,59,1)] z-0 transition-all duration-700 ease-in-out motion-reduce:hidden"
            style={{ left: `calc(10% + ${(activeStep / 3)} * (80% - 64px))` }} 
          />

          {/* Mobile Track */}
          <div className="md:hidden absolute left-0 top-12 bottom-12 w-[2px] bg-[#1a1a1a] rounded-full z-0" />
          <div 
            className="md:hidden absolute -left-[1px] w-[4px] h-16 bg-primary rounded-full shadow-[0_0_20px_rgba(156,255,59,1)] z-0 transition-all duration-700 ease-in-out motion-reduce:hidden"
            style={{ top: `calc(48px + ${(activeStep / 3)} * (100% - 160px))` }} 
          />

          {/* Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8 pl-6 md:pl-0 relative z-10">
            {STEPS.map(({ n, icon: Icon, title, desc }, i) => {
              const isActive = activeStep === i;
              
              return (
                <div 
                  key={n} 
                  className={`relative group flex md:flex-col items-start gap-5 md:gap-6 p-6 md:p-8 rounded-[24px] border transition-all duration-500 ease-out 
                    ${isActive ? 'border-primary/40 bg-[#0a0a0c] shadow-[0_10px_40px_-15px_rgba(156,255,59,0.15)] md:-translate-y-2' : 'border-[#1f1f22] bg-[#050505] hover:border-primary/20 hover:bg-[#0a0a0c] hover:-translate-y-1'}`}
                >
                  {/* Active Glow */}
                  <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(156,255,59,0.08),transparent_70%)] rounded-[24px] transition-opacity duration-700 pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />

                  {/* Icon Container */}
                  <div className="relative flex-shrink-0 z-10">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isActive ? 'bg-primary/10 border-primary/30 text-primary scale-110 shadow-[0_0_15px_rgba(156,255,59,0.2)]' : 'bg-[#121316] border-[#2a2a2e] text-slate-500 group-hover:text-primary group-hover:border-primary/20'}`}>
                      <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex-1 pt-1 md:pt-4">
                    <span className={`block font-display text-4xl md:text-5xl font-black mb-2 transition-colors duration-500 font-orbitron ${isActive ? 'text-primary drop-shadow-[0_0_10px_rgba(156,255,59,0.3)]' : 'text-[#1a1a1a] group-hover:text-[#333]'}`}>
                      {n}
                    </span>
                    <h3 className={`font-display text-xl font-bold mb-2 transition-colors duration-300 tracking-tight ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                      {title}
                    </h3>
                    <p className="text-[13px] md:text-sm text-slate-400 leading-relaxed font-medium font-outfit">
                      {desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedRoadmapsSection() {
  return (
    <section className="relative w-full py-24 lg:py-32 px-5 sm:px-6 lg:px-8 overflow-hidden bg-[#fbfcfd]" aria-labelledby="roadmaps-heading">
        
      <style>{`
        @keyframes drawLine {
            0% { stroke-dashoffset: 1000; }
            100% { stroke-dashoffset: 0; }
        }
        .path-animated {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: drawLine 3s ease-out forwards 0.5s;
        }
      `}</style>

      {/* Ambient Background Details */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-40" 
        style={{ backgroundImage: 'radial-gradient(rgba(10, 15, 28, 0.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#fbfcfd] to-transparent pointer-events-none z-0" />
      
      {/* Subtle Radial Glow specific to the Featured Section */}
      <div className="absolute top-[30%] left-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0 animate-[pulse_4s_ease-in-out_infinite_alternate]" />
      <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-slate-900/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        
        {/* Header & Abstract Illustration Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-16 lg:mb-20">
            
            {/* Left: Typography */}
            <div className="lg:col-span-7 space-y-6 animate-fade-up">
                {/* Refined Premium Eyebrow */}
                <div className="flex items-center gap-4">
                    <span className="w-8 h-[2px] bg-primary rounded-full shadow-[0_0_8px_rgba(156,255,59,0.5)]"></span>
                    <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-800 font-display">Featured Roadmaps</h3>
                </div>
                
                {/* Main Heading */}
                <h2 id="roadmaps-heading" className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0a0f1c] leading-[1.05] font-display">
                    Start learning the <br className="hidden sm:block" />
                    right way.
                </h2>
                
                {/* Supporting Text */}
                <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-xl font-outfit">
                    Tuned progression charts designed to take you from a curious beginner to a highly productive engineer. No fluff, just the skills industry demands.
                </p>
            </div>

            {/* Right: Minimal Futuristic Node Illustration */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end animate-fade-up hidden sm:flex" style={{ animationDelay: '200ms' }}>
                <div className="relative w-full max-w-[320px] lg:max-w-[400px] aspect-[4/3]">
                    
                    {/* SVG Network / Journey Concept */}
                    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10 motion-reduce:hidden">
                        {/* Subtle Background Grid lines */}
                        <path d="M0 150H400M200 0V300" stroke="#f1f5f9" strokeWidth="2" />
                        
                        {/* Winding Progression Path */}
                        <path d="M50 250 C 150 250, 100 100, 200 150 S 250 50, 350 100" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="8 8" />
                        <path d="M50 250 C 150 250, 100 100, 200 150 S 250 50, 350 100" stroke="#4ade80" strokeWidth="3" className="path-animated" />
                        
                        {/* Floating Nodes (Animated) */}
                        <g className="animate-[float_6s_ease-in-out_infinite]">
                            <circle cx="50" cy="250" r="8" fill="white" stroke="#0a0f1c" strokeWidth="4" />
                            <rect x="20" y="270" width="60" height="12" rx="4" fill="#f1f5f9" />
                        </g>
                        
                        <g className="animate-[float_6s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}>
                            <circle cx="200" cy="150" r="10" fill="#0a0f1c" />
                            <circle cx="200" cy="150" r="4" fill="#4ade80" />
                            <rect x="170" y="110" width="60" height="24" rx="6" fill="white" stroke="#e2e8f0" strokeWidth="2" />
                            <path d="M180 122H210" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
                        </g>
                        
                        <g className="animate-[float_6s_ease-in-out_infinite]" style={{ animationDelay: '1.5s' }}>
                            <circle cx="350" cy="100" r="14" fill="white" stroke="#0a0f1c" strokeWidth="5" />
                            <path d="M345 100L349 104L355 96" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </g>

                        {/* Subtle Decorative particles */}
                        <circle cx="300" cy="200" r="3" fill="#94a3b8" />
                        <circle cx="100" cy="80" r="4" fill="#4ade80" opacity="0.5" />
                    </svg>
                </div>
            </div>
        </div>

        {/* Asymmetric Bento-Style Roadmaps Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 relative z-10">
            
            {/* PRIMARY: Web Development (Spans 7 columns on Desktop) */}
            <article className="animate-fade-up lg:col-span-7 group relative bg-white rounded-[32px] border border-slate-200 p-8 sm:p-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(156,255,59,0.15)] hover:border-primary/40 hover:-translate-y-1 transition-all duration-500 ease-out overflow-hidden flex flex-col h-full" style={{ animationDelay: '300ms' }}>
                
                {/* Internal Hover Glow */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_100%_0%,rgba(156,255,59,0.08),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Top Meta */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 relative z-10">
                    <span className="px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-extrabold uppercase tracking-widest text-slate-800 font-outfit">
                        Web Development
                    </span>
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 tracking-wider uppercase font-outfit">
                            <TrendingUp className="w-3.5 h-3.5 text-primary" /> Beginner → Advanced
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 tracking-wider uppercase font-outfit">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> 4–6 Months
                        </span>
                    </div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 max-w-lg mb-10">
                    <h3 className="text-3xl sm:text-4xl font-black text-[#0a0f1c] mb-4 tracking-tight group-hover:text-slate-700 transition-colors font-display">
                        Full Stack Web Development
                    </h3>
                    <p className="text-slate-500 leading-relaxed font-medium font-outfit">
                        Master frontend to backend, build complete web applications, and confidently deploy to production clouds.
                    </p>
                </div>

                {/* Visual Tech Timeline / Progress Indicator */}
                <div className="mt-auto relative z-10 bg-slate-50/50 rounded-2xl border border-slate-100 p-6">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-outfit">Core Technology Stack</p>
                    
                    <div className="relative flex flex-wrap gap-x-6 gap-y-4">
                        {/* Connection Line behind badges (visible mostly on desktop) */}
                        <div className="hidden sm:block absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
                        <div className="hidden sm:block absolute top-1/2 left-4 w-0 h-0.5 bg-primary -translate-y-1/2 z-0 group-hover:w-[80%] transition-all duration-1000 ease-out delay-100" />
                        
                        {/* Badges */}
                        <div className="relative z-10 flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-xl text-xs font-bold text-slate-700 group-hover:-translate-y-1 transition-transform duration-300 delay-0 font-outfit">
                            <span className="w-2 h-2 rounded-full bg-[#E44D26]" /> HTML/CSS
                        </div>
                        <div className="relative z-10 flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-xl text-xs font-bold text-slate-700 group-hover:-translate-y-1 transition-transform duration-300 delay-75 font-outfit">
                            <span className="w-2 h-2 rounded-full bg-[#F7DF1E]" /> JavaScript
                        </div>
                        <div className="relative z-10 flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-xl text-xs font-bold text-slate-700 group-hover:-translate-y-1 transition-transform duration-300 delay-150 font-outfit">
                            <span className="w-2 h-2 rounded-full bg-[#61DAFB]" /> React
                        </div>
                        <div className="relative z-10 flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-xl text-xs font-bold text-slate-700 group-hover:-translate-y-1 transition-transform duration-300 delay-200 font-outfit">
                            <span className="w-2 h-2 rounded-full bg-[#339933]" /> Node.js
                        </div>
                    </div>
                </div>

                {/* Action */}
                <div className="mt-8 pt-6 border-t border-slate-100 relative z-10">
                    <Link to="/roadmaps" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0a0f1c] group-hover:text-primary transition-colors font-outfit">
                        <span>Explore Web Dev Roadmap</span>
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:translate-x-2 transition-all">
                            <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />
                        </div>
                    </Link>
                </div>
            </article>

            {/* SECONDARY: Cloud & App (Spans 5 columns on Desktop, Stacked layout) */}
            <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
                
                {/* Cloud AWS Roadmap */}
                <article className="animate-fade-up group relative bg-white rounded-[24px] border border-slate-200 p-7 lg:p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(156,255,59,0.15)] hover:border-primary/40 hover:-translate-y-1 transition-all duration-500 ease-out flex-1 flex flex-col" style={{ animationDelay: '400ms' }}>
                    
                    <div className="flex items-start justify-between mb-5">
                        <h3 className="text-xl sm:text-2xl font-bold text-[#0a0f1c] tracking-tight font-display">Cloud AWS</h3>
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-primary group-hover:text-[#0a0f1c] group-hover:border-primary transition-all shadow-sm">
                            <Cloud className="w-5 h-5" />
                        </div>
                    </div>
                    
                    <p className="text-sm text-slate-500 leading-relaxed font-medium mb-6 flex-1 font-outfit">
                        Master AWS services from fundamentals to architect-level production deployments.
                    </p>

                    {/* Mini Tech Nodes */}
                    <div className="flex flex-wrap gap-2 mb-6 font-outfit">
                        <span className="px-2 py-1 rounded bg-slate-50 text-[10px] font-bold text-slate-600 border border-slate-100">IAM</span>
                        <span className="px-2 py-1 rounded bg-slate-50 text-[10px] font-bold text-slate-600 border border-slate-100">EC2</span>
                        <span className="px-2 py-1 rounded bg-slate-50 text-[10px] font-bold text-slate-600 border border-slate-100">Lambda</span>
                        <span className="px-2 py-1 rounded bg-slate-50 text-[10px] font-bold text-slate-600 border border-slate-100">VPC</span>
                    </div>

                    {/* Meta & Action */}
                    <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest font-outfit">Intermediate</span>
                            <span className="text-xs font-bold text-slate-700 font-outfit">3–5 Months</span>
                        </div>
                        <Link to="/roadmaps" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-[#0a0f1c] group-hover:text-primary transition-all shadow-sm">
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </article>

                {/* App Development Roadmap */}
                <article className="animate-fade-up group relative bg-white rounded-[24px] border border-slate-200 p-7 lg:p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(156,255,59,0.15)] hover:border-primary/40 hover:-translate-y-1 transition-all duration-500 ease-out flex-1 flex flex-col" style={{ animationDelay: '500ms' }}>
                    
                    <div className="flex items-start justify-between mb-5">
                        <h3 className="text-xl sm:text-2xl font-bold text-[#0a0f1c] tracking-tight font-display">App Dev</h3>
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-primary group-hover:text-[#0a0f1c] group-hover:border-primary transition-all shadow-sm">
                            <Smartphone className="w-5 h-5" />
                        </div>
                    </div>
                    
                    <p className="text-sm text-slate-500 leading-relaxed font-medium mb-6 flex-1 font-outfit">
                        Build native and cross-platform mobile applications for millions of real users.
                    </p>

                    {/* Mini Tech Nodes */}
                    <div className="flex flex-wrap gap-2 mb-6 font-outfit">
                        <span className="px-2 py-1 rounded bg-slate-50 text-[10px] font-bold text-slate-600 border border-slate-100">Flutter</span>
                        <span className="px-2 py-1 rounded bg-slate-50 text-[10px] font-bold text-slate-600 border border-slate-100">Kotlin</span>
                        <span className="px-2 py-1 rounded bg-slate-50 text-[10px] font-bold text-slate-600 border border-slate-100">Firebase</span>
                    </div>

                    {/* Meta & Action */}
                    <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest font-outfit">Beginner → Adv</span>
                            <span className="text-xs font-bold text-slate-700 font-outfit">3–5 Months</span>
                        </div>
                        <Link to="/roadmaps" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-[#0a0f1c] group-hover:text-primary transition-all shadow-sm">
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </article>

            </div>
        </div>

        {/* Premium CTA Button */}
        <div className="mt-12 lg:mt-16 flex justify-center animate-fade-up" style={{ animationDelay: '600ms' }}>
            <Link to="/roadmaps" className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-primary text-[#0a0f1c] text-sm font-bold shadow-[0_10px_30px_-10px_rgba(156,255,59,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(156,255,59,0.6)] hover:-translate-y-1 hover:brightness-110 transition-all duration-300 font-outfit">
                Browse All Tech Roadmaps
                <ArrowRight className="w-4 h-4" strokeWidth={3} />
            </Link>
        </div>

      </div>
    </section>
  );
}

// ─── FEATURED TUTORIALS ───────────────────────────────────────────────────────
function FeaturedTutorialsSection() {
  return (
    <section className="py-24 md:py-32 bg-black relative overflow-hidden" aria-labelledby="tutorials-heading">
      {/* Decorative image blending from top right edge of screen */}
      <img 
        src="/code_ui.png" 
        alt="Interactive coding tutorial sandbox code preview" 
        className="absolute top-0 right-0 w-72 md:w-[450px] lg:w-[600px] object-contain hidden md:block opacity-40 mix-blend-screen grayscale contrast-125 pointer-events-none [mask-image:radial-gradient(ellipse_at_top_right,black_40%,transparent_80%)] z-0"
        aria-hidden="true" 
        width="600"
        height="400"
        loading="lazy"
      />

      <div className="container-page relative z-10">
        <SectionHeader
          eyebrow="Tutorial Sandbox"
          title="Learn by doing"
          subtitle="Explore comprehensive sandbox articles to hone your active implementation skills."
          id="tutorials-heading"
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TUTORIALS.slice(0, 4).map((t) => (
            <Link
              key={t.slug}
              to="/tutorials/$slug"
              params={{ slug: t.slug }}
              className="group bg-[#0a0a0a] border border-white/10 flex flex-col overflow-hidden rounded-[1.5rem] hover:border-white/20 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 ease-out"
            >
              <div
                className="aspect-[16/9] w-full relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${DOMAIN_TEXT_COLORS[t.domain]}11 0%, ${DOMAIN_TEXT_COLORS[t.domain]}00 100%)`,
                }}
                aria-hidden="true"
              >
                <div className="absolute inset-0 grid place-items-center">
                  <div
                    className="h-14 w-14 rounded-[12px] grid place-items-center shadow-lg transition-transform duration-500 group-hover:scale-110"
                    style={{ background: DOMAIN_KEY_COLORS[t.domain], color: DOMAIN_TEXT_COLORS[t.domain] }}
                  >
                    <BookOpen className="h-6 w-6" />
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6 space-y-4">
                <div>
                  <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-white border border-white/10 tracking-widest uppercase">
                    {DOMAIN_NAME_MAP[t.domain]}
                  </span>
                </div>
                <h3 className="text-xl font-bold leading-tight line-clamp-2 text-white group-hover:text-blue-400 transition-colors tracking-tight">
                  {t.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 flex-1">{t.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{t.readMinutes} min read</span>
                  <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.difficulty}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link
            to="/tutorials"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all tracking-wide"
          >
            Browse All Coding Tutorials <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── INTERNSHIP HIGHLIGHTS ────────────────────────────────────────────────────
const HIGHLIGHTS = [
  { icon: Globe, title: "100% Remote Operations", desc: "Collaborate directly on remote infrastructures from any region in India." },
  { icon: Award, title: "Verifiable Certification", desc: "Gain certificates validated by the Infynux Academy board." },
  { icon: Code2, title: "Real Production Codebase", desc: "Publish pull requests to real customer apps, bypassing sandbox restrictions." },
];

function InternshipHighlightsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsActive(true);
        }
      });
    }, { threshold: 0.2 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full py-24 lg:py-32 overflow-hidden z-10 bg-[#fbfcfd]" id="industrial-launchpad">
      <style>{`
        .bg-tech-grid {
            background-image: 
                linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px);
            background-size: 32px 32px;
        }
        .reveal-pipeline {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-pipeline.active {
            opacity: 1;
            transform: translateY(0);
        }
        @keyframes drawLinePipeline {
            0% { stroke-dashoffset: 1000; }
            100% { stroke-dashoffset: 0; }
        }
        .path-animated-pipeline {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
        }
        .active .path-animated-pipeline {
            animation: drawLinePipeline 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            animation-delay: 0.3s;
        }
        .pipeline-line {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
        }
        .active .pipeline-line {
            animation: drawLinePipeline 2.5s ease-out forwards;
        }
      `}</style>
      
      {/* Ambient Grid & Glows */}
      <div className="absolute inset-0 bg-tech-grid pointer-events-none z-0" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1/3 h-full bg-gradient-to-r from-[#fbfcfd] via-[#fbfcfd]/80 to-transparent z-0 pointer-events-none" />
      
      <div className="absolute right-[-10%] top-[20%] w-[600px] h-[600px] bg-[#4ade80]/10 rounded-full animate-[pulse_4s_ease-in-out_infinite_alternate] pointer-events-none z-0 mix-blend-multiply filter blur-[80px]" />

      <div className={`max-w-[1280px] mx-auto px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center ${isActive ? 'active' : ''}`}>
          
          <div className="lg:col-span-5 flex flex-col items-start z-20">
              
              <div className={`reveal-pipeline inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm mb-8 ${isActive ? 'active' : ''}`} style={{ transitionDelay: '100ms' }}>
                  <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-700"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-700 font-display">Industrial Launchpad</span>
              </div>

              <h2 className={`reveal-pipeline text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[1.05] text-slate-900 mb-6 font-display ${isActive ? 'active' : ''}`} style={{ transitionDelay: '200ms' }}>
                  Real engineering.<br />
                  <span className="relative inline-block text-[#22c55e] mt-2">
                      Real credentials.
                      <svg className="absolute -bottom-3 left-0 w-full h-4 overflow-visible" viewBox="0 0 400 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path className="path-animated-pipeline" d="M0,10 L30,10 L40,0 L50,10 L390,10" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                          <circle className="path-animated-pipeline" cx="390" cy="10" r="3" fill="#22c55e" style={{ animationDelay: '1.5s' }} />
                      </svg>
                  </span>
              </h2>

              <p className={`reveal-pipeline text-lg text-slate-600 font-medium leading-relaxed max-w-md mb-10 font-outfit ${isActive ? 'active' : ''}`} style={{ transitionDelay: '300ms' }}>
                  Submit an application for your selected domain. Build features, resolve live issues, and launch production-grade modules seamlessly.
              </p>

              <div className={`reveal-pipeline ${isActive ? 'active' : ''}`} style={{ transitionDelay: '400ms' }}>
                  <Link to="/internships" className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#22c55e] text-white font-bold rounded-full overflow-hidden transition-all duration-300 hover:bg-[#4ade80] hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(34,197,94,0.5)] font-outfit">
                      <span className="relative z-10">Apply for Remote Tech Internship</span>
                      <ArrowRight className="w-5 h-5 relative z-10 transform group-hover:translate-x-1.5 transition-transform duration-300" strokeWidth={3} />
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                  </Link>
              </div>
          </div>

          <div className="lg:col-span-7 relative flex items-center min-h-[500px] w-full" id="pipeline-container">
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none z-0 opacity-40 animate-[float_8s_ease-in-out_infinite]">
                  <svg viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <path d="M100 100 L700 100 M100 200 L700 200 M100 300 L700 300 M100 400 L700 400 M100 500 L700 500" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 8" />
                      <path d="M200 50 L200 550 M350 50 L350 550 M500 50 L500 550 M650 50 L650 550" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 8" />
                      <rect x="150" y="120" width="120" height="80" rx="8" fill="white" stroke="#94a3b8" strokeWidth="2" />
                      <rect x="420" y="250" width="180" height="100" rx="8" fill="white" stroke="#94a3b8" strokeWidth="2" />
                      <rect x="250" y="420" width="140" height="60" rx="8" fill="white" stroke="#94a3b8" strokeWidth="2" />
                      <path d="M170 140 H220 M170 160 H250 M170 180 H200" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
                      <path d="M450 280 H500 M450 300 H550 M450 320 H480" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
                      <path d="M270 160 L350 160 L350 300 L420 300" stroke="#94a3b8" strokeWidth="2" fill="none" />
                      <circle cx="270" cy="160" r="4" fill="#4ade80" />
                      <circle cx="420" cy="300" r="4" fill="#4ade80" />
                      <path d="M390 450 L450 450 L450 350" stroke="#94a3b8" strokeWidth="2" fill="none" />
                      <circle cx="390" cy="450" r="4" fill="#4ade80" />
                      <text x="600" y="150" fontFamily="monospace" fontSize="40" fontWeight="bold" fill="#cbd5e1" opacity="0.5">&lt;/&gt;</text>
                      <text x="100" y="400" fontFamily="monospace" fontSize="40" fontWeight="bold" fill="#cbd5e1" opacity="0.5">{`{}`}</text>
                  </svg>
              </div>

              <div className="relative w-full z-10 flex flex-col lg:flex-row gap-6 lg:gap-4 xl:gap-8 justify-between pt-8 lg:pt-0">
                  
                  {/* Mobile Connecting Vertical Line */}
                  <div className="block lg:hidden absolute left-[39px] top-[40px] bottom-[40px] w-0.5 bg-slate-200">
                      <div 
                          className="absolute top-0 left-0 w-full bg-[#4ade80] origin-top transition-all duration-[2000ms] ease-out" 
                          style={{ height: '100%', transform: isActive ? 'scaleY(1)' : 'scaleY(0)' }} 
                      />
                  </div>

                  {/* Desktop Connecting Angled Line SVG */}
                  <div className="hidden lg:block absolute inset-0 pointer-events-none -z-10">
                      <svg width="100%" height="100%" className="overflow-visible">
                          <path d="M 120 100 C 200 100, 250 200, 350 200 C 450 200, 500 300, 600 300" stroke="#e2e8f0" strokeWidth="3" fill="none" strokeDasharray="6 6" />
                          <path className="pipeline-line" d="M 120 100 C 200 100, 250 200, 350 200 C 450 200, 500 300, 600 300" stroke="#4ade80" strokeWidth="3" fill="none" />
                      </svg>
                  </div>

                  {/* Stage 01 */}
                  <div className={`reveal-pipeline relative w-full lg:w-1/3 flex lg:block items-start gap-5 lg:gap-0 lg:-mt-12 group ${isActive ? 'active' : ''}`} style={{ transitionDelay: '400ms' }}>
                      <div className="relative w-14 h-14 lg:w-16 lg:h-16 lg:mb-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0 z-10 group-hover:border-[#4ade80] group-hover:shadow-[0_0_20px_rgba(74,222,128,0.2)] group-hover:-translate-y-1 transition-all duration-300">
                          <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow-sm">01</span>
                          <Globe className="w-8 h-8 text-slate-700 group-hover:text-[#22c55e] transition-colors" strokeWidth={1.5} />
                      </div>
                      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] group-hover:shadow-[0_15px_35px_-15px_rgba(74,222,128,0.1)] transition-all duration-300 flex-1">
                          <h4 className="text-lg font-bold text-slate-900 mb-2 leading-tight font-display">Remote Operations</h4>
                          <p className="text-sm text-slate-500 leading-relaxed font-medium font-outfit">Collaborate directly on remote infrastructures from any region in India.</p>
                      </div>
                  </div>

                  {/* Stage 02 */}
                  <div className={`reveal-pipeline relative w-full lg:w-1/3 flex lg:block items-start gap-5 lg:gap-0 lg:mt-[100px] group ${isActive ? 'active' : ''}`} style={{ transitionDelay: '600ms' }}>
                      <div className="relative w-14 h-14 lg:w-16 lg:h-16 lg:mb-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0 z-10 group-hover:border-[#4ade80] group-hover:shadow-[0_0_20px_rgba(74,222,128,0.2)] group-hover:-translate-y-1 transition-all duration-300">
                          <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow-sm">02</span>
                          <Award className="w-8 h-8 text-slate-700 group-hover:text-[#22c55e] transition-colors" strokeWidth={1.5} />
                      </div>
                      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] group-hover:shadow-[0_15px_35px_-15px_rgba(74,222,128,0.1)] transition-all duration-300 flex-1">
                          <h4 className="text-lg font-bold text-slate-900 mb-2 leading-tight font-display">Verified Certification</h4>
                          <p className="text-sm text-slate-500 leading-relaxed font-medium font-outfit">Gain exclusive credentials strictly validated by the Infynux Academy board.</p>
                      </div>
                  </div>

                  {/* Stage 03 */}
                  <div className={`reveal-pipeline relative w-full lg:w-1/3 flex lg:block items-start gap-5 lg:gap-0 lg:mt-[200px] group ${isActive ? 'active' : ''}`} style={{ transitionDelay: '800ms' }}>
                      <div className="relative w-14 h-14 lg:w-16 lg:h-16 lg:mb-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0 z-10 group-hover:border-[#4ade80] group-hover:shadow-[0_0_20px_rgba(74,222,128,0.2)] group-hover:-translate-y-1 transition-all duration-300">
                          <span className="absolute -top-2 -right-2 bg-[#22c55e] text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow-sm">03</span>
                          <Code2 className="w-8 h-8 text-slate-700 group-hover:text-[#22c55e] transition-colors" strokeWidth={1.5} />
                      </div>
                      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] group-hover:shadow-[0_15px_35px_-15px_rgba(74,222,128,0.1)] transition-all duration-300 flex-1 border-b-2 border-b-transparent group-hover:border-b-[#4ade80]">
                          <h4 className="text-lg font-bold text-slate-900 mb-2 leading-tight font-display">Production Codebase</h4>
                          <p className="text-sm text-slate-500 leading-relaxed font-medium font-outfit">Publish pull requests to real customer apps, bypassing sandbox restrictions.</p>
                      </div>
                  </div>

              </div>
          </div>

      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 bg-black" aria-labelledby="testimonials-heading">
      <div className="container-page">
        <SectionHeader
          eyebrow="Student Reviews"
          title="Validated by our cohort"
          subtitle="Real testimonials from students who successfully launched their tech careers."
          id="testimonials-heading"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="flex flex-col justify-between bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 hover:bg-white/5 hover:-translate-y-1 hover:border-white/20 transition-all duration-300">
              <div className="space-y-5 text-left">
                <div className="flex gap-1" aria-label={`${t.stars} out of 5 stars`}>
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-lg font-medium leading-relaxed text-slate-300 tracking-tight">"{t.quote}"</p>
              </div>
              <div className="mt-8 flex items-center gap-4 pt-6 border-t border-white/10">
                <div
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-bold text-white bg-red-600 shadow-sm"
                  aria-hidden="true"
                >
                  {t.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div className="text-left">
                  <p className="text-base font-bold text-white tracking-tight">{t.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section className="py-24 md:py-32 bg-white" aria-labelledby="faq-heading">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-2 items-start">
          <div className="sticky top-24 space-y-8">
            <SectionHeader
              eyebrow="Support"
              title="Frequently asked questions"
              subtitle="Everything you need to know to get started."
              id="faq-heading"
              theme="light"
            />
            <div className="hidden lg:block relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 p-8">
              <img 
                src="/man_asking_question.png" 
                alt="Frequently asked questions about Infynux Academy tech roadmaps and remote internships"
                className="w-full h-full object-contain mix-blend-multiply opacity-80"
                width="400"
                height="400"
                loading="lazy"
              />
            </div>
          </div>
          <dl className="space-y-4">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                openIdx === i
                  ? "border-indigo-100 bg-indigo-50/30 shadow-md scale-[1.01]"
                  : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm"
              }`}
            >
              <dt>
                <button
                  type="button"
                  className={`flex w-full items-center justify-between gap-6 px-8 py-6 text-left text-lg md:text-xl font-bold transition-colors tracking-tight ${openIdx === i ? "text-indigo-600" : "text-slate-800"}`}
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  aria-expanded={openIdx === i}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${openIdx === i ? "rotate-180 text-indigo-500" : "rotate-0"}`}
                    aria-hidden="true"
                  />
                </button>
              </dt>
              <dd
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: openIdx === i ? "600px" : "0" }}
              >
                <p className={`px-8 pb-8 text-base leading-relaxed text-left ${openIdx === i ? "text-slate-600" : "text-slate-500"}`}>{faq.answer}</p>
              </dd>
            </div>
          ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

// ─── NEWSLETTER ───────────────────────────────────────────────────────────────
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) { setMsg("Please enter a valid email."); setState("error"); return; }
    setState("loading");
    // Mock success message for now until the real API is implemented
    setTimeout(() => {
      setState("success");
      setMsg("You're subscribed! 🎉 We'll keep you updated.");
      setEmail("");
    }, 800);
  };

  return (
    <section className="py-24 md:py-32 bg-[#F9FAF5]" aria-labelledby="newsletter-heading">
      <div className="container-page max-w-4xl relative">
        {/* The peering man image positioned behind the card */}
        <div className="flex justify-center -mb-[180px] md:-mb-[220px] relative z-0">
          <img 
            src="/peering_man_transparent.png" 
            alt="Subscribe to Infynux Academy tech roadmaps and remote internship newsletter" 
            className="w-[450px] md:w-[650px] object-contain drop-shadow-xl pointer-events-none opacity-90" 
            width="650"
            height="320"
            loading="lazy"
          />
        </div>
        
        <div className="text-center rounded-[40px] border-4 border-[#222] bg-[#0A0A0A] p-12 md:p-20 shadow-[0_30px_80px_rgba(0,0,0,0.15)] relative overflow-hidden z-10 mt-10">
          {/* Maximalist glow behind the form */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary font-orbitron">Stay Updated</span>
            <h2 className="mt-4 font-display text-5xl md:text-6xl lg:text-7xl font-black text-white font-orbitron tracking-tight" id="newsletter-heading">
              Never miss an update
            </h2>
            <p className="mt-6 text-[#C7CBCE] font-outfit text-xl font-bold">
              Stay informed on newly published roadmaps, tutorials, and remote internships.
            </p>
            {state === "success" ? (
              <div className="mt-10 rounded-2xl border-2 border-emerald-400 bg-emerald-500/10 px-8 py-6 text-lg font-black text-emerald-400 font-orbitron backdrop-blur-md">
                {msg}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-4">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 rounded-2xl border-2 border-[#333] bg-[#111] px-8 py-6 text-lg font-bold text-white placeholder:text-[#C7CBCE]/50 font-outfit focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                />
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-primary text-black px-10 py-6 text-lg font-black shadow-[0_4px_30px_rgba(156,255,59,0.3)] hover:bg-lime-400 hover:shadow-[0_8px_40px_rgba(156,255,59,0.4)] transition-all disabled:opacity-60 font-orbitron whitespace-nowrap"
                >
                  {state === "loading" ? (
                    <span className="flex items-center gap-2">
                      <span className="block h-5 w-5 animate-spin rounded-full border-4 border-black border-t-transparent" />
                      Subscribing...
                    </span>
                  ) : (
                    <><Mail className="h-6 w-6" />Subscribe</>
                  )}
                </button>
              </form>
            )}
          {state === "error" && (
            <p className="mt-3 text-xs text-red-500 font-orbitron" role="alert">{msg}</p>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Shared: SectionHeader ────────────────────────────────────────────────────
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  id,
  theme = "dark"
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  id?: string;
  theme?: "light" | "dark";
}) {
  return (
    <div className="max-w-2xl text-left space-y-3 mb-10 relative z-10">
      <span className="text-sm font-semibold uppercase tracking-wider text-primary font-orbitron">{eyebrow}</span>
      <h2 className={`font-display text-5xl font-black md:text-6xl lg:text-7xl font-orbitron leading-[1.1] tracking-tight drop-shadow-sm ${theme === 'dark' ? 'text-white' : 'text-black'}`} id={id}>
        {title}
      </h2>
      {subtitle && <p className={`leading-relaxed font-outfit text-sm ${theme === 'dark' ? 'text-[#C7CBCE]' : 'text-black'}`}>{subtitle}</p>}
    </div>
  );
}
