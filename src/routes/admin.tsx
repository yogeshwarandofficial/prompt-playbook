import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { DomainsView } from "../components/admin/DomainsView";
import { BatchesView } from "../components/admin/BatchesView";

import { ApplicationsView } from "../components/admin/ApplicationsView";
import { InterviewsView } from "../components/admin/InterviewsView";
import { CertificatesView } from "../components/admin/CertificatesView";

import { getSession, signOut, type AdminSession } from "@/lib/auth";
import { 
  LogOut, 
  LayoutDashboard, 
  Users,
  UserPlus,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Briefcase,
  ClipboardList,
  Plus, Edit, ListChecks, UserCheck, ChevronUp, ChevronDown, Trash2, Eye, ArrowLeft, ExternalLink, MessageSquare, Check, XCircle,
  Target, Map
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Infynux Academy" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminDashboard,
});

type ViewState = 'dashboard' | 'applications' | 'mentors' | 'students' | 'batches' | 'domains' | 'courses' | 'events' | 'projects' | 'interviews' | 'certificates' | 'analytics' | 'submissions';

function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  useEffect(() => {
    getSession().then((s) => {
      if (!s || (s.role !== 'ADMIN' && s.role !== 'SUPER_ADMIN')) {
        navigate({ to: "/login" });
      } else {
        setSession(s);
        setLoading(false);
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
              <span className="text-lg font-bold font-orbitron tracking-wide text-white">Academy<span className="text-indigo-400">Admin</span></span>
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
          <span className="text-xl font-bold font-orbitron tracking-wide text-white mt-4">Academy<span className="text-indigo-400">Admin</span></span>
        </div>
        <SidebarNav 
          handleLogout={handleLogout} 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
        />
      </aside>

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[#f4f7f6] lg:rounded-tl-[2.5rem] lg:rounded-bl-[2.5rem] lg:my-2 lg:mr-2 shadow-2xl relative">
        
        {/* Header */}
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
              Admin
            </h1>
            <div className="hidden lg:block"></div>
            
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900 leading-none">{session.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{session.role}</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold uppercase text-sm shadow-inner">
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
                {currentView === 'dashboard' && 'Admin Dashboard'}
                {currentView === 'students' && 'Student Management'}
                {currentView === 'courses' && 'Course Management'}
                {currentView === 'events' && 'Event Management'}
                {currentView === 'projects' && 'Project Management'}
                {currentView === 'submissions' && 'Submission Reviews'}
              </h2>
            </header>

            {currentView === 'dashboard' && (
              <DashboardView />
            )}

            
            {currentView === 'domains' && <DomainsView />}
            {currentView === 'batches' && <BatchesView />}

            {currentView === 'applications' && <ApplicationsView />}
            {currentView === 'mentors' && <div className="p-8 text-center text-slate-500">Mentors view coming soon</div>}
            {currentView === 'interviews' && <InterviewsView />}
            {currentView === 'certificates' && <CertificatesView />}
            {currentView === 'analytics' && <div className="p-8 text-center text-slate-500">Analytics view coming soon</div>}

            {currentView === 'students' && (
              <StudentsView />
            )}

            {currentView === 'courses' && (
              <CoursesView />
            )}

            {currentView === 'events' && (
              <EventsView />
            )}

            {currentView === 'projects' && (
              <ProjectsView />
            )}

            {currentView === 'submissions' && (
              <SubmissionsView />
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
  currentView: ViewState,
  setCurrentView: (view: ViewState) => void
}) {
  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <li>
      <button
        type="button"
        onClick={() => setCurrentView(view)}
        className={`group flex w-full items-center gap-x-3 rounded-lg p-2.5 text-sm font-medium transition-all ${
          currentView === view
            ? "bg-indigo-600 text-white shadow-sm"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        <Icon className={`h-5 w-5 shrink-0 ${currentView === view ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
        {label}
      </button>
    </li>
  );

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto px-4 py-6">
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-6">
          <li>
            <ul role="list" className="space-y-1">
              <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            </ul>
          </li>
          
          <li>
            <div className="text-xs font-semibold leading-6 text-slate-500 uppercase tracking-wider mb-2 px-2">People</div>
            <ul role="list" className="space-y-1">
              <NavItem view="applications" icon={UserPlus} label="Applications" />
              <NavItem view="students" icon={Users} label="Students" />
              <NavItem view="mentors" icon={UserCheck} label="Mentors" />
            </ul>
          </li>
          
          <li>
            <div className="text-xs font-semibold leading-6 text-slate-500 uppercase tracking-wider mb-2 px-2">Academy</div>
            <ul role="list" className="space-y-1">
              <NavItem view="domains" icon={CheckCircle2} label="Domains" />
              <NavItem view="batches" icon={Briefcase} label="Batches" />
            </ul>
          </li>
          
          <li>
            <div className="text-xs font-semibold leading-6 text-slate-500 uppercase tracking-wider mb-2 px-2">Content</div>
            <ul role="list" className="space-y-1">

              <NavItem view="projects" icon={Briefcase} label="Projects" />
              <NavItem view="courses" icon={BookOpen} label="Courses" />
              <NavItem view="events" icon={BookOpen} label="Events" />
            </ul>
          </li>
          
          <li>
            <div className="text-xs font-semibold leading-6 text-slate-500 uppercase tracking-wider mb-2 px-2">Evaluation</div>
            <ul role="list" className="space-y-1">
              <NavItem view="submissions" icon={ListChecks} label="Submissions" />
              <NavItem view="interviews" icon={MessageSquare} label="Interviews" />
              <NavItem view="certificates" icon={CheckCircle2} label="Certificates" />
            </ul>
          </li>

          <li className="mt-auto pt-6">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center gap-x-3 rounded-lg p-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all"
            >
              <LogOut className="h-5 w-5 shrink-0 text-slate-500 group-hover:text-slate-300" />
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function DashboardView() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/admin/dashboard/stats`, { credentials: 'include' });
        if (res.ok) {
          setStats(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="p-12 text-center text-slate-500">Failed to load dashboard statistics.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Academy Overview</h2>
          <p className="text-slate-500 mt-1">Real-time statistics across all programs and students.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Total Students</div>
            <div className="text-3xl font-bold text-slate-900">{stats.totalStudents}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Active Students</div>
            <div className="text-3xl font-bold text-slate-900">{stats.activeStudents}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Active Projects</div>
            <div className="text-3xl font-bold text-slate-900">{stats.activeProjects}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
            <ClipboardList className="w-8 h-8" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Pending Submissions</div>
            <div className="text-3xl font-bold text-slate-900">{stats.pendingSubmissions}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Admissions</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">Pending Applications</span>
              <span className="font-bold text-slate-900">{stats.pendingApplications}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">Scheduled Interviews</span>
              <span className="font-bold text-slate-900">{stats.scheduledInterviews}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600">Active Batches</span>
              <span className="font-bold text-slate-900">{stats.activeBatches}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Curriculum</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">Active Courses</span>
              <span className="font-bold text-slate-900">{stats.activeCourses}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">In-progress Assignments</span>
              <span className="font-bold text-slate-900">{stats.inProgressAssignments}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600">Completed Internships</span>
              <span className="font-bold text-slate-900">{stats.completedInternships}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Graduation</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">Issued Certificates</span>
              <span className="font-bold text-slate-900">{stats.issuedCertificates}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentsView() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add course to existing student
  const [addCourseFor, setAddCourseFor] = useState<any | null>(null);
  const [addCourseId, setAddCourseId] = useState("");
  const [addCourseLoading, setAddCourseLoading] = useState(false);
  const [addCourseError, setAddCourseError] = useState("");

  const fetchStudents = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/students`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/courses`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableCourses(data.filter((c: any) => c.isActive));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ studentId, name, email, password, courseIds: selectedCourses }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setFormSuccess(`Student created successfully! Student ID: ${data.studentId}. Provide the temporary password to the student securely.`);
        setStudentId("");
        setName("");
        setEmail("");
        setPassword("");
        setSelectedCourses([]);
        fetchStudents();
      } else {
        setFormError(data.message || "Failed to create student");
      }
    } catch (err) {
      setFormError("Network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCourse = async () => {
    if (!addCourseFor || !addCourseId) return;
    setAddCourseLoading(true);
    setAddCourseError("");
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/students/${addCourseFor.id}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ courseId: addCourseId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to assign course');
      setAddCourseFor(null);
      setAddCourseId("");
      fetchStudents();
    } catch (err: any) {
      setAddCourseError(err.message);
    } finally {
      setAddCourseLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Create Student Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <UserPlus className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Create New Student</h3>
        </div>
        <div className="p-6">
          {formError && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {formError}
            </div>
          )}
          {formSuccess && (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {formSuccess}
            </div>
          )}

          <form onSubmit={handleCreateStudent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Student ID</label>
              <input 
                type="text" 
                required 
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="INFY-26-WEB-001"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Temporary Password</label>
              <input 
                type="text" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="SecurePassword123"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
              />
            </div>

            {/* Course Selection */}
            <div className="md:col-span-2 pt-2">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Assign Courses (Optional)</label>
              {availableCourses.length === 0 ? (
                <p className="text-sm text-slate-500">No courses available. Create courses first.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {availableCourses.map(course => (
                    <label 
                      key={course.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        selectedCourses.includes(course.id)
                          ? 'bg-indigo-50 border-indigo-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                        checked={selectedCourses.includes(course.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCourses([...selectedCourses, course.id]);
                          } else {
                            setSelectedCourses(selectedCourses.filter(id => id !== course.id));
                          }
                        }}
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-900 leading-none mb-1">{course.name}</div>
                        <div className="text-xs text-slate-500">{course.key}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2 pt-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-60"
              >
                {isSubmitting ? "Creating..." : "Create Student"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-2 rounded-lg">
              <Users className="h-5 w-5 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Student Roster</h3>
          </div>
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
            {students.length} Total
          </span>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No students found.</div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Courses
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-slate-900">
                      <span className="bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono text-xs border border-slate-200">
                        {student.studentId}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-900">
                      {student.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      {student.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      {student.isActive ? (
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-500">
                      {student.courses && student.courses.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {student.courses.map((sc: any) => (
                            <span key={sc.course.id} className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200 uppercase">
                              {sc.course.key}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-xs">None</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm flex gap-2">
                      <button
                        onClick={() => { setAddCourseFor(student); setAddCourseId(""); setAddCourseError(""); }}
                        className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                      >
                        <Plus className="h-3 w-3" /> Add Course
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                            const res = await fetch(`${API_URL}/api/admin/students/${student.id}/access`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              credentials: 'include',
                              body: JSON.stringify({ enabled: !student.isActive }),
                            });
                            if (!res.ok) throw new Error('Failed to update access');
                            fetchStudents();
                          } catch(err) {
                            alert('Failed to update student access');
                          }
                        }}
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium transition-colors ${student.isActive ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                      >
                        {student.isActive ? 'Revoke Access' : 'Restore Access'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Course Modal */}
      {addCourseFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Course</h3>
                <p className="text-xs text-slate-500 mt-0.5">{addCourseFor.name} &middot; {addCourseFor.studentId}</p>
              </div>
              <button onClick={() => setAddCourseFor(null)} className="text-slate-400 hover:text-slate-700">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {addCourseError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />{addCourseError}
              </div>
            )}

            {addCourseFor.courses && addCourseFor.courses.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Currently Enrolled</p>
                <div className="flex flex-wrap gap-1.5">
                  {addCourseFor.courses.map((sc: any) => (
                    <span key={sc.course.id} className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded border border-indigo-200">
                      {sc.course.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Course to Add</label>
            <select
              value={addCourseId}
              onChange={(e) => setAddCourseId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none mb-5"
            >
              <option value="">— pick a course —</option>
              {availableCourses
                .filter(c => !(addCourseFor.courses || []).some((sc: any) => sc.course.id === c.id))
                .map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))
              }
            </select>

            <div className="flex gap-3">
              <button
                onClick={() => setAddCourseFor(null)}
                disabled={addCourseLoading}
                className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCourse}
                disabled={!addCourseId || addCourseLoading}
                className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
              >
                {addCourseLoading ? 'Assigning…' : 'Assign Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CoursesView() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [skills, setSkills] = useState("");
  const [image, setImage] = useState("");
  
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [courseToRemove, setCourseToRemove] = useState<any>(null);

  const confirmRemove = (course: any) => {
    setCourseToRemove(course);
  };

  const handleRemove = async () => {
    if (!courseToRemove) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/courses/${courseToRemove.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setCourseToRemove(null);
        fetchCourses();
      } else {
        alert("Failed to remove course.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/courses/${id}/restore`, {
        method: 'PATCH',
        credentials: 'include'
      });
      if (res.ok) {
        fetchCourses();
      } else {
        alert("Failed to restore course.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  const fetchCourses = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/courses`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const parsedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
      
      const res = await fetch(`${API_URL}/api/admin/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          key, 
          name, 
          description, 
          duration, 
          skills: parsedSkills,
          ...(image && { image })
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setFormSuccess(`Course "${data.name}" created successfully!`);
        setKey("");
        setName("");
        setDescription("");
        setDuration("");
        setSkills("");
        setImage("");
        fetchCourses();
      } else {
        setFormError(data.message || "Failed to create course");
      }
    } catch (err) {
      setFormError("Network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Create Course Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <BookOpen className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Create New Course</h3>
        </div>
        <div className="p-6">
          {formError && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {formError}
            </div>
          )}
          {formSuccess && (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {formSuccess}
            </div>
          )}

          <form onSubmit={handleCreateCourse} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Course Key (Unique)</label>
              <input 
                type="text" 
                required 
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="e.g. cyber"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Course Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Cybersecurity Fundamentals"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea 
                required 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of the course..."
                rows={2}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Duration</label>
              <input 
                type="text" 
                required 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 4-6 Months"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Image URL (Optional)</label>
              <input 
                type="text" 
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/ui_cyber.png (will use fallback if empty)"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Skills (Comma separated)</label>
              <input 
                type="text" 
                required 
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Linux, Networking, Pen Testing"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
              />
            </div>
            
            <div className="md:col-span-2 pt-2">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-60"
              >
                {isSubmitting ? "Creating..." : "Create Course"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Course List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-2 rounded-lg">
              <BookOpen className="h-5 w-5 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Course Catalog</h3>
          </div>
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
            {courses.length} Courses
          </span>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No courses found.</div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Course Key
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-slate-900">
                      <span className="bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono text-xs border border-slate-200">
                        {course.key}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-900">
                      {course.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      {course.duration}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      {course.isActive ? (
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                      {course.isActive ? (
                        <button
                          onClick={() => confirmRemove(course)}
                          className="text-red-600 hover:text-red-900 font-semibold"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestore(course.id)}
                          className="text-indigo-600 hover:text-indigo-900 font-semibold"
                        >
                          Restore
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {courseToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-[#0A0A0A]/50 backdrop-blur-sm transition-opacity" onClick={() => setCourseToRemove(null)} />
          <div className="relative z-50 w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <h3 className="text-lg font-bold leading-6 text-slate-900 mb-2">
              Remove {courseToRemove.name}?
            </h3>
            <div className="mt-2">
              <p className="text-sm text-slate-500">
                This course will no longer appear in the public Internships catalog. Existing student assignments will be preserved.
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="inline-flex justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none"
                onClick={() => setCourseToRemove(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-xl border border-transparent bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none"
                onClick={handleRemove}
              >
                Remove Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function EventsView() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [eventToRemove, setEventToRemove] = useState<any>(null);

  const fetchEvents = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/events`, {
        credentials: 'omit' // public endpoint
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setIsSubmitting(true);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const payload = {
        title,
        description,
        imageUrl: imageUrl || undefined,
        link: link || undefined,
        date: new Date(`${date}T${time}`).toISOString(),
      };
      
      const res = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create event');
      }
      
      setFormSuccess("Event created successfully!");
      setTitle("");
      setDescription("");
      setImageUrl("");
      setLink("");
      setDate("");
      setTime("");
      
      fetchEvents();
      setTimeout(() => setFormSuccess(""), 3000);
      
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmRemove = (event: any) => {
    setEventToRemove(event);
  };

  const handleRemove = async () => {
    if (!eventToRemove) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/events/${eventToRemove.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setEventToRemove(null);
        fetchEvents();
      } else {
        alert("Failed to remove event.");
      }
    } catch (e) {
      console.error(e);
      alert("Error removing event.");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Create New Event</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {formSuccess}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="Tech Talk 2024" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cloudinary Image URL</label>
              <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="https://res.cloudinary.com/..." />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Event Link</label>
              <input type="url" value={link} onChange={e => setLink(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="https://..." />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full rounded-xl border border-slate-300 px-2 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                <input type="time" required value={time} onChange={e => setTime(e.target.value)} className="w-full rounded-xl border border-slate-300 px-2 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </div>
            </div>
            
            <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-50">
              {isSubmitting ? "Creating..." : "Create Event"}
            </button>
          </form>
        </div>
      </div>
      
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="text-lg font-bold text-slate-900">Manage Events</h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No events found. Create one.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase">Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase">Date</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-900 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {events.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {evt.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(evt.date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <button onClick={() => confirmRemove(evt)} className="text-red-600 hover:text-red-900 font-medium">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {eventToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-[#0A0A0A]/50 backdrop-blur-sm" onClick={() => setEventToRemove(null)} />
          <div className="relative z-50 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Remove Event?</h3>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => setEventToRemove(null)}>Cancel</button>
              <button type="button" className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700" onClick={handleRemove}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export function ProjectsView() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'phases' | 'assign' | 'details'>('list');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Phase form
  const [phaseTitle, setPhaseTitle] = useState("");
  const [phaseDesc, setPhaseDesc] = useState("");
  const [phaseInst, setPhaseInst] = useState("");
  const [editingPhaseId, setEditingPhaseId] = useState("");
  const [phaseTopics, setPhaseTopics] = useState<any[]>([]);

  // Assign form
  const [assignStudentId, setAssignStudentId] = useState("");
  const [projectAssignments, setProjectAssignments] = useState<any[]>([]);

  const fetchProjectAssignments = async (projectId: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/project-assignments?projectId=${projectId}`, { credentials: 'include' });
      if (res.ok) {
        setProjectAssignments(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (viewMode === 'assign' && selectedProject) {
      fetchProjectAssignments(selectedProject.id);
    }
  }, [viewMode, selectedProject]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/projects`, { credentials: 'include' });
      if (res.ok) {
        setProjects(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoursesAndStudents = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const [cRes, sRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/courses`, { credentials: 'include' }),
        fetch(`${API_URL}/api/admin/students`, { credentials: 'include' })
      ]);
      if (cRes.ok) setCourses(await cRes.json());
      if (sRes.ok) setStudents(await sRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchCoursesAndStudents();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCourseId("");
    setProjectLink("");
    setStatus("DRAFT");
    setFormError("");
    setFormSuccess("");
  };

  const handleCreateSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setFormError("");
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, description, courseId: courseId || undefined, projectLink: projectLink || undefined, status })
      });
      if (res.ok) {
        await fetchProjects();
        setViewMode('list');
      } else {
        const data = await res.json();
        setFormError(data.message || "Failed to create project");
      }
    } catch (err) {
      setFormError("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setFormError("");
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/projects/${selectedProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, description, courseId: courseId || null, projectLink: projectLink || null, status })
      });
      if (res.ok) {
        await fetchProjects();
        setViewMode('list');
      } else {
        const data = await res.json();
        setFormError(data.message || "Failed to update project");
      }
    } catch (err) {
      setFormError("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        await fetchProjects();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete project");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const reloadSelectedProject = async (id: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/projects/${id}`, { credentials: 'include' });
      if (res.ok) {
        setSelectedProject(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const url = editingPhaseId 
        ? `${API_URL}/api/admin/projects/${selectedProject.id}/phases/${editingPhaseId}`
        : `${API_URL}/api/admin/projects/${selectedProject.id}/phases`;
      
      const res = await fetch(url, {
        method: editingPhaseId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: phaseTitle, description: phaseDesc, instructions: phaseInst })
      });
      
      if (res.ok) {
        const phaseData = await res.json();
        const phaseId = editingPhaseId || phaseData.id;

        // Save topics
        for (let i = 0; i < phaseTopics.length; i++) {
          const t = phaseTopics[i];
          if (t.isDeleted && t.id) {
            await fetch(`${API_URL}/api/admin/projects/${selectedProject.id}/phases/${phaseId}/topics/${t.id}`, { method: 'DELETE', credentials: 'include' });
          } else if (!t.isDeleted && t.id) {
            await fetch(`${API_URL}/api/admin/projects/${selectedProject.id}/phases/${phaseId}/topics/${t.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ title: t.title, description: t.description, blogUrl: t.blogUrl, order: i + 1 })
            });
          } else if (!t.isDeleted && !t.id) {
            await fetch(`${API_URL}/api/admin/projects/${selectedProject.id}/phases/${phaseId}/topics`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ title: t.title, description: t.description, blogUrl: t.blogUrl, order: i + 1 })
            });
          }
        }

        setPhaseTitle(""); setPhaseDesc(""); setPhaseInst(""); setEditingPhaseId(""); setPhaseTopics([]);
        await reloadSelectedProject(selectedProject.id);
        await fetchProjects();
      } else {
        const d = await res.json();
        alert(d.message || "Failed to save phase");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const movePhase = async (phaseId: string, direction: 'up' | 'down') => {
    const phases = [...(selectedProject.phases || [])].sort((a,b) => a.phaseOrder - b.phaseOrder);
    const idx = phases.findIndex(p => p.id === phaseId);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === phases.length - 1) return;

    const reordered = [...phases];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];

    // Backend expects { phaseIds: [id1, id2, ...] } in desired order
    const phaseIds = reordered.map(p => p.id);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/projects/${selectedProject.id}/phases/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phaseIds })
      });
      if (res.ok) {
        await reloadSelectedProject(selectedProject.id);
      }
    } catch (err) {
      alert("Error reordering phases");
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");
    setFormSuccess("");
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/project-assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ studentId: assignStudentId, projectId: selectedProject.id })
      });
      if (res.ok) {
        setFormSuccess("Project assigned successfully!");
        setAssignStudentId("");
        await fetchProjects();
        if (selectedProject) fetchProjectAssignments(selectedProject.id);
      } else {
        const d = await res.json();
        setFormError(d.message || "Failed to assign project");
      }
    } catch (err) {
      setFormError("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnassignProject = async (assignmentId: string) => {
    if (!window.confirm("Are you sure you want to unassign this student from the project?")) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/project-assignments/${assignmentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        await fetchProjects();
        if (selectedProject) fetchProjectAssignments(selectedProject.id);
      } else {
        const d = await res.json();
        alert(d.message || "Failed to unassign project");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <button onClick={() => setViewMode('list')} className="p-1 hover:bg-slate-200 rounded-md">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h3 className="text-lg font-semibold text-slate-900">
            {viewMode === 'create' ? 'Create Project' : 'Edit Project'}
          </h3>
        </div>
        <div className="p-6">
          {formError && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{formError}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
              <input required type="text" value={title} onChange={e=>setTitle(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
              <textarea required value={description} onChange={e=>setDescription(e.target.value)} rows={3} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Course (Optional)</label>
                <select value={courseId} onChange={e=>setCourseId(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm">
                  <option value="">-- No Course --</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm">
                  <option value="DRAFT">DRAFT</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Project Link (Optional)</label>
                <input type="url" placeholder="https://notion.so/..." value={projectLink} onChange={e=>setProjectLink(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
              </div>
            </div>
          </div>

          {viewMode === 'edit' && selectedProject && (
            <div className="mt-12 border-t border-slate-200 pt-8">
              <div className="mb-6 flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">PROJECT ROADMAP</h3>
                  <p className="text-sm text-slate-500 mt-1">Define the phases students will follow to complete this project.</p>
                </div>
                <button type="button" onClick={() => { setEditingPhaseId(""); setPhaseTitle(""); setPhaseDesc(""); setPhaseInst(""); setPhaseTopics([]); }} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-100 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Phase
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-slate-800 mb-4">Existing Phases</h4>
                  {(!selectedProject.phases || selectedProject.phases.length === 0) ? <p className="text-sm text-slate-500">No phases have been added to this project yet.</p> : (
                    <div className="space-y-3">
                      {[...(selectedProject.phases || [])].sort((a,b) => a.phaseOrder - b.phaseOrder).map((p: any, idx: number, arr: any[]) => (
                        <div key={p.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex items-start justify-between">
                          <div>
                            <h5 className="font-semibold text-slate-900">Phase {idx + 1}: {p.title}</h5>
                            <p className="text-xs text-slate-500 mt-1">{p.description}</p>
                            <p className="text-xs text-slate-400 font-semibold mt-1">Topics to Know: {p.topics?.length || 0}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => movePhase(p.id, 'up')} disabled={idx===0} className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30"><ChevronUp className="w-4 h-4"/></button>
                            <button type="button" onClick={() => movePhase(p.id, 'down')} disabled={idx===arr.length-1} className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30"><ChevronDown className="w-4 h-4"/></button>
                            <button type="button" onClick={() => {
                              setEditingPhaseId(p.id); setPhaseTitle(p.title); setPhaseDesc(p.description); setPhaseInst(p.instructions);
                              setPhaseTopics(p.topics ? JSON.parse(JSON.stringify(p.topics)) : []);
                            }} className="p-1 text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4"/></button>
                            <button type="button" onClick={() => handleDeletePhase(p.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-4">{editingPhaseId ? "Edit Phase" : "Add New Phase"}</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                      <input required type="text" value={phaseTitle} onChange={e=>setPhaseTitle(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                      <textarea required value={phaseDesc} onChange={e=>setPhaseDesc(e.target.value)} rows={2} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Instructions / Requirements</label>
                      <textarea required value={phaseInst} onChange={e=>setPhaseInst(e.target.value)} rows={4} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-semibold text-slate-700">Topics to Know</label>
                        <button type="button" onClick={() => setPhaseTopics([...phaseTopics, { title: '', description: '', blogUrl: '' }])} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-100">+ Add Topic</button>
                      </div>
                      {phaseTopics.length === 0 ? <p className="text-xs text-slate-500">No topics added.</p> : (
                        <div className="space-y-3">
                          {phaseTopics.map((topic, idx) => (
                            <div key={idx} className="border border-slate-200 rounded-lg p-3 bg-white space-y-3">
                              <div className="flex justify-between items-center">
                                <h6 className="text-xs font-bold text-slate-700">Topic {idx + 1}</h6>
                                <div className="flex items-center gap-1">
                                  <button type="button" onClick={() => {
                                    if(idx===0) return;
                                    const t = [...phaseTopics];
                                    [t[idx], t[idx-1]] = [t[idx-1], t[idx]];
                                    setPhaseTopics(t);
                                  }} disabled={idx===0} className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30"><ChevronUp className="w-3 h-3"/></button>
                                  <button type="button" onClick={() => {
                                    if(idx===phaseTopics.length-1) return;
                                    const t = [...phaseTopics];
                                    [t[idx], t[idx+1]] = [t[idx+1], t[idx]];
                                    setPhaseTopics(t);
                                  }} disabled={idx===phaseTopics.length-1} className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30"><ChevronDown className="w-3 h-3"/></button>
                                  <button type="button" onClick={() => {
                                    setPhaseTopics(phaseTopics.filter((_, i) => i !== idx));
                                  }} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-3 h-3"/></button>
                                </div>
                              </div>
                              <input required type="text" placeholder="Topic Title" value={topic.title} onChange={e => {
                                const t = [...phaseTopics]; t[idx].title = e.target.value; setPhaseTopics(t);
                              }} className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs" />
                              <textarea placeholder="Short Description" value={topic.description} onChange={e => {
                                const t = [...phaseTopics]; t[idx].description = e.target.value; setPhaseTopics(t);
                              }} rows={2} className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs" />
                              <input required type="url" placeholder="Blog/Resource URL" value={topic.blogUrl} onChange={e => {
                                const t = [...phaseTopics]; t[idx].blogUrl = e.target.value; setPhaseTopics(t);
                              }} className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="pt-4 flex justify-end">
                      <button type="button" onClick={(e) => handlePhaseSubmit(e)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700">
                        {editingPhaseId ? "Save Phase Changes" : "Save New Phase"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-8 mt-8 border-t border-slate-200">
            <button disabled={isSubmitting} type="button" onClick={() => viewMode === 'create' ? handleCreateSubmit() : handleEditSubmit()} className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700">
              {isSubmitting ? "Saving..." : "Save Project"}
            </button>
          </div>
        </div>
      </div>
    );
  }



  if (viewMode === 'assign' && selectedProject) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-w-2xl mx-auto">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <button onClick={() => setViewMode('list')} className="p-1 hover:bg-slate-200 rounded-md">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h3 className="text-lg font-semibold text-slate-900">Assign Project: {selectedProject.title}</h3>
        </div>
        <div className="p-6">
          {formError && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{formError}</div>}
          {formSuccess && <div className="mb-4 text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg">{formSuccess}</div>}
          
          <form onSubmit={handleAssignSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Select Student</label>
              <select required value={assignStudentId} onChange={e=>setAssignStudentId(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm">
                <option value="">-- Choose Student --</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>)}
              </select>
            </div>
            <div className="pt-2">
              <button disabled={isSubmitting} type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700">
                Assign Project
              </button>
            </div>
          </form>

          {projectAssignments.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h4 className="text-sm font-semibold text-slate-700 mb-4">Assigned Students ({projectAssignments.length})</h4>
              <div className="space-y-3">
                {projectAssignments.map(assignment => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white shadow-sm">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{assignment.student.name}</p>
                      <p className="text-xs text-slate-500">{assignment.student.studentId} • {assignment.student.email}</p>
                    </div>
                    <button
                      onClick={() => handleUnassignProject(assignment.id)}
                      className="text-slate-400 hover:text-red-600 p-2"
                      title="Unassign Student"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default List View
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Projects</h3>
        <button onClick={() => { resetForm(); setViewMode('create'); }} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Project
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-lg font-medium text-slate-900">No internship projects yet</h3>
              <p className="mt-1 text-sm text-slate-500">Get started by creating a new project template.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-slate-900 uppercase">Title</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase">Status</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase">Phases</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase">Students</th>
                  <th className="px-3 py-3.5 text-right text-xs font-semibold text-slate-900 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-4 pl-6 pr-3 text-sm font-medium text-slate-900">{p.title}</td>
                    <td className="px-3 py-4 text-sm">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        p.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 
                        p.status === 'DRAFT' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' : 
                        'bg-slate-50 text-slate-700 ring-slate-600/20'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-500">{p._count?.phases || 0} phases</td>
                    <td className="px-3 py-4 text-sm text-slate-500">{p._count?.assignments || 0} assigned</td>
                    <td className="px-3 py-4 text-sm text-right flex items-center justify-end gap-2">
                      <button onClick={() => { setSelectedProject(p); setTitle(p.title); setDescription(p.description); setCourseId(p.courseId||""); setProjectLink(p.projectLink||""); setStatus(p.status); reloadSelectedProject(p.id).then(()=>setViewMode('edit')); }} className="text-slate-400 hover:text-indigo-600" title="Edit"><Edit className="w-4 h-4"/></button>
                      <button onClick={() => { setSelectedProject(p); reloadSelectedProject(p.id).then(()=>setViewMode('phases')); }} className="text-slate-400 hover:text-indigo-600" title="Manage Phases"><ListChecks className="w-4 h-4"/></button>
                      <button onClick={() => { setSelectedProject(p); setViewMode('assign'); }} className="text-slate-400 hover:text-emerald-600" title="Assign Student"><UserCheck className="w-4 h-4"/></button>
                      <button onClick={() => handleDeleteProject(p.id)} className="text-slate-400 hover:text-red-600" title="Delete Project"><Trash2 className="w-4 h-4"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}


export function SubmissionsView() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");
  const [selectedSub, setSelectedSub] = useState<any>(null);
  
  const [reviewDecision, setReviewDecision] = useState("APPROVED");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const statusParam = filter === 'PENDING' ? '?status=SUBMITTED' : (filter === 'REVIEWED' ? '?status=APPROVED,REJECTED,CHANGES_REQUESTED' : '');
      const res = await fetch(`${API_URL}/api/admin/submissions${statusParam}`, { credentials: 'include' });
      if (res.ok) {
        setSubmissions(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    setIsSubmitting(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/admin/submissions/${selectedSub.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ decision: reviewDecision, feedback })
      });
      if (res.ok) {
        setSelectedSub(null);
        setFeedback("");
        fetchSubmissions();
      } else {
        const d = await res.json();
        alert(d.message || "Failed to submit review");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (selectedSub) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedSub(null)} className="p-1 hover:bg-slate-200 rounded-md">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h3 className="text-lg font-semibold text-slate-900">Review Submission</h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            selectedSub.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
            selectedSub.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
            selectedSub.status === 'CHANGES_REQUESTED' ? 'bg-amber-100 text-amber-700' :
            'bg-blue-100 text-blue-700'
          }`}>{selectedSub.status}</span>
        </div>
        
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-slate-800 mb-4">Submission Details</h4>
            <div className="space-y-4 text-sm">
              <div><strong className="text-slate-600 block">Student</strong> {selectedSub.studentProjectPhase?.studentProject?.student?.name} ({selectedSub.studentProjectPhase?.studentProject?.student?.studentId})</div>
              <div><strong className="text-slate-600 block">Project</strong> {selectedSub.studentProjectPhase?.studentProject?.project?.title}</div>
              <div><strong className="text-slate-600 block">Phase</strong> {selectedSub.studentProjectPhase?.phase?.title}</div>
              
              <div className="pt-4 border-t border-slate-100">
                <strong className="text-slate-600 block mb-2">Student's Work / Comments:</strong>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 whitespace-pre-wrap">{selectedSub.content || "No text provided."}</div>
              </div>
              
              {(selectedSub.repoUrl || selectedSub.liveUrl) && (
                <div className="flex gap-4 pt-4">
                  {selectedSub.repoUrl && (
                    <a href={selectedSub.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-indigo-600 hover:underline">
                      <ExternalLink className="w-4 h-4"/> Repository
                    </a>
                  )}
                  {selectedSub.liveUrl && (
                    <a href={selectedSub.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-indigo-600 hover:underline">
                      <Eye className="w-4 h-4"/> Live Demo
                    </a>
                  )}
                </div>
              )}
            </div>

            {selectedSub.automatedReviews?.length > 0 && selectedSub.automatedReviews[0] && (
              <div className="mt-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg"><CheckCircle2 className="w-4 h-4" /></span>
                  Automated Advisory Analysis
                </h4>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-sm">
                      <span className="text-slate-500 font-medium">Suggestion:</span> <strong className="text-indigo-700 ml-1">{selectedSub.automatedReviews[0].suggestedDecision}</strong>
                    </div>
                    <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-sm">
                      <span className="text-slate-500 font-medium">Confidence:</span> <strong className="text-indigo-700 ml-1">{selectedSub.automatedReviews[0].confidenceScore}%</strong>
                    </div>
                  </div>
                  <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed mt-2 p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                    {selectedSub.automatedReviews[0].analysis}
                  </div>
                </div>
              </div>
            )}

            {selectedSub.reviews?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h4 className="font-bold text-slate-800 mb-4">Past Reviews</h4>
                <div className="space-y-3">
                  {selectedSub.reviews.map((r: any) => (
                    <div key={r.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex justify-between items-start mb-1 text-xs">
                        <span className="font-bold text-slate-700">{r.reviewer?.name}</span>
                        <span className="text-slate-500">{new Date(r.reviewedAt).toLocaleString()}</span>
                      </div>
                      <div className="text-xs font-bold mb-1">{r.decision}</div>
                      <p className="text-sm text-slate-600">{r.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 mb-4">Add Review</h4>
            <form onSubmit={handleReview} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Decision</label>
                <div className="grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => setReviewDecision('APPROVED')} className={`py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 border ${reviewDecision === 'APPROVED' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-300 text-slate-600'}`}><CheckCircle2 className="w-4 h-4"/> Approve</button>
                  <button type="button" onClick={() => setReviewDecision('CHANGES_REQUESTED')} className={`py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 border ${reviewDecision === 'CHANGES_REQUESTED' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-white border-slate-300 text-slate-600'}`}><AlertCircle className="w-4 h-4"/> Request Changes</button>
                  <button type="button" onClick={() => setReviewDecision('REJECTED')} className={`py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 border ${reviewDecision === 'REJECTED' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-slate-300 text-slate-600'}`}><XCircle className="w-4 h-4"/> Reject</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Feedback</label>
                <textarea required value={feedback} onChange={e=>setFeedback(e.target.value)} rows={5} className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm" placeholder="Explain your decision..." />
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50">
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Submissions</h3>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button onClick={() => setFilter('ALL')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${filter === 'ALL' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>All</button>
          <button onClick={() => setFilter('PENDING')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${filter === 'PENDING' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Pending</button>
          <button onClick={() => setFilter('REVIEWED')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${filter === 'REVIEWED' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Reviewed</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading submissions...</div>
          ) : submissions.length === 0 ? (
            <div className="p-12 text-center">
              <ClipboardList className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-lg font-medium text-slate-900">No submissions found</h3>
              <p className="mt-1 text-sm text-slate-500">Try changing the filter or check back later.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-slate-900 uppercase">Student</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase">Project / Phase</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase">Date</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase">Status</th>
                  <th className="px-3 py-3.5 text-right text-xs font-semibold text-slate-900 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {submissions.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="py-4 pl-6 pr-3 text-sm font-medium text-slate-900">
                      {sub.studentProjectPhase?.studentProject?.student?.name}
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-600">
                      <div className="font-semibold text-slate-800">{sub.studentProjectPhase?.project?.title || "Unknown Project"}</div>
                      <div className="text-xs">{sub.studentProjectPhase?.phase?.title}</div>
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
                    <td className="px-3 py-4 text-sm text-right">
                      <button onClick={() => setSelectedSub(sub)} className="text-indigo-600 hover:text-indigo-900 font-semibold inline-flex items-center gap-1">
                        Review <ArrowLeft className="w-3 h-3 rotate-180" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

