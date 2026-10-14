import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSession, signOut, type AdminSession } from "@/lib/auth";
import { 
  LogOut, 
  LayoutDashboard, 
  Briefcase, 
  UploadCloud, 
  Award,
  Users,
  Menu,
  X,
  Share2,
  Bell,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2
} from "lucide-react";
import { createSeoHead } from "@/lib/seo";
import { StudentTeamView } from "@/components/intern-portal/StudentTeamView";

export const Route = createFileRoute("/intern-portal")({
  head: () => createSeoHead({
    title: "Student Internship Portal — Infynux Academy",
    description: "Access your internship dashboard.",
    path: "/intern-portal",
    noindex: true,
  }),
  component: InterPortal,
});

type ViewState = 'dashboard' | 'team' | 'projects' | 'submissions' | 'certificate';

const NAV_ITEMS = [
  { label: "Dashboard", id: 'dashboard', icon: LayoutDashboard },
  { label: "Team", id: 'team', icon: Users },
  { label: "Projects", id: 'projects', icon: Briefcase },
  { label: "Submissions", id: 'submissions', icon: UploadCloud },
  { label: "Certificate", id: 'certificate', icon: Award },
];

function InterPortal() {
  const navigate = useNavigate();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  // Interactive navbar states
  const [teamData, setTeamData] = useState<{ id: string; name: string; members: { id: string; name: string; studentId: string }[] } | null>(null);
  const [showTeamPopover, setShowTeamPopover] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Sprint Tasks Assigned", desc: "Check your team deliverables for this week.", time: "10m ago", read: false },
    { id: 2, title: "Sprint Progress Milestone", desc: "Your team completed active milestone goals.", time: "2h ago", read: false },
    { id: 3, title: "Code Submission Verified", desc: "Mentor reviewed GitHub code deliverables.", time: "1d ago", read: false },
  ]);

  useEffect(() => {
    getSession().then((s) => {
      if (!s || s.role !== 'STUDENT') {
        navigate({ to: "/login" });
      } else {
        setSession(s);
        
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

        // Fetch student's assigned courses
        const fetchCourses = async () => {
          try {
            const res = await fetch(`${API_URL}/api/student/courses`, {
              credentials: 'include'
            });
            if (res.ok) {
              const data = await res.json();
              setCourses(Array.isArray(data) ? data : []);
            }
          } catch (err) {
            console.error("Failed to fetch courses:", err);
          } finally {
            setLoading(false);
          }
        };

        // Fetch student's assigned team for the navbar
        const fetchStudentTeam = async () => {
          try {
            const res = await fetch(`${API_URL}/api/student/teams`, {
              credentials: 'include'
            });
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data) && data.length > 0) {
                const current = data[0];
                setTeamData({
                  id: current.id,
                  name: current.name,
                  members: (current.members || []).map((m: any) => ({
                    id: m.id,
                    name: m.student?.name || "Student",
                    studentId: m.student?.studentId || "",
                  }))
                });
              }
            }
          } catch (err) {
            console.error("Failed to fetch team:", err);
          }
        };
        
        fetchCourses();
        fetchStudentTeam();
      }
    });
  }, [navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  const handleCopyShareLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://infynuxacademy.in/intern-portal';
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  if (loading || !session) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0D7A53] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#EFF2F6] font-sans">
      {/* Exact Navbar Design matching the reference with company logo and interactive controls */}
      <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/70 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3">
            {/* Left: Official Company Logo & Navigation Tabs */}
            <div className="flex items-center gap-3 lg:gap-5 min-w-0">
              {/* Company Logo Container */}
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="h-10 px-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center">
                  <img src="/INfynux-Logo 1.png" alt="Infynux Academy Logo" className="h-7 w-auto object-contain" />
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-black tracking-tight text-[#111317] leading-tight">
                    INFYNUX
                  </span>
                  <span className="text-[10px] font-bold text-[#0D7A53] tracking-wider uppercase leading-none">
                    Student Portal
                  </span>
                </div>
              </div>

              {/* Exact Pill Navigation Cluster */}
              <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-slate-100/70 border border-slate-200/60">
                {NAV_ITEMS.map((item) => {
                  const isActive = currentView === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id as ViewState)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all ${
                        isActive
                          ? "bg-[#111317] text-white font-bold shadow-sm"
                          : "bg-white/80 hover:bg-white text-slate-700 hover:text-[#111317] font-semibold border border-slate-200/80 shadow-xs"
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[#34D399]" : "text-slate-500"}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right: Functional Teammates Stack, Share Modal, Notification Center & Profile */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* 1. Functional Dynamic Teammate Avatar Stack */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowTeamPopover(!showTeamPopover);
                    setShowNotifications(false);
                    setShowShareModal(false);
                  }}
                  title={teamData ? `Team ${teamData.name} (${teamData.members.length} members)` : "View Team Members"}
                  className="flex items-center -space-x-2 p-1 rounded-full hover:bg-slate-100/80 transition-colors cursor-pointer group"
                >
                  {teamData && teamData.members.length > 0 ? (
                    <>
                      {teamData.members.slice(0, 3).map((member, idx) => (
                        <div
                          key={member.id}
                          title={member.name}
                          className={`h-8 w-8 rounded-full ${
                            idx === 0
                              ? "bg-[#111317] text-[#34D399]"
                              : idx === 1
                              ? "bg-[#0D7A53] text-white"
                              : "bg-emerald-700 text-white"
                          } font-extrabold text-xs flex items-center justify-center ring-2 ring-white shadow-xs uppercase`}
                        >
                          {member.name.charAt(0)}
                        </div>
                      ))}
                      {teamData.members.length > 3 && (
                        <div className="h-8 w-8 rounded-full bg-[#111317] text-slate-200 font-extrabold text-[11px] flex items-center justify-center ring-2 ring-white shadow-xs">
                          +{teamData.members.length - 3}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-8 px-2.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1.5 shadow-xs">
                      <Users className="h-3.5 w-3.5 text-[#0D7A53]" />
                      <span className="hidden lg:inline text-[11px] font-bold">My Team</span>
                    </div>
                  )}
                </button>

                {/* Team Members Popover Dropdown */}
                {showTeamPopover && (
                  <div className="absolute right-0 mt-2 w-72 rounded-[24px] bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-4 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Team Members</div>
                        <div className="text-sm font-extrabold text-[#111317]">{teamData ? teamData.name : "Your Team"}</div>
                      </div>
                      <button
                        onClick={() => setShowTeamPopover(false)}
                        className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 space-y-2 max-h-56 overflow-y-auto">
                      {teamData && teamData.members.length > 0 ? (
                        teamData.members.map((member) => {
                          const isSelf = member.studentId === session.studentId;
                          return (
                            <div key={member.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-[#E6F7F0]/60 transition-colors">
                              <div className="flex items-center gap-2.5">
                                <div className="h-7 w-7 rounded-full bg-[#111317] text-[#34D399] font-bold text-xs flex items-center justify-center uppercase">
                                  {member.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-[#111317] flex items-center gap-1.5">
                                    <span>{member.name}</span>
                                    {isSelf && (
                                      <span className="text-[9px] font-extrabold bg-[#0D7A53] text-white px-1.5 py-0.2 rounded-full">YOU</span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-mono">{member.studentId}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-400 py-3 text-center">No teammates assigned yet.</p>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentView('team');
                          setShowTeamPopover(false);
                        }}
                        className="w-full py-1.5 rounded-full text-xs font-bold bg-[#0D7A53] hover:bg-[#0A6B48] text-white text-center transition-colors"
                      >
                        Open Team Workspace
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Functional Shared Pill Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    handleCopyShareLink();
                    setShowShareModal(!showShareModal);
                    setShowNotifications(false);
                    setShowTeamPopover(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-white border border-slate-200/90 hover:bg-slate-50 hover:text-[#111317] transition-all shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#0D7A53]" />
                      <span className="text-[#0D7A53]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5 text-slate-500" />
                      <span>Shared</span>
                    </>
                  )}
                </button>

                {/* Share Dropdown Modal */}
                {showShareModal && (
                  <div className="absolute right-0 mt-2 w-80 rounded-[24px] bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-4 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Share Workspace</div>
                        <div className="text-sm font-extrabold text-[#111317]">Share Dashboard Link</div>
                      </div>
                      <button
                        onClick={() => setShowShareModal(false)}
                        className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 mt-2">
                      Copy link to your current dashboard view or invite teammates to review progress.
                    </p>

                    <div className="mt-3 flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                      <input
                        type="text"
                        readOnly
                        value={typeof window !== 'undefined' ? window.location.href : 'https://infynuxacademy.in/intern-portal'}
                        className="bg-transparent text-[11px] font-mono text-slate-700 w-full px-2 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyShareLink}
                        className="px-3 py-1 bg-[#111317] text-white rounded-xl text-xs font-bold hover:bg-[#0D7A53] transition-colors shrink-0 flex items-center gap-1"
                      >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-around pt-2 border-t border-slate-100 text-xs">
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`Check out our Infynux Academy Team Workspace: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-full bg-[#E6F7F0] text-[#064E3B] font-bold hover:bg-[#d5f3e4] transition-colors"
                      >
                        WhatsApp
                      </a>
                      <a
                        href={`mailto:?subject=${encodeURIComponent("Infynux Academy Team Workspace")}&body=${encodeURIComponent(`Here is the link: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                        className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                      >
                        Email
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Functional Notification Bell */}
              <div className="relative">
                <button
                  type="button"
                  title="Notifications"
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowShareModal(false);
                    setShowTeamPopover(false);
                  }}
                  className="relative w-9 h-9 rounded-full bg-white border border-slate-200/90 flex items-center justify-center text-slate-600 hover:text-[#111317] hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0D7A53] ring-2 ring-white animate-pulse"></span>
                  )}
                </button>

                {/* Notifications Dropdown Popover */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-[24px] bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-4 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-[#111317]">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F7F0] text-[#064E3B] border border-[#0D7A53]/30">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={handleMarkAllNotificationsRead}
                            className="text-[11px] font-bold text-[#0D7A53] hover:underline"
                          >
                            Mark all as read
                          </button>
                        )}
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                      {notifications.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3 rounded-2xl border transition-colors ${
                            !item.read
                              ? "bg-[#E6F7F0]/40 border-[#0D7A53]/30"
                              : "bg-slate-50/70 border-slate-200/60"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-[#111317]">{item.title}</span>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.time}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">Infynux Sprint Alerts</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentView('team');
                          setShowNotifications(false);
                        }}
                        className="text-[#0D7A53] font-bold hover:underline text-xs"
                      >
                        View Team Tasks →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Avatar & Info */}
              <div className="flex items-center gap-2 pl-1">
                <div className="h-9 w-9 rounded-full bg-[#111317] text-white font-extrabold flex items-center justify-center text-xs ring-2 ring-[#0D7A53]/30 shadow-sm uppercase">
                  {session.name.charAt(0)}
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-bold text-[#111317] leading-none">{session.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{session.studentId}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                title="Logout"
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all shadow-xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                className="p-2 text-[#111317] hover:bg-slate-100 rounded-full md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {sidebarOpen && (
          <div className="md:hidden border-t border-slate-200 bg-[#131622] px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id as ViewState);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#5B50E6] text-white"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-8">
            
            <header>
              <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Welcome, {session.name.split(' ')[0]}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Manage your remote internship workspace.
              </p>
            </header>

            {currentView === 'dashboard' && (
              <>
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                  <div className="px-4 py-5 sm:px-6 flex items-center justify-between bg-slate-50/50 border-b border-slate-100">
                    <h3 className="text-base font-semibold leading-6 text-slate-900">Student Profile</h3>
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 uppercase tracking-widest">
                      {session.role}
                    </span>
                  </div>
                  <div className="border-t border-slate-100">
                    <dl className="divide-y divide-slate-100">
                      <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-slate-500">Full name</dt>
                        <dd className="mt-1 text-sm text-slate-900 sm:col-span-2 sm:mt-0 font-medium">{session.name}</dd>
                      </div>
                      <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-slate-500">Student ID</dt>
                        <dd className="mt-1 text-sm text-slate-900 sm:col-span-2 sm:mt-0 font-mono bg-slate-100 w-fit px-2 py-0.5 rounded text-slate-700">{session.studentId}</dd>
                      </div>
                      <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-slate-500">Email address</dt>
                        <dd className="mt-1 text-sm text-slate-900 sm:col-span-2 sm:mt-0">{session.email}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Workspace Placeholder / Assigned Courses */}
                {courses.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {courses.map(course => (
                      <div key={course.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 flex flex-col group relative">
                        <div className="relative w-full overflow-hidden border-b border-slate-100" style={{ height: '230px' }}>
                          <img 
                            src={course.image || `/ui_${course.key}.png`}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/ui_web.png';
                            }}
                            alt={course.name} 
                            className="absolute inset-0 w-full h-full object-cover object-center" 
                          />
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {course.name}
                          </h3>
                          <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                            {course.description}
                          </p>
                          <div className="mt-4 pt-4 border-t border-slate-100">
                            <Link 
                              to="/tutorials"
                              search={{ filter: course.key }}
                              className="w-full flex justify-center rounded-xl bg-indigo-50 text-indigo-700 px-4 py-2 text-sm font-semibold hover:bg-indigo-100 transition-colors"
                            >
                              Access Course Workspace
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center bg-white/50">
                    <Briefcase className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">My Internship</h3>
                    <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                      No courses have been assigned to your workspace yet. Please contact your administrator.
                    </p>
                  </div>
                )}
              </>
            )}

            {currentView === 'team' && (
              <StudentTeamView session={session} />
            )}

            {currentView === 'projects' && (
              <ProjectsView />
            )}

            {currentView === 'submissions' && (
              <SubmissionsView />
            )}

            {currentView === 'certificate' && (
              <StudentCertificateView />
            )}

          </div>
      </main>
    </div>
  );
}

function ProjectsView() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState<any>(null);
  
  // Submit Form State
  const [content, setContent] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  
  // State for toggling instructions view
  const [viewingPhaseId, setViewingPhaseId] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/student/projects`, { credentials: 'include' });
      if (res.ok) {
        setProjects(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhase) return;
    setIsSubmitting(true);
    setFormError("");
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/student/phases/${selectedPhase.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content, repoUrl, liveUrl })
      });
      if (res.ok) {
        setSelectedPhase(null);
        setContent(""); setRepoUrl(""); setLiveUrl("");
        fetchProjects(); // Refresh the list
      } else {
        const d = await res.json();
        setFormError(d.message || "Failed to submit work");
      }
    } catch (err) {
      setFormError("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'AVAILABLE': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'CHANGES_REQUESTED': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'SUBMITTED': 
      case 'UNDER_REVIEW': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  if (selectedPhase) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-w-3xl mx-auto">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <button onClick={() => setSelectedPhase(null)} className="p-1 hover:bg-slate-200 rounded-md">
            <X className="w-5 h-5 text-slate-600" />
          </button>
          <h3 className="text-lg font-semibold text-slate-900">Submit Work: {selectedPhase.phase.title}</h3>
        </div>
        <div className="p-6">
          {selectedPhase.phase.topics && selectedPhase.phase.topics.length > 0 && (
            <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-2">📚 Topics to Know</h4>
              <div className="space-y-4">
                {selectedPhase.phase.topics.map((t: any, idx: number) => (
                  <div key={idx} className="border-l-4 border-indigo-500 pl-4 py-1">
                    <h5 className="font-semibold text-slate-800">{t.title}</h5>
                    {t.description && <p className="text-sm text-slate-600 mt-1">{t.description}</p>}
                    <a href={t.blogUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-indigo-600 font-semibold mt-2 hover:text-indigo-800">
                      Read Article &rarr;
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-2">📋 Instructions</h4>
            <div className="text-sm text-slate-600 whitespace-pre-wrap">{selectedPhase.phase.instructions}</div>
          </div>
          
          {formError && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{formError}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Work Description / Comments</label>
              <textarea required value={content} onChange={e=>setContent(e.target.value)} rows={5} className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm" placeholder="Explain what you implemented..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Repository URL</label>
              <input type="url" required value={repoUrl} onChange={e=>setRepoUrl(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Live Demo URL</label>
              <input type="url" required value={liveUrl} onChange={e=>setLiveUrl(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" placeholder="https://..." />
            </div>
            <div className="pt-4">
              <button disabled={isSubmitting} type="submit" className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700">
                {isSubmitting ? "Submitting..." : "Submit for Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center bg-white/50">
          <Briefcase className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">No Projects Assigned</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            You haven't been assigned to any internship projects yet.
          </p>
        </div>
      ) : (
        projects.map((sp: any) => (
          <div key={sp.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">{sp.project?.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{sp.project?.description}</p>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-slate-800 mb-4">Internship Timeline</h4>
              <div className="space-y-4">
                {(!sp.phases || sp.phases.length === 0) && (
                  <div className="p-6 bg-white border border-slate-200 rounded-xl text-center text-slate-500 shadow-sm">
                    Your internship roadmap is being prepared.
                  </div>
                )}
                {sp.phases?.sort((a:any, b:any) => a.phase.phaseOrder - b.phase.phaseOrder).map((phase: any, idx: number) => {
                  const isInteractive = phase.status === 'AVAILABLE' || phase.status === 'CHANGES_REQUESTED';
                  return (
                    <div key={phase.id} className={`flex gap-4 p-4 rounded-xl border ${getStatusColor(phase.status)} bg-white shadow-sm`}>
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm bg-slate-100 text-slate-600">
                        {idx + 1}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-bold text-slate-900">{phase.phase.title}</h5>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusColor(phase.status).replace('bg-','bg-opacity-20 text-')}`}>{phase.status}</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{phase.phase.description}</p>
                        
                        <div className="flex flex-wrap gap-2 pt-3 mt-3 border-t border-slate-100">
                          <button 
                            onClick={() => setViewingPhaseId(viewingPhaseId === phase.id ? null : phase.id)} 
                            className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200"
                          >
                            {viewingPhaseId === phase.id ? "Hide Instructions" : "View Instructions"}
                          </button>
                          {isInteractive && (
                            <button onClick={() => setSelectedPhase(phase)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
                              Submit Work
                            </button>
                          )}
                        </div>

                        {viewingPhaseId === phase.id && (
                          <>
                            {phase.phase.topics && phase.phase.topics.length > 0 && (
                              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-slate-800 mb-2">📚 Topics to Know</h4>
                                <div className="space-y-4">
                                  {phase.phase.topics.map((t: any, idx: number) => (
                                    <div key={idx} className="border-l-4 border-indigo-500 pl-4 py-1">
                                      <h5 className="font-semibold text-slate-800">{t.title}</h5>
                                      {t.description && <p className="text-sm text-slate-600 mt-1">{t.description}</p>}
                                      <a href={t.blogUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-indigo-600 font-semibold mt-2 hover:text-indigo-800">
                                        Read Article &rarr;
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                              <h4 className="font-bold text-slate-800 mb-2">📋 Instructions</h4>
                              <div className="text-sm text-slate-600 whitespace-pre-wrap">{phase.phase.instructions}</div>
                            </div>
                          </>
                        )}
                        
                        {phase.submissions?.length > 0 && (
                          <div className="mt-3 text-xs text-slate-500">
                            <strong>Latest feedback:</strong> {
                              phase.submissions[0]?.reviews?.[0]?.feedback || "Waiting for review..."
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function StudentCertificateView() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/student/certificate`, { credentials: 'include' });
        if (res.ok) {
          setCertificates(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <Award className="h-6 w-6 text-indigo-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">My Certificates</h3>
      </div>
      
      {loading ? (
        <div className="text-center py-8 text-slate-500">Loading...</div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <Award className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h4 className="text-lg font-medium text-slate-900">No certificates yet</h4>
          <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
            Complete your internship project and have it approved to earn your certificate.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {certificates.map((cert) => (
            <div key={cert.id} className="relative border border-slate-200 rounded-xl p-6 bg-gradient-to-br from-slate-50 to-white shadow-sm hover:shadow-md transition-shadow">
              {cert.status === 'REVOKED' && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-xl flex items-center justify-center z-10">
                  <span className="bg-red-100 text-red-800 text-lg font-bold px-4 py-2 rounded-lg rotate-[-15deg] border-2 border-red-500">
                    REVOKED
                  </span>
                </div>
              )}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-lg text-slate-900">Internship Certificate</h4>
                  <p className="text-sm font-medium text-indigo-600">{cert.studentCourse?.course?.name}</p>
                </div>
                <Award className={`h-10 w-10 ${cert.status === 'ACTIVE' ? 'text-indigo-600' : 'text-slate-300'}`} />
              </div>
              <div className="space-y-2 mb-6">
                <p className="text-sm text-slate-600"><span className="font-semibold">Issued To:</span> {cert.studentCourse?.student?.name}</p>
                <p className="text-sm text-slate-600"><span className="font-semibold">Date:</span> {new Date(cert.issuedAt).toLocaleDateString()}</p>
                {cert.grade && <p className="text-sm text-slate-600"><span className="font-semibold">Grade:</span> {cert.grade}</p>}
                <p className="text-sm text-slate-600"><span className="font-semibold">Certificate ID:</span> <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">{cert.certificateNo}</span></p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <button 
                  onClick={() => {
                    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                    window.open(`${API_URL}/api/student/certificate/download/${cert.studentCourse?.id}`, '_blank');
                  }}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold text-center hover:bg-indigo-700 transition-colors"
                >
                  Download Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SubmissionsView() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/student/projects`, { credentials: 'include' });
        if (res.ok) {
          setProjects(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const allSubmissions = projects.flatMap(sp => 
    sp.phases?.flatMap((p: any) => 
      p.submissions?.map((sub: any) => ({
        ...sub,
        projectTitle: sp.project?.title,
        phaseTitle: p.phase?.title,
      })) || []
    ) || []
  ).sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
        <h3 className="text-lg font-semibold text-slate-900">My Submissions</h3>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading submissions...</div>
        ) : allSubmissions.length === 0 ? (
          <div className="p-12 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-medium text-slate-900">No submissions yet</h3>
            <p className="mt-1 text-sm text-slate-500">When you submit work for a phase, it will appear here.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-slate-900 uppercase">Project / Phase</th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase">Date</th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase">Status</th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase">Latest Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {allSubmissions.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-50">
                  <td className="py-4 pl-6 pr-3 text-sm text-slate-600">
                    <div className="font-semibold text-slate-800">{sub.projectTitle}</div>
                    <div className="text-xs">{sub.phaseTitle}</div>
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-500">
                    {new Date(sub.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      sub.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 
                      sub.status === 'REJECTED' ? 'bg-red-50 text-red-700 ring-red-600/20' : 
                      sub.status === 'CHANGES_REQUESTED' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' : 
                      'bg-blue-50 text-blue-700 ring-blue-600/20'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-600 max-w-xs truncate">
                    {sub.reviews?.[0]?.feedback || "Waiting for review..."}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

