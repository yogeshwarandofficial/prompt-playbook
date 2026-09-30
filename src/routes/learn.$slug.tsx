import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  BookOpen,
  Terminal,
  Plus,
  Clock,
  Code2,
  Layers,
  Sparkles,
  Cloud,
  ShoppingCart,
  LineChart,
  Lock,
  FileText,
  User,
  Globe,
  Atom,
  HardDrive,
  GitFork,
} from "lucide-react";
import {
  DOMAINS,
  DOMAIN_NAME_MAP,
  type Roadmap,
  ROADMAPS,
} from "@/data/content";
import { cn } from "@/lib/utils";
import { createSeoHead, getCourseSchema, getBreadcrumbSchema, getFaqSchema } from "@/lib/seo";
import { DOMAIN_KEYWORDS } from "@/lib/seo-keywords";

import { JsonLd } from "@/components/site/JsonLd";

export const Route = createFileRoute("/learn/$slug")({
  loader: async ({ params }): Promise<{ roadmap: Roadmap }> => {
    const roadmap = ROADMAPS.find((r) => r.slug === params.slug);
    if (!roadmap) {
      throw notFound();
    }
    return { roadmap };
  },
  head: ({ loaderData }) => {
    const r = loaderData?.roadmap;
    if (!r) return {};
    const domainKws = DOMAIN_KEYWORDS[r.domain] || [];
    return createSeoHead({
      title: `${r.title} Roadmap 2026 | Free Syllabus & Projects | Infynux Academy`,
      description: `Master ${r.title} with Infynux Academy's free structured curriculum. Learn ${r.prerequisites?.slice(0, 2).join(", ") || "core fundamentals"}, hands-on project milestones, and career salary guidance in India.`,
      path: `/learn/${r.slug}`,
      image: `/ui_${r.domain}.png`,
      keywords: [
        `${r.title.toLowerCase()} roadmap`,
        `${r.title.toLowerCase()} course free`,
        `${r.title.toLowerCase()} syllabus 2026`,
        ...domainKws,
      ],
      category: `${DOMAIN_NAME_MAP[r.domain]} Learning Path`,
    });
  },
  component: LearnPage,
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-bold text-white">Course not found</h1>
      <Link to="/roadmaps" className="mt-4 inline-block text-blue-500 hover:text-blue-400 font-medium transition-colors">
        Back to roadmaps
      </Link>
    </div>
  ),
});

function LearnPage() {
  const { roadmap } = Route.useLoaderData() as { roadmap: Roadmap };
  const [expandedModule, setExpandedModule] = useState<number>(0);
  const [showFullSyllabus, setShowFullSyllabus] = useState<boolean>(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const FAQS = [
      { q: "Is this roadmap completely free?", a: "Yes, the core roadmap structure, theoretical outlines, and recommended progression pathways are entirely free to access. Our mission is to democratize high-level engineering knowledge. Specific premium labs or intensive 1-on-1 mentorship sessions may be part of our extended programs." },
      { q: "Do I need prior coding experience?", a: "Not at all. A basic understanding of using a computer and a text editor is all you need. We start from the absolute fundamentals of HTML, CSS, and basic programming logic before scaling up to complex server architectures and database management." },
      { q: "How long will this take to complete?", a: "Most dedicated learners complete the entire Full Stack path in 4 to 6 months by committing 10-15 hours per week. Because the curriculum is self-paced, you can accelerate your learning or take more time depending on your personal schedule and retention rate." },
      { q: "Are the projects portfolio-ready?", a: "Absolutely. We despise \"todo apps.\" You will be building production-grade software including an E-Commerce engine with Stripe, a multi-tenant SaaS dashboard, and a secure API system. These projects are designed specifically to pass technical interviews at top product companies." }
  ];

  // Carousel State
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentProjectIdx, setCurrentProjectIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isDragging = useRef(false);
  const startPos = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const animationID = useRef<number>(0);

  useEffect(() => {
      if (!roadmap.projects || roadmap.projects.length <= 1) return;
      let interval: ReturnType<typeof setInterval>;
      if (!isHovered && !isDragging.current) {
          interval = setInterval(() => {
              setCurrentProjectIdx(prev => (prev + 1) % roadmap.projects.length);
          }, 5000);
      }
      return () => clearInterval(interval);
  }, [isHovered, roadmap.projects, currentProjectIdx]);

  useEffect(() => {
      prevTranslate.current = currentProjectIdx * -100;
      if (trackRef.current && !isDragging.current) {
          trackRef.current.style.transform = `translateX(${prevTranslate.current}%)`;
      }
  }, [currentProjectIdx]);

  const getPositionX = (e: React.MouseEvent | React.TouchEvent) => {
      if ('touches' in e) {
          return e.touches[0].clientX;
      }
      return (e as React.MouseEvent).pageX;
  }

  const setSliderPosition = () => {
      if (trackRef.current) {
          trackRef.current.style.transform = `translateX(${currentTranslate.current}%)`;
      }
  }

  const animation = () => {
      if (isDragging.current) {
          setSliderPosition();
          animationID.current = requestAnimationFrame(animation);
      }
  }

  const touchStart = (e: React.MouseEvent | React.TouchEvent) => {
      isDragging.current = true;
      startPos.current = getPositionX(e);
      animationID.current = requestAnimationFrame(animation);
      if (trackRef.current) {
          trackRef.current.classList.remove('transition-transform', 'duration-500');
          trackRef.current.classList.add('cursor-grabbing');
      }
  }

  const touchMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (isDragging.current && trackRef.current) {
          const currentPosition = getPositionX(e);
          const diff = currentPosition - startPos.current;
          const percentDiff = (diff / trackRef.current.clientWidth) * 100;
          
          if ((currentProjectIdx === 0 && diff > 0) || (currentProjectIdx === roadmap.projects.length - 1 && diff < 0)) {
              currentTranslate.current = prevTranslate.current + (percentDiff * 0.2);
          } else {
              currentTranslate.current = prevTranslate.current + percentDiff;
          }
      }
  }

  const touchEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      cancelAnimationFrame(animationID.current);
      if (trackRef.current) {
          trackRef.current.classList.add('transition-transform', 'duration-500');
          trackRef.current.classList.remove('cursor-grabbing');
      }

      const movedBy = currentTranslate.current - prevTranslate.current;

      let newIdx = currentProjectIdx;
      if (movedBy < -15 && currentProjectIdx < roadmap.projects.length - 1) newIdx += 1;
      if (movedBy > 15 && currentProjectIdx > 0) newIdx -= 1;

      setCurrentProjectIdx(newIdx);
  }

  const totalLessons = roadmap.modules.reduce(
    (acc, m) => acc + m.topics.reduce((a, t) => a + t.lessons.length, 0),
    0,
  );
  const totalTopics = roadmap.modules.reduce((acc, m) => acc + m.topics.length, 0);

  const courseSchema = getCourseSchema(roadmap);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Roadmaps", path: "/roadmaps" },
    { name: `${roadmap.title} Roadmap`, path: `/learn/${roadmap.slug}` },
  ]);

  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative w-full flex flex-col pt-20 lg:pt-28 min-h-screen bg-[#05070B] text-[#F7F9F5] font-sans selection:bg-[#8DFF32] selection:text-[#05070B] overflow-x-hidden">
      <JsonLd schema={[courseSchema, breadcrumbSchema]} />
      
      <style>{`
        .bg-grid-dark { background-image: radial-gradient(rgba(139, 150, 168, 0.15) 1px, transparent 1px); }
        .bg-grid { background-size: 24px 24px; }
        .bg-glow-radial { background-image: radial-gradient(circle at center, rgba(141, 255, 50, 0.15) 0%, transparent 70%); }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
        }
        @keyframes pulseGlow {
            0% { opacity: 0.4; filter: blur(30px); }
            100% { opacity: 0.8; filter: blur(40px); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 6s ease-in-out 3s infinite; }
        .animate-pulse-glow { animation: pulseGlow 4s ease-in-out infinite alternate; }
        
        .reveal {
            opacity: 0;
            transform: translateY(40px);
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }
        .tech-line { stroke-dasharray: 1000; stroke-dashoffset: 1000; transition: stroke-dashoffset 1.5s ease; }
        .active .tech-line { stroke-dashoffset: 0; }
        
        @media (prefers-reduced-motion: reduce) {
            .reveal { transition: none; opacity: 1; transform: none; }
            .animate-float, .animate-float-delayed, .animate-pulse-glow { animation: none; }
            .tech-line { stroke-dashoffset: 0; transition: none; }
        }
      `}</style>

      {/* ==========================================
           01 — IMMERSIVE HERO
      =========================================== */}
      <section className="relative w-full min-h-[85vh] flex items-center bg-[#05070B] overflow-hidden z-10">
          <div className="absolute inset-0 bg-grid-dark bg-grid opacity-40 z-0" />
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[800px] h-[800px] bg-glow-radial mix-blend-screen opacity-50 z-0 pointer-events-none animate-pulse-glow" />

          <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10 py-16">
              
              <div className="lg:col-span-6 space-y-8 reveal active">
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-[2px] bg-[#8DFF32]" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B96A8]">{roadmap.title} Path</span>
                  </div>

                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] text-[#F7F9F5]">
                      Learn {roadmap.title.replace('Development', 'Dev')}.<br />
                      <span className="text-[#8DFF32]">Build for the Real World.</span>
                  </h1>

                  <p className="text-lg sm:text-xl text-[#8B96A8] font-medium leading-relaxed max-w-xl">
                      {roadmap.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-4">
                      <div className="px-4 py-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-white/10 shadow-lg hover:shadow-[0_0_20px_rgba(141,255,50,0.1)] text-[10px] sm:text-xs font-bold text-[#F7F9F5] tracking-widest uppercase flex items-center gap-2 transition-all duration-300">
                          <span className="w-2 h-2 rounded-full bg-[#8DFF32] shadow-[0_0_10px_#8DFF32]" /> {roadmap.difficulty}
                      </div>
                      <div className="px-4 py-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-white/10 shadow-lg hover:shadow-[0_0_20px_rgba(141,255,50,0.1)] text-[10px] sm:text-xs font-bold text-[#F7F9F5] tracking-widest uppercase flex items-center gap-2 transition-all duration-300">
                          <Clock className="w-4 h-4 text-[#8B96A8]" /> {roadmap.duration}
                      </div>
                      <div className="px-4 py-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-white/10 shadow-lg hover:shadow-[0_0_20px_rgba(141,255,50,0.1)] text-[10px] sm:text-xs font-bold text-[#F7F9F5] tracking-widest uppercase flex items-center gap-2 transition-all duration-300">
                          <BookOpen className="w-4 h-4 text-[#8B96A8]" /> {totalLessons} Lessons
                      </div>
                      <div className="px-4 py-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-white/10 shadow-lg hover:shadow-[0_0_20px_rgba(141,255,50,0.1)] text-[10px] sm:text-xs font-bold text-[#F7F9F5] tracking-widest uppercase flex items-center gap-2 transition-all duration-300">
                          <Code2 className="w-4 h-4 text-[#8B96A8]" /> {roadmap.projects.length} Projects
                      </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6 pt-8">
                      <a href="#enroll" className="w-full sm:w-auto px-10 py-5 bg-[#8DFF32] text-[#05070B] font-black text-sm uppercase tracking-wider rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(141,255,50,0.3)] hover:shadow-[0_0_40px_rgba(141,255,50,0.5)] flex items-center justify-center gap-3 group">
                          Start Learning <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                      </a>
                      <a href="#journey" className="w-full sm:w-auto px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-[#F7F9F5] font-bold text-sm uppercase tracking-wider rounded-full hover:bg-white/10 hover:border-white/30 transition-all duration-300 shadow-lg flex items-center justify-center gap-2">
                          View Roadmap
                      </a>
                  </div>
              </div>

              <div className="lg:col-span-6 relative h-[400px] sm:h-[500px] w-full flex items-center justify-center lg:justify-end reveal active mt-10 lg:mt-0" style={{ transitionDelay: '200ms' }}>
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 600 500">
                      <path className="tech-line" d="M 200 150 L 300 250 L 450 250" stroke="#8DFF32" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.5"/>
                      <path className="tech-line" d="M 150 350 L 300 250 L 350 100" stroke="#19C96B" strokeWidth="1.5" fill="none" opacity="0.3"/>
                      <circle cx="300" cy="250" r="4" fill="#8DFF32" />
                  </svg>

                  <div className="absolute top-[10%] lg:right-[15%] w-[280px] sm:w-[340px] bg-[#0B1220] border border-white/10 rounded-xl shadow-2xl p-4 font-mono text-[10px] sm:text-xs z-20 animate-float backdrop-blur-xl">
                      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                          <div className="flex gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                          </div>
                          <span className="text-[#8B96A8] text-[9px]">server.js</span>
                      </div>
                      <div className="space-y-1.5 text-white/80">
                          <p><span className="text-purple-400">const</span> express = <span className="text-blue-400">require</span>(<span className="text-[#19C96B]">'express'</span>);</p>
                          <p><span className="text-purple-400">const</span> app = <span className="text-yellow-200">express</span>();</p>
                          <br />
                          <p>app.<span className="text-yellow-200">use</span>(express.<span className="text-blue-300">json</span>());</p>
                          <br />
                          <p>app.<span className="text-yellow-200">post</span>(<span className="text-[#19C96B]">'/api/v1/users'</span>, <span className="text-purple-400">async</span> (req, res) ={">"} {"{"}</p>
                          <p className="pl-4 text-[#8B96A8]">// Auth & logic handled here</p>
                          <p className="pl-4"><span className="text-purple-400">await</span> Database.<span className="text-yellow-200">connect</span>();</p>
                          <p>{"}"});</p>
                      </div>
                  </div>

                  <div className="absolute bottom-[20%] lg:left-[5%] w-48 bg-[#0a0f18] border border-[#8DFF32]/30 rounded-xl p-4 shadow-[0_0_30px_rgba(141,255,50,0.1)] z-30 animate-float-delayed">
                      <div className="flex items-center gap-3 mb-3">
                          <Layers className="w-6 h-6 text-[#8DFF32]" />
                          <span className="font-mono text-xs font-bold text-white">DB_CLUSTER_01</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#8DFF32] w-[75%] h-full shadow-[0_0_10px_#8DFF32]" />
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-[#8B96A8] mt-2 uppercase">
                          <span>Status</span>
                          <span className="text-[#8DFF32]">Connected</span>
                      </div>
                  </div>

                  <div className="absolute top-[40%] left-[10%] sm:-left-4 bg-[#0B1220] border border-white/10 px-3 py-2 rounded-lg flex items-center gap-2 font-mono text-[10px] text-white z-40 shadow-xl animate-float">
                      <Sparkles className="text-blue-400 w-4 h-4" /> {roadmap.title.split(' ')[0]}
                  </div>
                  <div className="absolute bottom-[10%] right-[10%] bg-[#0B1220] border border-white/10 px-3 py-2 rounded-lg flex items-center gap-2 font-mono text-[10px] text-white z-40 shadow-xl animate-float-delayed">
                      <Cloud className="text-[#19C96B] w-4 h-4" /> Deploying...
                  </div>
              </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#05070B] to-transparent z-10 pointer-events-none" />
      </section>

      {/* ==========================================
           02 — ENGINEERING PATH HUD (Wave Timeline)
      =========================================== */}
      <section className="w-full bg-[#05070B] border-y border-white/5 relative py-12 md:py-16">
          <div className="max-w-[1200px] mx-auto px-6 relative w-full overflow-hidden">
              
              <div className="flex items-center gap-3 mb-10 relative z-20">
                  <Sparkles className="text-[#8DFF32] w-5 h-5 animate-pulse" />
                  <h2 className="text-xs sm:text-sm font-black text-[#8DFF32] uppercase tracking-[0.2em]">Your Engineering Journey</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#8DFF32]/20 to-transparent ml-4" />
              </div>
              
              <div className="relative w-full h-[150px] sm:h-[200px] flex items-center min-w-[800px] overflow-x-auto no-scrollbar pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  
                  <svg viewBox="0 0 1000 200" className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-10" preserveAspectRatio="none">
                      <defs>
                          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
                              <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
                              <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur3" />
                              <feMerge>
                                  <feMergeNode in="blur3" />
                                  <feMergeNode in="blur2" />
                                  <feMergeNode in="blur1" />
                                  <feMergeNode in="SourceGraphic" />
                              </feMerge>
                          </filter>
                          
                          <path id="journey-curve" d={`M 100 100 ${roadmap.modules.map((_, i) => {
                              const interval = 800 / roadmap.modules.length;
                              const x1 = 100 + (i * interval);
                              const x2 = 100 + ((i+1) * interval);
                              const dx = interval / 3;
                              const y_ctrl = i % 2 === 0 ? 60 : 140;
                              return `C ${x1 + dx} ${y_ctrl}, ${x2 - dx} ${y_ctrl}, ${x2} 100`;
                          }).join(" ")}`} />
                      </defs>

                      <use href="#journey-curve" fill="none" stroke="#1E293B" strokeWidth="4" />
                      <use href="#journey-curve" fill="none" stroke="#8DFF32" strokeWidth="2" opacity="0.4" filter="url(#neon-glow)" />
                      <use href="#journey-curve" fill="none" stroke="#8DFF32" strokeWidth="4" strokeDasharray="10 25" filter="url(#neon-glow)">
                          <animate attributeName="stroke-dashoffset" from="35" to="0" dur="0.8s" repeatCount="indefinite" />
                      </use>

                      <g filter="url(#neon-glow)">
                          <path d="M-10,-8 L10,0 L-10,8 L-4,0 Z" fill="#ffffff" />
                          <animateMotion dur="4.5s" repeatCount="indefinite" rotate="auto">
                              <mpath href="#journey-curve" />
                          </animateMotion>
                      </g>
                      <g filter="url(#neon-glow)">
                          <path d="M-10,-8 L10,0 L-10,8 L-4,0 Z" fill="#ffffff" />
                          <animateMotion dur="4.5s" begin="1.5s" repeatCount="indefinite" rotate="auto">
                              <mpath href="#journey-curve" />
                          </animateMotion>
                      </g>
                      <g filter="url(#neon-glow)">
                          <path d="M-10,-8 L10,0 L-10,8 L-4,0 Z" fill="#ffffff" />
                          <animateMotion dur="4.5s" begin="3s" repeatCount="indefinite" rotate="auto">
                              <mpath href="#journey-curve" />
                          </animateMotion>
                      </g>

                      {[...roadmap.modules.map(m => m.phase), "Production"].map((phase, idx) => {
                          const interval = 800 / roadmap.modules.length;
                          const cx = 100 + (idx * interval);
                          const isFirst = idx === 0;
                          return (
                              <g key={idx}>
                                  {isFirst ? (
                                      <>
                                          <circle cx={cx} cy="100" r="14" fill="#8DFF32" filter="url(#neon-glow)">
                                              <animate attributeName="opacity" values="1; 0.2; 1" dur="1s" repeatCount="indefinite" />
                                          </circle>
                                          <circle cx={cx} cy="100" r="14" fill="none" stroke="#8DFF32" strokeWidth="3">
                                              <animate attributeName="r" values="14; 45" dur="2s" repeatCount="indefinite" />
                                              <animate attributeName="opacity" values="1; 0" dur="2s" repeatCount="indefinite" />
                                          </circle>
                                          <circle cx={cx} cy="100" r="14" fill="none" stroke="#8DFF32" strokeWidth="2">
                                              <animate attributeName="r" values="14; 30" dur="2s" begin="1s" repeatCount="indefinite" />
                                              <animate attributeName="opacity" values="0.8; 0" dur="2s" begin="1s" repeatCount="indefinite" />
                                          </circle>
                                      </>
                                  ) : (
                                      <>
                                          <circle cx={cx} cy="100" r="14" fill="#080D16" stroke="#1E293B" strokeWidth="4" />
                                          <circle cx={cx} cy="100" r="10" fill="#8DFF32" filter="url(#neon-glow)">
                                              <animate attributeName="opacity" values="0; 1; 0" dur="1.5s" begin={`${0.5 * idx}s`} repeatCount="indefinite" />
                                          </circle>
                                      </>
                                  )}
                              </g>
                          );
                      })}
                  </svg>

                  <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
                      {[...roadmap.modules.map(m => m.phase), "Production"].map((phase, idx) => {
                          const interval = 800 / roadmap.modules.length;
                          const leftPercent = (100 + (idx * interval)) / 10;
                          const isFirst = idx === 0;
                          return (
                              <div key={idx} className={`absolute top-[130px] sm:top-[140px] flex flex-col items-center -translate-x-1/2 ${!isFirst ? 'opacity-50' : ''}`} style={{ left: `${leftPercent}%` }}>
                                  <span className="text-[9px] font-bold text-[#8B96A8] uppercase tracking-widest mb-1 font-mono">Phase 0{idx + 1}</span>
                                  <span className={`text-xs sm:text-sm font-black tracking-wide uppercase ${isFirst ? 'text-white drop-shadow-[0_0_10px_rgba(141,255,50,0.5)]' : 'text-[#8B96A8]'}`}>
                                      {phase}
                                  </span>
                              </div>
                          );
                      })}
                  </div>
              </div>
          </div>
      </section>

      {/* ==========================================
           03 — COURSE SYSTEM
      =========================================== */}
      <section className="py-24 bg-[#05070B] relative">
          <style>{`
              @keyframes grow100 { 0% { width: 0%; } 100% { width: 100%; } }
              @keyframes blinkStep { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
              .animate-grow-100 { animation: grow100 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
              .animate-blink-forwards { animation: blinkStep 0.1s step-end forwards; animation-fill-mode: forwards; }
          `}</style>

          <div className="max-w-[1200px] mx-auto px-6 reveal">
              <div className="relative w-full max-w-[1100px] mx-auto">
                  
                  {/* Ambient Glowing Aura Behind Card */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#8DFF32]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

                  {/* Main Card Container */}
                  <div className="relative z-10 w-full bg-[#080D16] rounded-[2.5rem] border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden p-8 lg:p-14">
                      
                      {/* Subtle internal grid overlay for tech feel */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#080D16_80%)] pointer-events-none"></div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 relative z-10">
                          
                          {/* LEFT COLUMN: Typography & Stats */}
                          <div className="flex flex-col justify-between">
                              
                              <div className="mb-8 animate-float" style={{ animationDuration: '8s' }}>
                                  <div className="flex items-center gap-3 font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#8DFF32] mb-4">
                                      <span className="w-2.5 h-2.5 rounded-full bg-[#8DFF32] animate-pulse shadow-[0_0_10px_rgba(141,255,50,0.6)]"></span>
                                      {"> SYSTEM_STATUS"} <span className="animate-pulse">_</span>
                                  </div>
                                  
                                  <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tighter leading-[1.05] text-white mb-6">
                                      {roadmap.title.replace('Development', 'Dev')}
                                  </h1>

                                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#8DFF32]/5 border border-[#8DFF32]/20 backdrop-blur-md">
                                      <span className="w-4 h-4 rounded-full bg-[#8DFF32]/20 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-[#8DFF32]"></div></span>
                                      <span className="text-xs font-bold text-white tracking-wide">Career-ready pathway</span>
                                  </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 lg:gap-5 mt-auto">
                                  <div className="bg-[linear-gradient(145deg,rgba(11,18,32,0.8),rgba(5,7,11,0.9))] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_4px_20px_-5px_rgba(0,0,0,0.5)] rounded-2xl p-5 border border-white/5 hover:border-[#8DFF32]/30 transition-colors duration-300 group">
                                      <p className="text-[10px] font-mono font-bold text-[#8B96A8] tracking-widest uppercase mb-1 flex items-center justify-between">
                                          Lessons <BookOpen className="w-4 h-4 text-[#8B96A8]/50 group-hover:text-[#8DFF32] transition-colors" />
                                      </p>
                                      <p className="text-4xl font-black text-white tracking-tight">{totalLessons}</p>
                                  </div>
                                  <div className="bg-[linear-gradient(145deg,rgba(11,18,32,0.8),rgba(5,7,11,0.9))] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_4px_20px_-5px_rgba(0,0,0,0.5)] rounded-2xl p-5 border border-white/5 hover:border-[#8DFF32]/30 transition-colors duration-300 group">
                                      <p className="text-[10px] font-mono font-bold text-[#8B96A8] tracking-widest uppercase mb-1 flex items-center justify-between">
                                          Projects <Code2 className="w-4 h-4 text-[#8B96A8]/50 group-hover:text-[#8DFF32] transition-colors" />
                                      </p>
                                      <p className="text-4xl font-black text-white tracking-tight">0{roadmap.projects.length}</p>
                                  </div>
                                  <div className="bg-[linear-gradient(145deg,rgba(11,18,32,0.8),rgba(5,7,11,0.9))] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_4px_20px_-5px_rgba(0,0,0,0.5)] rounded-2xl p-5 border border-white/5 hover:border-[#8DFF32]/30 transition-colors duration-300 group">
                                      <p className="text-[10px] font-mono font-bold text-[#8B96A8] tracking-widest uppercase mb-1">Duration</p>
                                      <p className="text-lg font-bold text-white tracking-tight mt-2">{roadmap.duration}</p>
                                  </div>
                                  <div className="bg-[linear-gradient(145deg,rgba(11,18,32,0.8),rgba(5,7,11,0.9))] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_4px_20px_-5px_rgba(0,0,0,0.5)] rounded-2xl p-5 border border-white/5 hover:border-[#8DFF32]/30 transition-colors duration-300 group">
                                      <p className="text-[10px] font-mono font-bold text-[#8B96A8] tracking-widest uppercase mb-1">Level</p>
                                      <p className="text-lg font-bold text-white tracking-tight mt-2">{roadmap.difficulty.split(' ')[0]}</p>
                                  </div>
                              </div>
                          </div>

                          {/* RIGHT COLUMN: Dynamic Progress Pipelines */}
                          <div className="flex flex-col justify-center gap-10 lg:pl-10">
                              {roadmap.modules.map((m, i) => (
                                  <div key={i} className="flex items-center gap-4 group">
                                      <span className="w-28 text-xs font-black tracking-[0.15em] text-white uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{m.phase}</span>
                                      <div className="flex-1 h-px bg-white/10 relative">
                                          <div className="absolute top-1/2 -translate-y-1/2 left-0 h-[2px] bg-[#8DFF32] shadow-[0_0_15px_#8DFF32] w-0 animate-grow-100" style={{ animationDelay: `${0.1 + (i * 0.3)}s` }}></div>
                                      </div>
                                      <div className="relative flex items-center justify-center">
                                          {i === 0 ? (
                                              <>
                                                  <div className="w-3 h-3 rounded-full bg-[#8DFF32] shadow-[0_0_15px_#8DFF32] z-10"></div>
                                                  <div className="absolute w-6 h-6 rounded-full border border-[#8DFF32]/50 animate-ping" style={{ animationDelay: '0.1s' }}></div>
                                              </>
                                          ) : (
                                              <>
                                                  <div className="w-3 h-3 rounded-full bg-[#8DFF32] shadow-[0_0_15px_#8DFF32] z-10 opacity-0 animate-blink-forwards" style={{ animationDelay: `${1.5 + (i * 0.3)}s` }}></div>
                                                  <div className="absolute w-6 h-6 rounded-full border border-[#8DFF32]/50 animate-ping opacity-0 animate-blink-forwards" style={{ animationDelay: `${1.5 + (i * 0.3)}s` }}></div>
                                                  <div className="absolute w-3 h-3 rounded-full bg-[#080D16] border border-white/20 z-0"></div>
                                              </>
                                          )}
                                      </div>
                                  </div>
                              ))}

                              {/* Production */}
                              <div className="flex items-center gap-4 group opacity-50">
                                  <span className="w-28 text-xs font-black tracking-[0.15em] text-[#8B96A8] uppercase">PRODUCTION</span>
                                  <div className="flex-1 h-[2px] bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_50%,transparent_50%)] bg-[length:10px_2px]"></div>
                                  <div className="relative flex items-center justify-center">
                                      <div className="w-3 h-3 rounded-full bg-[#080D16] border-2 border-[#8B96A8] z-10 transition-colors group-hover:border-white"></div>
                                  </div>
                              </div>

                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* ==========================================
           04 — THE ENGINEERING TIMELINE
      =========================================== */}
      <section className="py-24 bg-[#05070B] relative z-10 border-t border-white/5">
          {/* Ambient Background Glow */}
          <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-[#8DFF32]/5 rounded-full blur-[150px] pointer-events-none z-0 hidden md:block"></div>

          <div className="max-w-[1200px] mx-auto px-6 relative z-10 reveal">
              <div className="mb-20 md:mb-32">
                  <div className="flex items-center gap-3 mb-4">
                      <span className="font-mono text-[10px] font-bold text-[#8DFF32] tracking-[0.2em] uppercase">The Curriculum</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter">
                      Step-by-Step <span className="text-[#8B96A8]">Journey</span>
                  </h2>
              </div>

              <div className="relative w-full pb-20">
                  {/* Timeline Spine (Desktop: 25% from left, Mobile: 24px from left) */}
                  <div className="absolute left-[24px] md:left-[25%] top-0 bottom-0 w-px bg-white/10 z-0"></div>
                  
                  {/* Glowing Fill for the active portion */}
                  <div className="absolute left-[24px] md:left-[25%] top-0 bottom-1/2 w-px bg-[#8DFF32] shadow-[0_0_15px_#8DFF32] z-10 bg-gradient-to-b from-[#8DFF32] to-transparent"></div>

                  {roadmap.modules.map((mod, idx) => {
                      const isActive = expandedModule === idx;
                      const isPast = idx < expandedModule;

                      const modWeeks = mod.topics.reduce((acc, t) => acc + (parseInt(t.duration) || 1), 0);
                      const modLessons = mod.topics.reduce((acc, t) => acc + t.lessons.length, 0);

                      return (
                          <div key={idx} className={cn("relative flex flex-col md:flex-row mb-16 md:mb-24 group stage-container transition-all duration-500", !isActive && !isPast ? "opacity-60 hover:opacity-100" : "")}>
                              
                              {/* Node on Timeline */}
                              <div className="absolute left-[24px] md:left-[25%] top-[24px] md:top-[40px] -translate-x-1/2 flex items-center justify-center z-20">
                                  <div className={cn(
                                      "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                      isActive || isPast 
                                          ? "bg-[#05070B] border-[#8DFF32] shadow-[0_0_15px_rgba(141,255,50,0.5)] group-hover:scale-125" 
                                          : "bg-[#05070B] border-white/20 group-hover:border-[#8DFF32] group-hover:shadow-[0_0_15px_rgba(141,255,50,0.3)]"
                                  )}>
                                      {(isActive || isPast) && <div className="w-1.5 h-1.5 rounded-full bg-[#8DFF32] animate-pulse"></div>}
                                  </div>
                              </div>

                              {/* LEFT COLUMN: Phase Metadata (Desktop Only) */}
                              <div className="hidden md:block w-1/4 pr-12 text-right pt-8">
                                  <span className="block text-7xl font-black text-white tracking-tighter leading-none mb-2">0{idx + 1}</span>
                                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">{mod.phase}</h3>
                                  
                                  <div className="flex flex-col gap-3 items-end font-mono text-[10px] text-[#8B96A8] uppercase tracking-wider">
                                      <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#8DFF32]" /> {modWeeks} Weeks</span>
                                      <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-[#8DFF32]" /> {modLessons} Lessons</span>
                                      <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-[#8DFF32]" /> {mod.topics.length} Topics</span>
                                  </div>
                              </div>

                              {/* RIGHT COLUMN: The Content */}
                              <div className="w-full md:w-3/4 pl-16 md:pl-16">
                                  {isActive ? (
                                      // EXPANDED STATE
                                      <div className="bg-[linear-gradient(145deg,rgba(11,18,32,0.6),rgba(5,7,11,0.8))] backdrop-blur-xl border border-white/5 hover:border-[#8DFF32]/20 rounded-3xl p-6 md:p-10 relative overflow-hidden transition-all duration-500 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)] animate-fade-up">
                                          
                                          {/* Mobile Header */}
                                          <div className="md:hidden flex items-center gap-3 mb-6 font-mono text-[10px] text-white uppercase tracking-widest">
                                              <span className="font-black text-2xl text-[#8DFF32]">0{idx + 1}</span> {mod.phase}
                                          </div>

                                          <div className="flex items-start justify-between gap-6 mb-8">
                                              <div>
                                                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#8DFF32]/10 border border-[#8DFF32]/20 text-[10px] font-bold text-[#8DFF32] tracking-widest uppercase mb-4">
                                                      {mod.phase} Module
                                                  </div>
                                                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                                                      {mod.summary.split('—')[0].trim() || mod.summary}
                                                  </h3>
                                              </div>
                                          </div>

                                          {/* Technical Tree */}
                                          <div className="relative pl-6 border-l border-white/10 space-y-8 mt-10">
                                              {mod.topics.slice(0, 2).map((topic, tIdx) => (
                                                  <div key={tIdx} className="relative">
                                                      <div className={cn("absolute -left-[29px] top-1.5 w-2 h-2 rounded-full", tIdx === 0 ? "bg-[#8DFF32] shadow-[0_0_10px_#8DFF32]" : "bg-[#1E293B] border border-white/20")}></div>
                                                      
                                                      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                                                          <h4 className="text-lg font-bold text-white flex items-center gap-3">{topic.name}</h4>
                                                          <span className="px-2 py-1 bg-[#05070B] border border-white/5 rounded text-[10px] font-mono text-[#8B96A8] uppercase">{topic.duration}</span>
                                                      </div>
                                                      
                                                      <div className="font-mono text-xs text-[#8B96A8]/80 space-y-2.5 bg-[#05070B]/50 p-4 rounded-xl border border-white/5">
                                                          {topic.lessons.map((lesson, lIdx) => (
                                                              <p key={lIdx} className="flex items-start gap-3 hover:text-[#8DFF32] transition-colors">
                                                                  <span className="text-[#8DFF32] mt-0.5 text-[10px]">▹</span> <span className="leading-snug">{lesson}</span>
                                                              </p>
                                                          ))}
                                                      </div>
                                                  </div>
                                              ))}

                                              {mod.topics.length > 2 && (
                                                  <div className={cn("grid transition-all duration-500 ease-in-out", showFullSyllabus ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                                                      <div className="overflow-hidden">
                                                          <div className="space-y-8 pt-8 border-t border-white/5 mt-8">
                                                              {mod.topics.slice(2).map((topic, tIdx) => (
                                                                  <div key={tIdx + 2} className="relative">
                                                                      <div className="absolute -left-[29px] top-1.5 w-2 h-2 rounded-full bg-[#1E293B] border border-white/20"></div>
                                                                      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                                                                          <h4 className="text-lg font-bold text-white flex items-center gap-3">{topic.name}</h4>
                                                                          <span className="px-2 py-1 bg-[#05070B] border border-white/5 rounded text-[10px] font-mono text-[#8B96A8] uppercase">{topic.duration}</span>
                                                                      </div>
                                                                      <div className="font-mono text-xs text-[#8B96A8]/80 space-y-2.5 bg-[#05070B]/50 p-4 rounded-xl border border-white/5">
                                                                          {topic.lessons.map((lesson, lIdx) => (
                                                                              <p key={lIdx} className="flex items-start gap-3 hover:text-[#8DFF32] transition-colors">
                                                                                  <span className="text-[#8DFF32] mt-0.5 text-[10px]">▹</span> <span className="leading-snug">{lesson}</span>
                                                                              </p>
                                                                          ))}
                                                                      </div>
                                                                  </div>
                                                              ))}
                                                          </div>
                                                      </div>
                                                  </div>
                                              )}
                                          </div>

                                          {mod.topics.length > 2 && (
                                              <button 
                                                  onClick={() => setShowFullSyllabus(!showFullSyllabus)} 
                                                  className="mt-8 flex items-center gap-2 text-xs font-bold text-[#8DFF32] uppercase tracking-widest hover:text-white transition-colors"
                                              >
                                                  <span>{showFullSyllabus ? "Hide Syllabus" : "View Full Syllabus"}</span>
                                                  <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", showFullSyllabus ? "rotate-180" : "")} />
                                              </button>
                                          )}
                                      </div>
                                  ) : (
                                      // COLLAPSED STATE
                                      <div 
                                          onClick={() => { setExpandedModule(idx); setShowFullSyllabus(false); }}
                                          className="bg-[linear-gradient(145deg,rgba(11,18,32,0.6),rgba(5,7,11,0.8))] backdrop-blur-xl rounded-3xl p-6 md:p-8 cursor-pointer border border-white/5 hover:border-[#8DFF32]/20 transition-all duration-500 hover:shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)] group-hover:bg-[linear-gradient(145deg,rgba(11,18,32,0.8),rgba(5,7,11,0.9))]"
                                      >
                                          <div className="flex items-center justify-between gap-4">
                                              <div>
                                                  {/* Mobile Header in collapsed state */}
                                                  <div className="md:hidden flex items-center gap-3 mb-3 font-mono text-[10px] text-white uppercase tracking-widest">
                                                      <span className="font-black text-xl text-white/50">0{idx + 1}</span> {mod.phase}
                                                  </div>

                                                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-[#8B96A8] tracking-widest uppercase mb-3">
                                                      {mod.phase} Module
                                                  </div>
                                                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                                      {mod.summary.split('—')[0].trim() || mod.summary}
                                                  </h3>
                                              </div>
                                              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#8B96A8] group-hover:bg-[#8DFF32] group-hover:text-black group-hover:border-[#8DFF32] transition-all shrink-0">
                                                  <ArrowRight className="w-5 h-5" />
                                              </div>
                                          </div>
                                      </div>
                                  )}
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      </section>

      {/* ==========================================
           05 — BUILD LAB (PROJECTS)
      =========================================== */}
      {roadmap.projects && roadmap.projects.length > 0 && (
          <section className="py-20 lg:py-32 bg-[#05070B] relative z-10 border-t border-white/5 overflow-hidden">
              <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-[#8DFF32]/5 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen hidden md:block"></div>

              <div className="max-w-[1400px] mx-auto w-full relative z-10">
                  <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-12 lg:mb-20 px-6 lg:px-16 reveal">
                      <div className="max-w-2xl">
                          <div className="flex items-center gap-4 mb-6">
                              <span className="font-mono text-xs font-bold text-[#8DFF32] tracking-[0.2em] uppercase">Build Lab</span>
                              <div className="w-16 h-px bg-[#8DFF32]/30"></div>
                          </div>
                          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.1]">
                              Don't just learn it.<br/>
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8DFF32] to-emerald-400">Build it for production.</span>
                          </h2>
                      </div>
                      <div className="flex items-center gap-3 bg-[#0B1220] border border-white/10 rounded-full px-6 py-3 shadow-xl backdrop-blur-md">
                          <span className="font-mono text-[11px] font-bold text-white tracking-widest uppercase">{roadmap.projects.length} Capstone Projects</span>
                      </div>
                  </div>

                  <div 
                      className="relative w-full group reveal" 
                      onMouseEnter={() => setIsHovered(true)} 
                      onMouseLeave={() => { setIsHovered(false); if(isDragging.current) touchEnd(); }}
                  >
                      {/* Navigation Arrows */}
                      <button onClick={() => setCurrentProjectIdx((prev) => (prev - 1 + roadmap.projects.length) % roadmap.projects.length)} className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-[rgba(11,18,32,0.75)] backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:text-[#8DFF32] hover:scale-110 hover:bg-white/10 transition-all duration-300 shadow-2xl opacity-0 group-hover:opacity-100 hidden md:flex focus:opacity-100">
                          <ArrowLeft className="w-6 h-6" />
                      </button>
                      <button onClick={() => setCurrentProjectIdx((prev) => (prev + 1) % roadmap.projects.length)} className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-[rgba(11,18,32,0.75)] backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:text-[#8DFF32] hover:scale-110 hover:bg-white/10 transition-all duration-300 shadow-2xl opacity-0 group-hover:opacity-100 hidden md:flex focus:opacity-100">
                          <ArrowRight className="w-6 h-6" />
                      </button>

                      {/* Slider Viewport */}
                      <div className="overflow-hidden w-full relative touch-pan-y">
                          <div 
                              ref={trackRef}
                              onMouseDown={touchStart as any}
                              onMouseUp={touchEnd}
                              onMouseMove={touchMove as any}
                              onTouchStart={touchStart}
                              onTouchEnd={touchEnd}
                              onTouchMove={touchMove}
                              className="flex transition-transform duration-500 cursor-grab py-12"
                          >
                              {roadmap.projects.map((proj, idx) => {
                                  const icons = [ShoppingCart, LineChart, Lock, FileText, User];
                                  const Icon = icons[idx % icons.length];
                                  
                                  const imageMap = ["/prod4.png", "/prod3.jpg", "/prod1.png", "/prod5.webp", "/prod2.jpg"];
                                  const imgSrc = imageMap[idx % imageMap.length];
                                  
                                  const colorThemes = [
                                      { bg: "bg-[#8DFF32]/10", border: "border-[#8DFF32]/20", text: "text-[#8DFF32]" },
                                      { bg: "bg-white/5", border: "border-white/10", text: "text-white" },
                                      { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-400" },
                                      { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400" },
                                      { bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400" }
                                  ];
                                  const theme = colorThemes[idx % colorThemes.length];
                                  const isLeftAligned = idx % 2 !== 0;

                                  return (
                                      <div key={idx} className="w-full flex-shrink-0 px-6 lg:px-20 select-none">
                                          <article className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-center">
                                              
                                              {/* Text Overlay */}
                                              <div className={cn("lg:col-span-5 z-20", isLeftAligned ? "lg:col-start-8 lg:row-start-1 order-2 lg:-translate-x-12" : "lg:col-start-1 lg:row-start-1 order-2 lg:order-1 lg:translate-x-12")}>
                                                  <div className="bg-[rgba(11,18,32,0.75)] backdrop-blur-xl border border-white/10 p-8 lg:p-12 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] hover:border-[#8DFF32]/30 transition-colors duration-500">
                                                      <div className="flex items-center gap-3 mb-8">
                                                          <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center", theme.bg, theme.border, theme.text)}>
                                                              <Icon className="w-5 h-5" />
                                                          </div>
                                                          <span className="font-mono text-[10px] font-bold text-[#8B96A8] uppercase tracking-widest">Project 0{idx + 1}</span>
                                                      </div>
                                                      
                                                      <h3 className="text-3xl lg:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                                                          {proj.title.split(' ').map((word, wIdx) => (
                                                              <span key={wIdx}>
                                                                  {word}
                                                                  {wIdx === 0 && <br/>}
                                                                  {wIdx > 0 && wIdx < proj.title.split(' ').length - 1 && ' '}
                                                              </span>
                                                          ))}
                                                      </h3>
                                                      <p className="text-[#8B96A8] text-sm leading-relaxed mb-10">
                                                          {proj.description}
                                                      </p>
                                                      
                                                      <div className="flex flex-wrap gap-2 mb-10">
                                                          {proj.tech.map((t, tIdx) => (
                                                              <span key={tIdx} className="px-4 py-2 rounded-xl bg-[#05070B] border border-white/5 font-mono text-[10px] text-white tracking-wide">{t}</span>
                                                          ))}
                                                      </div>
                                                  </div>
                                              </div>

                                              {/* Cinematic Image */}
                                              <div className={cn("lg:col-span-8 z-10 rounded-[2.5rem] bg-[#0B1220] border border-white/10 shadow-2xl relative overflow-hidden", isLeftAligned ? "lg:col-start-1 lg:row-start-1 order-1" : "lg:col-start-5 lg:row-start-1 order-1 lg:order-2")}>
                                                  <div className="h-12 bg-[#05070B] border-b border-white/5 flex items-center px-6 gap-2 absolute top-0 w-full z-20">
                                                      <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                                                      <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                                                      <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                                                  </div>
                                                  <div className="pt-12 w-full aspect-[4/3] lg:aspect-[16/10] relative bg-[#05070B]">
                                                      <img src={imgSrc} alt={proj.title} className="w-full h-full object-cover opacity-80 mix-blend-lighten pointer-events-none select-none grayscale-[30%]" draggable="false" />
                                                      <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-transparent to-transparent pointer-events-none"></div>
                                                  </div>
                                              </div>

                                          </article>
                                      </div>
                                  );
                              })}
                          </div>
                      </div>

                      {/* Dots Navigation */}
                      <div className="flex items-center justify-center gap-3 mt-4">
                          {roadmap.projects.map((_, idx) => (
                              <button 
                                  key={idx} 
                                  onClick={() => setCurrentProjectIdx(idx)}
                                  className={cn("h-1.5 rounded-full transition-all duration-300", currentProjectIdx === idx ? "w-8 bg-[#8DFF32]" : "w-3 bg-white/20 hover:bg-white/50")}
                              ></button>
                          ))}
                      </div>
                  </div>
              </div>
          </section>
      )}

      {/* ==========================================
           06 — CAREER OUTCOMES
      =========================================== */}
      <section className="py-24 bg-slate-50 relative z-10 overflow-hidden">
          {/* Subtle Ambient Background Effects */}
          <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#8DFF32]/20 rounded-full blur-[120px] pointer-events-none animate-float z-0"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[150px] pointer-events-none animate-float z-0" style={{ animationDelay: '2s' }}></div>

          <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-8 relative z-10">
              
              {/* Section Header */}
              <div className="text-center max-w-3xl mx-auto mb-20 reveal">
                  <div className="inline-flex items-center gap-3 mb-6">
                      <span className="w-10 h-px bg-[#8DFF32]"></span>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Career Outcomes</span>
                      <span className="w-10 h-px bg-[#8DFF32]"></span>
                  </div>
                  <h2 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                      Your Future in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16a34a] to-emerald-400">Production</span>
                  </h2>
                  <p className="text-lg text-slate-600 font-medium leading-relaxed">
                      Master the exact skills that top-tier product companies actively hire for. Real-world salaries, robust hiring networks, and undeniable impact.
                  </p>
              </div>

              {/* Cinematic Career Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 xl:gap-10">
                  {roadmap.careers.map((career, idx) => {
                      const careerImages = [
                          "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800",
                          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
                          "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
                      ];
                      const imgSrc = careerImages[idx % careerImages.length];

                      return (
                          <div key={idx} className="group relative h-[550px] lg:h-[600px] rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 reveal" style={{ transitionDelay: `${(idx + 1) * 100}ms` }}>
                              
                              {/* Background Cinematic Image */}
                              <div className="absolute inset-0 bg-slate-900">
                                  <img src={imgSrc} alt={career.role} className="w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-110 transition-all duration-[1.5s] ease-out" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                              </div>

                              {/* Floating Glass Content Panel */}
                              <div className="absolute bottom-4 left-4 right-4 bg-[rgba(15,23,42,0.6)] backdrop-blur-xl border border-white/15 rounded-[2rem] p-6 sm:p-8 transform group-hover:-translate-y-2 transition-transform duration-500 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] group-hover:shadow-[0_15px_40px_0_rgba(34,197,94,0.2)] group-hover:border-green-400/50">
                                  
                                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                                      <div>
                                          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
                                              {career.role.split(' ').map((word, wIdx) => (
                                                  <span key={wIdx}>
                                                      {word}
                                                      {wIdx === 0 && <br/>}
                                                      {wIdx > 0 && wIdx < career.role.split(' ').length - 1 && ' '}
                                                  </span>
                                              ))}
                                          </h3>
                                      </div>
                                      {/* Salary Pill */}
                                      <div className="bg-[#22c55e] text-white px-4 py-2 rounded-full flex items-center gap-1.5 w-max flex-shrink-0 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                                          <span className="text-sm font-bold tracking-wide">{career.salary}</span>
                                      </div>
                                  </div>

                                  <div className="w-full h-px bg-white/10 mb-6"></div>

                                  {/* Hiring Network */}
                                  <div>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Hiring Network</p>
                                      <div className="flex flex-wrap gap-2">
                                          {career.companies.map((company, cIdx) => (
                                              <span key={cIdx} className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-xs font-semibold text-slate-200">
                                                  {company}
                                              </span>
                                          ))}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      );
                  })}
              </div>

              {/* Global Action CTA */}
              <div className="mt-16 text-center reveal" style={{ transitionDelay: '400ms' }}>
                  <button onClick={() => window.scrollTo(0,0)} className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-[#22c55e] hover:shadow-[0_15px_30px_-10px_rgba(34,197,94,0.5)] transition-all duration-300 group">
                      Start The Roadmap
                      <ArrowRight className="text-lg transform group-hover:translate-x-1 transition-transform w-5 h-5" />
                  </button>
              </div>

          </div>
      </section>

      {/* ==========================================
           07 — TUTORIALS, FAQ & FINAL CTA
      =========================================== */}
      <section className="py-24 bg-[#080D16] relative z-10 border-t border-white/5">
          {/* Ambient Background Effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8DFF32]/5 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen"></div>

          <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
              
              {/* Premium Section Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 lg:mb-20 reveal">
                  <div className="max-w-2xl">
                      <div className="flex items-center gap-4 mb-6">
                          <span className="w-12 h-px bg-[#8DFF32]"></span>
                          <span className="font-mono text-[10px] font-bold text-[#8DFF32] tracking-[0.25em] uppercase">Learning Signals</span>
                      </div>
                      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.05]">
                          Essential <br/>
                          <span className="text-[#8B96A8]">Documentation.</span>
                      </h2>
                  </div>
                  
                  <p className="text-sm font-medium text-[#8B96A8] max-w-sm leading-relaxed pb-2">
                      The foundational manuals, specifications, and curriculums every professional full-stack engineer must master.
                  </p>
              </div>

              {/* Cinematic Asymmetric Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-32">
                  {roadmap.resources.map((res, idx) => {
                      const pos = idx % 4;
                      // pos 0: col-span-2, pos 1: col-span-1, pos 2: col-span-1, pos 3: col-span-2
                      const colSpanClass = pos === 0 || pos === 3 ? "md:col-span-2 lg:col-span-2" : "md:col-span-1 lg:col-span-1";
                      
                      const resourceImages = [
                          "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=1200",
                          "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800",
                          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
                          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
                      ];
                      const imgSrc = resourceImages[idx % resourceImages.length];

                      const icons = [Globe, Atom, HardDrive, GitFork];
                      const Icon = icons[idx % icons.length];
                      
                      const themeColors = [
                          "group-hover:bg-[#8DFF32] group-hover:text-black group-hover:border-[#8DFF32]",
                          "group-hover:bg-[#61DAFB] group-hover:text-black group-hover:border-[#61DAFB]",
                          "group-hover:bg-[#339933] group-hover:text-white group-hover:border-[#339933]",
                          "group-hover:bg-[#CC9966] group-hover:text-white group-hover:border-[#CC9966]"
                      ];
                      const themeClass = themeColors[idx % themeColors.length];

                      return (
                          <a key={idx} href={res.url} target="_blank" rel="noopener noreferrer" className={cn("group relative h-[350px] sm:h-[400px] lg:h-[450px] rounded-[2rem] overflow-hidden bg-[#0B1220] border border-white/10 hover:border-[#8DFF32]/50 transition-all duration-500 shadow-2xl reveal block", colSpanClass)} style={{ transitionDelay: `${(idx + 1) * 100}ms` }}>
                              
                              {/* Background Image */}
                              <div className="absolute inset-0 z-0">
                                  <img src={imgSrc} alt={res.label} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1s] ease-out" />
                                  <div className={cn("absolute inset-0 bg-gradient-to-t from-[#05070B] to-transparent", pos === 0 || pos === 3 ? "via-[#05070B]/60" : "via-[#05070B]/80")}></div>
                              </div>

                              {/* Content Area */}
                              <div className="absolute inset-0 p-8 flex flex-col z-10">
                                  
                                  {/* Top Icon Badge */}
                                  <div className={cn("w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white mb-auto group-hover:scale-110 transition-all duration-500 shadow-lg ml-auto", themeClass)}>
                                      <Icon className="w-6 h-6" />
                                  </div>

                                  {/* Bottom Details */}
                                  <div>
                                      <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight group-hover:text-[#8DFF32] transition-colors duration-300">{res.label}</h3>
                                      
                                      <div className="translate-y-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                          <p className="text-sm text-[#8B96A8] font-medium leading-relaxed mb-6 max-w-md">
                                              Official documentation and essential guidelines for mastering this module's core technologies.
                                          </p>
                                          
                                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#8DFF32]">
                                              Access Resource 
                                              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </a>
                      );
                  })}
              </div>

              {/* Premium Knowledge Base / FAQ */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 pb-32">
                  
                  {/* LEFT COLUMN: Sticky Context & Visual */}
                  <div className="lg:col-span-5 relative">
                      <div className="lg:sticky lg:top-24 space-y-10">
                          
                          {/* Text Content */}
                          <div className="reveal">
                              <div className="flex items-center gap-4 mb-6">
                                  <span className="w-10 h-px bg-[#8DFF32]"></span>
                                  <span className="font-mono text-[10px] font-bold text-[#8DFF32] tracking-[0.25em] uppercase">Knowledge Base</span>
                              </div>
                              
                              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.05] mb-6">
                                  Clarity before <br/>
                                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8DFF32] to-emerald-400">execution.</span>
                              </h2>
                              
                              <p className="text-[#8B96A8] font-medium leading-relaxed max-w-sm">
                                  Everything you need to know about the curriculum, prerequisites, and how we transform absolute beginners into production-ready engineers.
                              </p>
                          </div>

                          {/* Cinematic Related Image */}
                          <div className="reveal relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl hidden sm:block animate-float">
                              <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800" alt="Code environment" className="w-full h-full object-cover mix-blend-luminosity opacity-70 hover:mix-blend-normal hover:opacity-100 hover:scale-105 transition-all duration-[1.5s] ease-out" />
                              
                              <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/40 to-transparent pointer-events-none"></div>
                              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem] pointer-events-none"></div>
                              
                              <div className="absolute bottom-6 left-6 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center filter drop-shadow-[0_0_15px_rgba(141,255,50,0.15)] pointer-events-none">
                                  <Terminal className="w-6 h-6 text-[#8DFF32]" />
                              </div>
                          </div>

                      </div>
                  </div>

                  {/* RIGHT COLUMN: Premium Borderless Accordion */}
                  <div className="lg:col-span-7 pt-4 lg:pt-0">
                      <div className="flex flex-col border-t border-white/10">
                          {FAQS.map((faq, i) => {
                              const isOpen = expandedFaq === i;
                              
                              return (
                                  <div key={i} className="reveal border-b border-white/10 group">
                                      <button 
                                          onClick={() => setExpandedFaq(isOpen ? null : i)}
                                          className="w-full py-8 flex items-start gap-6 lg:gap-8 text-left focus:outline-none"
                                      >
                                          <span className="font-mono text-sm font-bold text-[#8B96A8] group-hover:text-[#8DFF32] transition-colors mt-1 hidden sm:block">0{i + 1}</span>
                                          <div className="flex-1">
                                              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#8DFF32] transition-colors duration-300 pr-8">
                                                  {faq.q}
                                              </h3>
                                              
                                              {/* Expanding Content using CSS Grid trick directly in React */}
                                              <div 
                                                  className="grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                                                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                                              >
                                                  <div className="overflow-hidden">
                                                      <p className="pt-6 text-[#8B96A8] leading-relaxed font-medium">
                                                          {faq.a}
                                                      </p>
                                                  </div>
                                              </div>
                                          </div>
                                          <div className={cn("w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors duration-300 mt-0.5", isOpen ? "border-[#8DFF32]" : "border-white/10 group-hover:border-[#8DFF32]")}>
                                              <Plus className={cn("w-5 h-5 transition-transform duration-500", isOpen ? "rotate-45 text-[#8DFF32]" : "text-white")} />
                                          </div>
                                      </button>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
              </div>
          </div>
          
          {/* Final Circular CTA */}
          <div className="py-32 relative flex items-center justify-center overflow-hidden border-t border-white/5 bg-[radial-gradient(ellipse_at_top,rgba(141,255,50,0.05),transparent_70%)] reveal">
              <div className="relative z-10 text-center px-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8DFF32]/10 border border-[#8DFF32]/20 text-[10px] font-bold text-[#8DFF32] tracking-widest uppercase mb-8">
                      <span className="w-2 h-2 rounded-full bg-[#8DFF32] animate-pulse"></span>
                      SYSTEM READY
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
                      Ready to <span className="text-[#8DFF32] inline-block filter drop-shadow-[0_0_15px_rgba(141,255,50,0.3)]">Execute?</span>
                  </h2>
                  <p className="text-[#8B96A8] max-w-lg mx-auto mb-10 text-lg leading-relaxed">
                      Your journey to becoming a {roadmap.title} engineer starts right here. Access the full curriculum instantly.
                  </p>
                  <Link 
                      to="/" 
                      className="inline-flex items-center justify-center gap-3 bg-[#8DFF32] text-[#05070B] px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(141,255,50,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                  >
                      Initialize Training <ArrowRight className="w-4 h-4" />
                  </Link>
              </div>
          </div>
      </section>

    </main>
  );
}
