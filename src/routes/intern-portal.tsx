import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSession, signOut, type AdminSession } from "@/lib/auth";
import { 
  LogOut, 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  Briefcase, 
  UploadCloud, 
  BarChart, 
  Award,
  Menu,
  X
} from "lucide-react";

export const Route = createFileRoute("/intern-portal")({
  head: () => ({
    meta: [
      { title: "Student Internship Portal — Infynux Academy" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: InterPortal,
});

type ViewState = 'dashboard' | 'learning' | 'tasks' | 'projects' | 'submissions' | 'progress' | 'certificate';


const NAV_ITEMS = [
  { label: "Dashboard", id: 'dashboard', icon: LayoutDashboard, active: true },
  { label: "Learning", id: 'learning', icon: BookOpen, active: false },
  { label: "Tasks", id: 'tasks', icon: CheckSquare, active: false },
  { label: "Projects", id: 'projects', icon: Briefcase, active: true },
  { label: "Submissions", id: 'submissions', icon: UploadCloud, active: true },
  { label: "Progress", id: 'progress', icon: BarChart, active: false },
  { label: "Certificate", id: 'certificate', icon: Award, active: true },
];

function InterPortal() {
  const navigate = useNavigate();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  useEffect(() => {
    getSession().then((s) => {
      if (!s || s.role !== 'STUDENT') {
        navigate({ to: "/login" });
      } else {
        setSession(s);
        
        // Fetch student's assigned courses
        const fetchCourses = async () => {
          try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
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
        
        fetchCourses();
      }
    });
  }, [navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  if (loading || !session) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0A0A0A] overflow-hidden font-sans">
      
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="relative z-50 lg:hidden">
          <div className="fixed inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-[#0A0A0A] pb-4 shadow-xl text-white">
            <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-white/10">
              <span className="text-lg font-bold font-orbitron tracking-wide text-white">Infynux <span className="text-emerald-400">Academy</span></span>
              <button type="button" className="-m-2.5 p-2.5 text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <SidebarNav 
              handleLogout={handleLogout}
              currentView={currentView}
              setCurrentView={setCurrentView}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-[#0A0A0A] flex-shrink-0 text-white">
        <div className="flex h-16 shrink-0 items-center px-6">
          <span className="text-xl font-bold font-orbitron tracking-wide text-white mt-4">Infynux <span className="text-emerald-400">Academy</span></span>
        </div>
        <SidebarNav 
          handleLogout={handleLogout}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      </aside>

      {/* Main Container (Curvy Inner Bar) */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[#f4f7f6] lg:rounded-tl-[2rem] lg:rounded-bl-[2rem] lg:my-2 lg:mr-2 shadow-2xl relative">
        
        {/* Header inside the curvy area */}
        <header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200/60 bg-white/80 px-4 sm:gap-x-6 sm:px-6 lg:px-8 backdrop-blur-md">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-slate-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center justify-between">
            <h1 className="text-sm font-bold text-slate-900 uppercase tracking-widest font-orbitron lg:hidden">
              Intern Portal
            </h1>
            <div className="hidden lg:block"></div>
            
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900 leading-none">{session.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{session.studentId}</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 font-bold uppercase text-sm shadow-inner">
                  {session.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#f4f7f6] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl space-y-8">
            
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
                            <button className="w-full rounded-xl bg-indigo-50 text-indigo-700 px-4 py-2 text-sm font-semibold hover:bg-indigo-100 transition-colors">
                              Access Course Workspace
                            </button>
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
    </div>
  );
}

function SidebarNav({ 
  handleLogout,
  currentView,
  setCurrentView
}: { 
  handleLogout: () => void,
  currentView?: string,
  setCurrentView?: (v: any) => void
}) {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto px-4 py-6">
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    disabled={!item.active}
                    onClick={() => { if(item.active && setCurrentView) setCurrentView(item.id) }}
                    className={`group flex w-full items-center gap-x-3 rounded-lg p-3 text-sm font-medium transition-all ${
                      currentView === item.id && item.active
                        ? "bg-[#1E50FF] text-white shadow-sm"
                        : "text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 shrink-0 ${
                        item.active ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                      }`}
                      aria-hidden="true"
                    />
                    {item.label}
                    {!item.active && (
                      <span className="ml-auto text-[10px] uppercase tracking-wider font-bold bg-white/10 text-white/60 px-2 py-0.5 rounded-full">
                        Soon
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </li>
          
          <li className="mt-auto">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center gap-x-3 rounded-lg p-3 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-5 w-5 shrink-0 text-slate-500 group-hover:text-red-400" aria-hidden="true" />
              Logout
            </button>
          </li>
        </ul>
      </nav>
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
          <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-2">Instructions</h4>
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
                          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <h4 className="font-bold text-slate-800 mb-2">Instructions</h4>
                            <div className="text-sm text-slate-600 whitespace-pre-wrap">{phase.phase.instructions}</div>
                          </div>
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
                  <p className="text-sm font-medium text-indigo-600">{cert.studentProject.project.title}</p>
                </div>
                <Award className={`h-10 w-10 ${cert.status === 'ACTIVE' ? 'text-indigo-600' : 'text-slate-300'}`} />
              </div>
              <div className="space-y-2 mb-6">
                <p className="text-sm text-slate-600"><span className="font-semibold">Issued To:</span> {cert.student.name}</p>
                <p className="text-sm text-slate-600"><span className="font-semibold">Date:</span> {new Date(cert.issuedAt).toLocaleDateString()}</p>
                {cert.grade && <p className="text-sm text-slate-600"><span className="font-semibold">Grade:</span> {cert.grade}</p>}
                <p className="text-sm text-slate-600"><span className="font-semibold">Certificate ID:</span> <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">{cert.certificateNo}</span></p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <a 
                  href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/certificates/verify/${cert.verificationToken}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-lg text-sm font-semibold text-center hover:bg-indigo-100 transition-colors"
                >
                  Verify Online
                </a>
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

