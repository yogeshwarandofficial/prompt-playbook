import React, { useState, useEffect, useCallback } from "react";
import {
  Plus, Trash2, X, Users, CheckCircle2, Clock, AlertCircle, Calendar,
  ChevronDown, ChevronUp, ChevronRight, UserPlus, ClipboardList, Save,
  Edit, Loader2, ExternalLink, FileText, BarChart3, CheckSquare,
  ArrowUpRight, Sparkles
} from "lucide-react";

const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:3001";

function GithubIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusBadge(status: string) {
  const map: Record<string, string> = {
    PENDING:     "bg-[#E6F7F0] text-[#064E3B] border border-[#0D7A53]/30 font-bold",
    IN_PROGRESS: "bg-[#111317] text-[#34D399] border border-[#111317] font-bold",
    COMPLETED:   "bg-[#0D7A53] text-white border border-[#0A6B48] font-bold",
    CANCELLED:   "bg-slate-100 text-slate-500 border border-slate-200 font-medium",
  };
  return map[status] ?? "bg-slate-100 text-slate-600 border border-slate-200 font-medium";
}

function statusIcon(status: string) {
  if (status === "COMPLETED")   return <CheckCircle2 className="h-3.5 w-3.5 text-white" />;
  if (status === "IN_PROGRESS") return <Clock className="h-3.5 w-3.5 text-[#34D399]" />;
  if (status === "CANCELLED")   return <AlertCircle className="h-3.5 w-3.5 text-slate-400" />;
  return <Clock className="h-3.5 w-3.5 text-[#064E3B]" />;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface Student { id: string; name: string; email: string; studentId: string; }
interface TeamTask {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: string;
  taskUrl?: string;
  submissionContent?: string;
  submissionUrl?: string;
  submittedAt?: string;
  createdAt: string;
}
interface TeamMember {
  id: string; studentId: string; joinedAt: string;
  student: Student; tasks: TeamTask[];
}
interface Team {
  id: string; name: string; description?: string;
  isActive: boolean; createdAt: string;
  members: TeamMember[];
  _count?: { members: number };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TeamsView() {
  const [teams, setTeams]         = useState<Team[]>([]);
  const [students, setStudents]   = useState<Student[]>([]);
  const [loading, setLoading]     = useState(true);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  // Modal states
  const [showCreateTeam, setShowCreateTeam]   = useState(false);
  const [showAddMember, setShowAddMember]     = useState<string | null>(null);
  const [showAddTask, setShowAddTask]         = useState<{ teamId: string; memberId: string } | null>(null);
  const [editingTask, setEditingTask]         = useState<TeamTask | null>(null);
  const [viewingSubmission, setViewingSubmission] = useState<TeamTask | null>(null);

  const fetchTeams = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/teams`, { credentials: "include" });
      if (res.ok) {
        const data: Team[] = await res.json();
        setTeams(data);
        // Default expand first team if none expanded
        if (data.length > 0 && !expandedTeam) {
          setExpandedTeam(data[0].id);
        }
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [expandedTeam]);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/teams/students`, { credentials: "include" });
      if (res.ok) setStudents(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchTeams(); fetchStudents(); }, [fetchTeams, fetchStudents]);

  const deleteTeam = async (id: string) => {
    if (!confirm("Delete this team and all its members & tasks?")) return;
    await fetch(`${API_URL}/api/admin/teams/${id}`, { method: "DELETE", credentials: "include" });
    fetchTeams();
  };

  const removeMember = async (teamId: string, memberId: string) => {
    if (!confirm("Remove this student from the team?")) return;
    await fetch(`${API_URL}/api/admin/teams/${teamId}/members/${memberId}`, {
      method: "DELETE", credentials: "include"
    });
    fetchTeams();
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm("Delete this task?")) return;
    await fetch(`${API_URL}/api/admin/teams/tasks/${taskId}`, {
      method: "DELETE", credentials: "include"
    });
    fetchTeams();
  };

  const cycleTaskStatus = async (task: TeamTask) => {
    const cycle: Record<string, string> = {
      PENDING: "IN_PROGRESS", IN_PROGRESS: "COMPLETED",
      COMPLETED: "PENDING", CANCELLED: "PENDING"
    };
    const next = cycle[task.status] ?? "PENDING";
    await fetch(`${API_URL}/api/admin/teams/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: next }),
    });
    fetchTeams();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400 gap-3">
        <Loader2 className="animate-spin h-6 w-6" /> Loading teams...
      </div>
    );
  }

  // Global Academy Teams Stats
  const globalTotalStudents = teams.reduce((acc, t) => acc + t.members.length, 0);
  const globalTotalTasks = teams.reduce((acc, t) => acc + t.members.reduce((mAcc, m) => mAcc + m.tasks.length, 0), 0);
  const globalCompletedTasks = teams.reduce((acc, t) => acc + t.members.reduce((mAcc, m) => mAcc + m.tasks.filter(tk => tk.status === "COMPLETED").length, 0), 0);
  const globalSubmissions = teams.reduce((acc, t) => acc + t.members.reduce((mAcc, m) => mAcc + m.tasks.filter(tk => Boolean(tk.submissionUrl)).length, 0), 0);
  const globalProgress = globalTotalTasks > 0 ? Math.round((globalCompletedTasks / globalTotalTasks) * 100) : 0;

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          {/* Breadcrumb pills */}
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E6F7F0] text-[#064E3B] border border-[#0D7A53]/30 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#0D7A53]" />
              Team Management
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/80 backdrop-blur-md border border-slate-200 text-slate-600 shadow-xs">
              Operations & Sprints
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#111317] tracking-tight">Team Management</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Monitor team progress dashboards, milestones, and deliverables submitted across all academy teams.
          </p>
        </div>
        <button
          onClick={() => setShowCreateTeam(true)}
          className="inline-flex items-center gap-2 rounded-full bg-[#0D7A53] text-white hover:bg-[#0A6B48] px-5 py-2.5 text-xs font-bold shadow-sm shadow-[#0D7A53]/25 transition-all"
        >
          <Plus className="h-4 w-4" /> Create Team
        </button>
      </div>

      {/* Global Overview Bento Grid: Frosted Glass Cards */}
      {teams.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Teams */}
          <div className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/90 p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Teams</span>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-[#111317] tracking-tight">{teams.length}</div>
              <p className="text-xs text-slate-400 mt-1">{globalTotalStudents} students enrolled</p>
            </div>
            <div className="pt-1">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F7F0] text-[#064E3B] border border-[#0D7A53]/20">
                {teams.filter(t => t.isActive).length} Active
              </span>
            </div>
          </div>

          {/* Card 2: Academy Progress */}
          <div className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/90 p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Academy Progress</span>
              <div className="w-8 h-8 rounded-full bg-[#E6F7F0] flex items-center justify-center text-[#0D7A53]">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-[#111317] tracking-tight">{globalProgress}%</div>
              <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#0D7A53] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${globalProgress}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-400">Milestones Done</span>
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F7F0] text-[#064E3B] border border-[#0D7A53]/20">
                {globalCompletedTasks}/{globalTotalTasks}
              </span>
            </div>
          </div>

          {/* Card 3: Total Tasks */}
          <div className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/90 p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Milestones</span>
              <div className="w-8 h-8 rounded-full bg-[#E6F7F0] flex items-center justify-center text-[#0D7A53]">
                <CheckSquare className="h-4 w-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-[#111317] tracking-tight">{globalTotalTasks}</div>
              <p className="text-xs text-slate-400 mt-1">{globalCompletedTasks} tasks finished</p>
            </div>
            <div className="pt-1">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#111317] text-[#34D399]">
                Tracked
              </span>
            </div>
          </div>

          {/* Card 4: Submissions */}
          <div className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/90 p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Code Deliverables</span>
              <div className="w-8 h-8 rounded-full bg-[#111317] flex items-center justify-center text-[#34D399]">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-[#111317] tracking-tight">{globalSubmissions}</div>
              <p className="text-xs text-slate-400 mt-1">GitHub repositories submitted</p>
            </div>
            <div className="pt-1">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F7F0] text-[#064E3B] border border-[#0D7A53]/20">
                Verified Deliverables
              </span>
            </div>
          </div>
        </div>
      )}

      {teams.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-[28px] bg-white/80 backdrop-blur-xl text-center">
          <div className="bg-[#E6F7F0] text-[#0D7A53] p-4 rounded-full mb-4 border border-[#0D7A53]/30">
            <Users className="h-8 w-8" />
          </div>
          <h4 className="text-lg font-bold text-[#111317] mb-1">No teams yet</h4>
          <p className="text-sm text-slate-400 mb-6 max-w-sm">
            Create your first team to start assigning students and tracking milestones.
          </p>
          <button
            onClick={() => setShowCreateTeam(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#0D7A53] text-white hover:bg-[#0A6B48] px-5 py-2.5 text-xs font-bold shadow-sm shadow-[#0D7A53]/25"
          >
            <Plus className="h-4 w-4" /> Create Team
          </button>
        </div>
      )}

      {/* Teams List */}
      <div className="space-y-4">
        {teams.map(team => (
          <TeamCard
            key={team.id}
            team={team}
            expanded={expandedTeam === team.id}
            expandedMember={expandedMember}
            onToggle={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
            onToggleMember={id => setExpandedMember(expandedMember === id ? null : id)}
            onDeleteTeam={() => deleteTeam(team.id)}
            onAddMember={() => setShowAddMember(team.id)}
            onRemoveMember={memberId => removeMember(team.id, memberId)}
            onAddTask={memberId => setShowAddTask({ teamId: team.id, memberId })}
            onDeleteTask={deleteTask}
            onCycleTaskStatus={cycleTaskStatus}
            onEditTask={setEditingTask}
            onViewSubmission={setViewingSubmission}
          />
        ))}
      </div>

      {/* Modals */}
      {showCreateTeam && (
        <CreateTeamModal onClose={() => setShowCreateTeam(false)} onCreated={() => { setShowCreateTeam(false); fetchTeams(); }} />
      )}
      {showAddMember && (
        <AddMemberModal
          teamId={showAddMember}
          students={students}
          existingMemberIds={teams.find(t => t.id === showAddMember)?.members.map(m => m.studentId) ?? []}
          onClose={() => setShowAddMember(null)}
          onAdded={() => { setShowAddMember(null); fetchTeams(); }}
        />
      )}
      {showAddTask && (
        <AddTaskModal
          teamId={showAddTask.teamId}
          memberId={showAddTask.memberId}
          onClose={() => setShowAddTask(null)}
          onAdded={() => { setShowAddTask(null); fetchTeams(); }}
        />
      )}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSaved={() => { setEditingTask(null); fetchTeams(); }}
        />
      )}
      {viewingSubmission && (
        <SubmissionDetailsModal
          task={viewingSubmission}
          onClose={() => setViewingSubmission(null)}
        />
      )}
    </div>
  );
}

// ─── TeamCard ─────────────────────────────────────────────────────────────────

function TeamCard({
  team, expanded, expandedMember, onToggle, onToggleMember, onDeleteTeam,
  onAddMember, onRemoveMember, onAddTask, onDeleteTask, onCycleTaskStatus, onEditTask, onViewSubmission
}: {
  team: Team; expanded: boolean; expandedMember: string | null;
  onToggle: () => void; onToggleMember: (id: string) => void;
  onDeleteTeam: () => void; onAddMember: () => void;
  onRemoveMember: (id: string) => void; onAddTask: (memberId: string) => void;
  onDeleteTask: (id: string) => void; onCycleTaskStatus: (t: TeamTask) => void;
  onEditTask: (t: TeamTask) => void; onViewSubmission: (t: TeamTask) => void;
}) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "members">("dashboard");

  const totalTasks = team.members.reduce((acc, m) => acc + m.tasks.length, 0);
  const completedTasks = team.members.reduce(
    (acc, m) => acc + m.tasks.filter(t => t.status === "COMPLETED").length, 0
  );
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[28px] border border-white/90 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] overflow-hidden transition-all">
      {/* Team Header / Summary */}
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50/60 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="p-3 bg-[#111317] text-[#34D399] rounded-2xl flex-shrink-0 shadow-xs">
            <Users className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h4 className="font-extrabold text-[#111317] text-base truncate">{team.name}</h4>
              <span className={`inline-block px-3 py-0.5 text-xs font-bold rounded-full border ${team.isActive ? "bg-[#0D7A53] text-white border-transparent" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                {team.isActive ? "● Active Team" : "Inactive"}
              </span>
            </div>
            {team.description && <p className="text-xs text-slate-400 mt-0.5 truncate">{team.description}</p>}
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-semibold"><Users className="h-3.5 w-3.5 text-slate-400" />{team.members.length} students</span>
            <span className="flex items-center gap-1.5 font-semibold"><ClipboardList className="h-3.5 w-3.5 text-slate-400" />{completedTasks}/{totalTasks} tasks</span>

            {/* Mini Progress Bar on Card Header */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#0D7A53] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-xs font-extrabold text-[#111317] w-8 text-right">{progressPct}%</span>
            </div>
          </div>

          <button
            onClick={e => { e.stopPropagation(); onDeleteTeam(); }}
            title="Delete team"
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center transition-colors">
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
        </div>
      </div>

      {/* Expanded Team Body */}
      {expanded && (
        <div className="border-t border-slate-100 px-6 py-5 bg-slate-50/50 space-y-5">
          {/* View Mode Tabs: Progress Dashboard vs Manage Members & Tasks */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-full text-xs font-semibold">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all ${
                  activeTab === "dashboard"
                    ? "bg-[#111317] text-white font-extrabold shadow-sm"
                    : "text-slate-600 hover:text-[#111317] font-semibold"
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                Progress Dashboard
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all ${
                  activeTab === "members"
                    ? "bg-[#111317] text-white font-extrabold shadow-sm"
                    : "text-slate-600 hover:text-[#111317] font-semibold"
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                Students & Tasks ({team.members.length})
              </button>
            </div>

            <div className="flex items-center gap-2">
              {activeTab === "dashboard" && (
                <button
                  onClick={() => setActiveTab("members")}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#111317] hover:bg-slate-100 bg-white border border-slate-200 rounded-full px-4 py-1.5 transition-colors shadow-xs"
                >
                  Manage Tasks & Students
                  <ChevronRight className="h-3 w-3" />
                </button>
              )}

              {activeTab === "members" && (
                <button
                  onClick={onAddMember}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064E3B] hover:bg-[#0D7A53] hover:text-white bg-[#E6F7F0] border border-[#0D7A53]/30 rounded-full px-4 py-1.5 transition-colors shadow-xs"
                >
                  <UserPlus className="h-3.5 w-3.5" /> Add Student
                </button>
              )}
            </div>
          </div>

          {/* TAB 1: Team Progress Dashboard */}
          {activeTab === "dashboard" && (
            <TeamProgressDashboard
              team={team}
              onViewSubmission={onViewSubmission}
              onSwitchToMembers={() => setActiveTab("members")}
            />
          )}

          {/* TAB 2: Students & Tasks Management */}
          {activeTab === "members" && (
            <div className="space-y-3">
              {team.members.length === 0 && (
                <div className="text-center py-8 text-sm text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                  <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  No students in this team yet. Use the "Add Student" button above to add members.
                </div>
              )}

              {team.members.map(member => (
                <MemberCard
                  key={member.id}
                  member={member}
                  expanded={expandedMember === member.id}
                  onToggle={() => onToggleMember(member.id)}
                  onRemove={() => onRemoveMember(member.id)}
                  onAddTask={() => onAddTask(member.id)}
                  onDeleteTask={onDeleteTask}
                  onCycleTaskStatus={onCycleTaskStatus}
                  onEditTask={onEditTask}
                  onViewSubmission={onViewSubmission}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── TeamProgressDashboard ────────────────────────────────────────────────────

function TeamProgressDashboard({
  team,
  onViewSubmission,
  onSwitchToMembers,
}: {
  team: Team;
  onViewSubmission: (task: TeamTask) => void;
  onSwitchToMembers: () => void;
}) {
  const totalTasks = team.members.reduce((acc, m) => acc + m.tasks.length, 0);
  const completedTasks = team.members.reduce(
    (acc, m) => acc + m.tasks.filter((t) => t.status === "COMPLETED").length,
    0
  );
  const inProgressTasks = team.members.reduce(
    (acc, m) => acc + m.tasks.filter((t) => t.status === "IN_PROGRESS").length,
    0
  );
  const pendingTasks = team.members.reduce(
    (acc, m) => acc + m.tasks.filter((t) => t.status === "PENDING").length,
    0
  );

  const submittedTasksList = team.members.flatMap((m) =>
    m.tasks
      .filter((t) => Boolean(t.submissionUrl || t.submissionContent))
      .map((t) => ({ ...t, studentName: m.student.name, studentId: m.student.studentId }))
  );

  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const inProgressPct = totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0;
  const pendingPct = totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Team Progress */}
        <div className="bg-white/90 backdrop-blur-md rounded-[24px] border border-slate-200/90 p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Team Completion
            </span>
            <span className="text-xl font-black text-[#111317]">{progressPct}%</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#0D7A53] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {completedTasks} of {totalTasks} milestones completed
          </p>
        </div>

        {/* Card 2: In Progress */}
        <div className="bg-white/90 backdrop-blur-md rounded-[24px] border border-slate-200/90 p-4 shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-[#111317] text-[#34D399] rounded-full shrink-0">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">In Progress</p>
            <h5 className="text-xl font-black text-[#111317]">{inProgressTasks}</h5>
            <p className="text-xs text-slate-400">Active tasks in flight</p>
          </div>
        </div>

        {/* Card 3: Pending Tasks */}
        <div className="bg-white/90 backdrop-blur-md rounded-[24px] border border-slate-200/90 p-4 shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-[#E6F7F0] text-[#064E3B] rounded-full shrink-0 border border-[#0D7A53]/30">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending</p>
            <h5 className="text-xl font-black text-[#111317]">{pendingTasks}</h5>
            <p className="text-xs text-slate-400">Waiting to be started</p>
          </div>
        </div>

        {/* Card 4: Deliverables Submitted */}
        <div className="bg-white/90 backdrop-blur-md rounded-[24px] border border-slate-200/90 p-4 shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-[#0D7A53] text-white rounded-full shrink-0">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Submissions</p>
            <h5 className="text-xl font-black text-[#111317]">{submittedTasksList.length}</h5>
            <p className="text-xs text-slate-400">GitHub deliverables submitted</p>
          </div>
        </div>
      </div>

      {/* Multi-Segment Milestone Bar */}
      {totalTasks > 0 && (
        <div className="bg-white/90 backdrop-blur-md rounded-[24px] border border-slate-200/90 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-[#111317]">Team Milestone Distribution</span>
            <span className="text-slate-400 font-semibold">{totalTasks} total tasks</span>
          </div>

          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${progressPct}%` }}
              title={`Completed: ${completedTasks} (${progressPct}%)`}
              className="bg-[#0D7A53] h-full transition-all duration-300"
            />
            <div
              style={{ width: `${inProgressPct}%` }}
              title={`In Progress: ${inProgressTasks} (${inProgressPct}%)`}
              className="bg-[#111317] h-full transition-all duration-300"
            />
            <div
              style={{ width: `${pendingPct}%` }}
              title={`Pending: ${pendingTasks} (${pendingPct}%)`}
              className="bg-[#E6F7F0] h-full transition-all duration-300"
            />
          </div>

          <div className="flex items-center gap-4 text-xs pt-1 flex-wrap">
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0D7A53] inline-block border border-slate-300" />
              <span>Completed ({completedTasks})</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <span className="h-2.5 w-2.5 rounded-full bg-[#111317] inline-block" />
              <span>In Progress ({inProgressTasks})</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <span className="h-2.5 w-2.5 rounded-full bg-[#E6F7F0] inline-block border border-[#0D7A53]/30" />
              <span>Pending ({pendingTasks})</span>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Member Progress Matrix & Team Deliverables Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Teammates Progress Matrix (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-[24px] border border-slate-200/90 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Users className="h-4 w-4 text-[#111317]" />
              Member Progress Matrix
            </h5>
            <button
              onClick={onSwitchToMembers}
              className="text-xs text-[#111317] hover:underline font-bold"
            >
              View Detailed Tasks →
            </button>
          </div>

          {team.members.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No students in this team yet.</p>
          ) : (
            <div className="space-y-3">
              {team.members.map((member) => {
                const mTotal = member.tasks.length;
                const mDone = member.tasks.filter((t) => t.status === "COMPLETED").length;
                const mInProg = member.tasks.filter((t) => t.status === "IN_PROGRESS").length;
                const mPending = member.tasks.filter((t) => t.status === "PENDING").length;
                const mPct = mTotal > 0 ? Math.round((mDone / mTotal) * 100) : 0;
                const mSubmitted = member.tasks.filter((t) => Boolean(t.submissionUrl)).length;

                return (
                  <div key={member.id} className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                          {member.student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">{member.student.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {member.student.studentId} · {member.student.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        {mSubmitted > 0 && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <GithubIcon className="h-2.5 w-2.5" />
                            {mSubmitted} submission{mSubmitted > 1 ? "s" : ""}
                          </span>
                        )}
                        <span className="font-bold text-slate-800">{mDone}/{mTotal} tasks</span>
                        <span className="text-indigo-600 font-extrabold text-sm">{mPct}%</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${mPct}%` }}
                      />
                    </div>

                    {/* Task count tags */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                      <span className="text-emerald-700 font-semibold">{mDone} Completed</span>
                      <span>•</span>
                      <span className="text-blue-700 font-semibold">{mInProg} Active</span>
                      <span>•</span>
                      <span className="text-amber-700 font-semibold">{mPending} Pending</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Team Submissions Stream (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Team GitHub Submissions
            </h5>
            <span className="text-xs text-slate-400 font-medium">{submittedTasksList.length} Total</span>
          </div>

          {submittedTasksList.length === 0 ? (
            <div className="text-center py-10">
              <Clock className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No deliverables submitted yet</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                When students complete milestones, their GitHub repository links and descriptions will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {submittedTasksList.map((sub: any) => (
                <div
                  key={sub.id}
                  className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1.5 hover:bg-emerald-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 truncate">{sub.title}</span>
                    {sub.submittedAt && (
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500">
                    By <span className="font-semibold text-slate-700">{sub.studentName}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {sub.submissionUrl && (
                      <a
                        href={sub.submissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200/80 px-2 py-0.5 rounded transition-colors break-all"
                      >
                        <GithubIcon className="h-3 w-3" />
                        <span>GitHub Code</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                    {sub.submissionContent && (
                      <button
                        onClick={() => onViewSubmission(sub)}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 font-medium px-2 py-0.5 rounded transition-colors"
                      >
                        <FileText className="h-3 w-3" />
                        Read Notes
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MemberCard ───────────────────────────────────────────────────────────────

function MemberCard({
  member, expanded, onToggle, onRemove, onAddTask, onDeleteTask, onCycleTaskStatus, onEditTask, onViewSubmission
}: {
  member: TeamMember; expanded: boolean;
  onToggle: () => void; onRemove: () => void; onAddTask: () => void;
  onDeleteTask: (id: string) => void; onCycleTaskStatus: (t: TeamTask) => void;
  onEditTask: (t: TeamTask) => void; onViewSubmission: (t: TeamTask) => void;
}) {
  const done = member.tasks.filter(t => t.status === "COMPLETED").length;

  return (
    <div className="bg-white rounded-[24px] border border-slate-200/90 shadow-xs overflow-hidden">
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#111317] text-[#34D399] flex items-center justify-center font-extrabold text-xs uppercase flex-shrink-0 shadow-xs">
            {member.student.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-[#111317] text-sm">{member.student.name}</div>
            <div className="text-xs text-slate-400 font-mono">{member.student.email} · {member.student.studentId}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 hidden sm:block bg-slate-100 px-3 py-1 rounded-full">{done}/{member.tasks.length} tasks done</span>
          <button
            onClick={e => { e.stopPropagation(); onRemove(); }}
            title="Remove student"
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
            {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/50 space-y-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Tasks & Deliverables</span>
            <button
              onClick={onAddTask}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064E3B] hover:bg-[#0D7A53] hover:text-white bg-[#E6F7F0] border border-[#0D7A53]/30 rounded-full px-3.5 py-1.5 transition-colors shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" /> Add Task
            </button>
          </div>

          {member.tasks.length === 0 && (
            <p className="text-xs text-slate-400 py-3 text-center italic">No tasks assigned yet for this student.</p>
          )}

          <div className="space-y-2.5">
            {[...member.tasks]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map(task => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onCycle={() => onCycleTaskStatus(task)}
                  onEdit={() => onEditTask(task)}
                  onDelete={() => onDeleteTask(task.id)}
                  onViewSubmission={() => onViewSubmission(task)}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TaskRow ─────────────────────────────────────────────────────────────────

function TaskRow({
  task, onCycle, onEdit, onDelete, onViewSubmission
}: {
  task: TeamTask; onCycle: () => void; onEdit: () => void; onDelete: () => void; onViewSubmission: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasSubmission = Boolean(task.submissionUrl || task.submissionContent);
  const isLongDescription = Boolean(task.description && (task.description.length > 120 || task.description.includes("\n")));

  return (
    <div className="bg-white rounded-[20px] border border-slate-200/90 p-4 shadow-xs space-y-3 hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onCycle}
              title="Click to cycle status"
              className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-bold cursor-pointer hover:opacity-85 transition-opacity ${statusBadge(task.status)}`}
            >
              {statusIcon(task.status)}
              {task.status.replace("_", " ")}
            </button>
            <h5 className="text-sm font-bold text-[#111317]">{task.title}</h5>
          </div>
          {task.description && (
            <div>
              {!expanded ? (
                <div className="space-y-1">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{task.description}</p>
                  {isLongDescription && (
                    <button
                      type="button"
                      onClick={() => setExpanded(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#111317] hover:underline transition-colors"
                    >
                      <span>Show full description</span>
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 mt-1">
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{task.description}</p>
                  <button
                    type="button"
                    onClick={() => setExpanded(false)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#111317] transition-colors"
                  >
                    <span>Minimize</span>
                    <ChevronUp className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          {task.createdAt && (
            <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
              <Calendar className="h-3 w-3 text-slate-400" />
              Assigned {new Date(task.createdAt).toLocaleDateString()}
            </span>
          )}
          {task.dueDate && (
            <span className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
              <Clock className="h-3 w-3 text-slate-400" />
              Due {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
          <button
            onClick={onEdit}
            title="Edit task"
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-[#111317] hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            title="Delete task"
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Link Column / Section */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Admin Reference Link */}
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Reference Link:</span>
          {task.taskUrl ? (
            <a
              href={task.taskUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#064E3B] hover:underline font-bold bg-[#E6F7F0] hover:bg-[#d5f3e4] border border-[#0D7A53]/30 px-3 py-0.5 rounded-full transition-colors break-all"
            >
              <ExternalLink className="h-3 w-3 text-[#0D7A53]" />
              <span>{task.taskUrl.length > 35 ? task.taskUrl.slice(0, 32) + "..." : task.taskUrl}</span>
            </a>
          ) : (
            <span className="text-slate-400 italic">None assigned</span>
          )}
        </div>

        {/* Student Deliverable Submission */}
        <div className="flex items-center gap-2">
          {hasSubmission ? (
            <div className="flex items-center gap-2">
              {task.submissionUrl && (
                <a
                  href={task.submissionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-[#064E3B] bg-white hover:bg-[#E6F7F0] border border-[#0D7A53]/30 px-3 py-1 rounded-full transition-colors shadow-xs"
                >
                  <GithubIcon className="h-3.5 w-3.5 text-[#0D7A53]" />
                  <span>GitHub Code</span>
                  <ExternalLink className="h-2.5 w-2.5 text-slate-400" />
                </a>
              )}
              {task.submissionContent && (
                <button
                  onClick={onViewSubmission}
                  className="inline-flex items-center gap-1 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 font-bold px-3 py-1 rounded-full transition-colors"
                >
                  <FileText className="h-3 w-3" />
                  View Notes
                </button>
              )}
            </div>
          ) : (
            <span className="text-slate-400 italic text-[11px]">No student submission yet</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Modal helpers ────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-[#111317]/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[32px] p-7 w-full max-w-lg shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
          <h3 className="text-lg font-black text-[#111317]">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-[#111317] hover:bg-slate-200 flex items-center justify-center transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function ModalFooter({ onCancel, saving, label }: { onCancel: () => void; saving: boolean; label: string }) {
  return (
    <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 mt-3">
      <button type="button" onClick={onCancel} className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
        Cancel
      </button>
      <button type="submit" disabled={saving} className="px-6 py-2.5 text-xs font-bold text-white bg-[#0D7A53] hover:bg-[#0A6B48] disabled:opacity-60 rounded-full shadow-sm shadow-[#0D7A53]/20 transition-all flex items-center gap-2">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {label}
      </button>
    </div>
  );
}

const inputCls = "w-full rounded-2xl border border-slate-300 px-4 py-2.5 text-sm text-[#111317] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D7A53] focus:border-[#0D7A53] transition-all";

// ─── Create Team Modal ────────────────────────────────────────────────────────

function CreateTeamModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName]         = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: name.trim(), description: description.trim() || undefined }),
      });
      if (res.ok) onCreated();
    } finally { setSaving(false); }
  };

  return (
    <Modal title="Create New Team" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Team Name" required>
          <input required autoFocus className={inputCls} placeholder="e.g. Frontend Titans" value={name} onChange={e => setName(e.target.value)} />
        </Field>
        <Field label="Description">
          <textarea className={inputCls} rows={3} placeholder="Team goals or project scope..." value={description} onChange={e => setDescription(e.target.value)} />
        </Field>
        <ModalFooter onCancel={onClose} saving={saving} label="Create Team" />
      </form>
    </Modal>
  );
}

// ─── Add Member Modal ─────────────────────────────────────────────────────────

function AddMemberModal({
  teamId, students, existingMemberIds, onClose, onAdded
}: {
  teamId: string; students: Student[]; existingMemberIds: string[];
  onClose: () => void; onAdded: () => void;
}) {
  const [studentId, setStudentId] = useState("");
  const [saving, setSaving]       = useState(false);
  const available = students.filter(s => !existingMemberIds.includes(s.id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/teams/${teamId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ studentId }),
      });
      if (res.ok) onAdded();
    } finally { setSaving(false); }
  };

  return (
    <Modal title="Add Student to Team" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Select Student" required>
          <select required className={inputCls} value={studentId} onChange={e => setStudentId(e.target.value)}>
            <option value="">— Choose a student —</option>
            {available.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.studentId}) — {s.email}</option>
            ))}
          </select>
          {available.length === 0 && (
            <p className="text-xs text-amber-600 mt-1">All students are already in this team.</p>
          )}
        </Field>
        <ModalFooter onCancel={onClose} saving={saving} label="Add Student" />
      </form>
    </Modal>
  );
}

// ─── Add Task Modal ───────────────────────────────────────────────────────────

function AddTaskModal({ teamId, memberId, onClose, onAdded }: {
  teamId: string; memberId: string; onClose: () => void; onAdded: () => void;
}) {
  const [form, setForm] = useState({ title: "", description: "", taskUrl: "", dueDate: "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {
        title: form.title,
        description: form.description || undefined,
        taskUrl: form.taskUrl?.trim() || undefined,
      };
      if (form.dueDate) payload.dueDate = new Date(form.dueDate).toISOString();
      const res = await fetch(`${API_URL}/api/admin/teams/${teamId}/members/${memberId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (res.ok) onAdded();
    } finally { setSaving(false); }
  };

  return (
    <Modal title="Add Task for Student" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Task Title" required>
          <input required autoFocus className={inputCls} placeholder="e.g. Build login page" value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Description">
          <textarea className={inputCls} rows={3} placeholder="Detailed instructions..." value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />
        </Field>
        <Field label="Task / Reference Link (Optional)">
          <input type="url" className={inputCls} placeholder="e.g. https://github.com/... or Figma / documentation link" value={form.taskUrl}
            onChange={e => setForm({ ...form, taskUrl: e.target.value })} />
        </Field>
        <Field label="Due Date">
          <input type="date" className={inputCls} value={form.dueDate}
            onChange={e => setForm({ ...form, dueDate: e.target.value })} />
        </Field>
        <ModalFooter onCancel={onClose} saving={saving} label="Add Task" />
      </form>
    </Modal>
  );
}

// ─── Edit Task Modal ──────────────────────────────────────────────────────────

function EditTaskModal({ task, onClose, onSaved }: {
  task: TeamTask; onClose: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title: task.title,
    description: task.description ?? "",
    taskUrl: task.taskUrl ?? "",
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    status: task.status,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {
        title: form.title,
        description: form.description || undefined,
        taskUrl: form.taskUrl?.trim() || undefined,
        status: form.status,
      };
      if (form.dueDate) payload.dueDate = new Date(form.dueDate).toISOString();
      const res = await fetch(`${API_URL}/api/admin/teams/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (res.ok) onSaved();
    } finally { setSaving(false); }
  };

  return (
    <Modal title="Edit Task" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Task Title" required>
          <input required className={inputCls} value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Description">
          <textarea className={inputCls} rows={3} value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />
        </Field>
        <Field label="Task / Reference Link (Optional)">
          <input type="url" className={inputCls} placeholder="e.g. https://github.com/... or Figma / documentation link" value={form.taskUrl}
            onChange={e => setForm({ ...form, taskUrl: e.target.value })} />
        </Field>
        <Field label="Status">
          <select className={inputCls} value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </Field>
        <Field label="Due Date">
          <input type="date" className={inputCls} value={form.dueDate}
            onChange={e => setForm({ ...form, dueDate: e.target.value })} />
        </Field>
        <ModalFooter onCancel={onClose} saving={saving} label="Save Changes" />
      </form>
    </Modal>
  );
}

// ─── Submission Details Modal ─────────────────────────────────────────────────

function SubmissionDetailsModal({
  task, onClose
}: {
  task: TeamTask; onClose: () => void;
}) {
  return (
    <Modal title="Student Deliverable Submission" onClose={onClose}>
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-[20px] border border-slate-200/80 space-y-1">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">Task Title</div>
          <div className="text-sm font-bold text-[#111317]">{task.title}</div>
          {task.submittedAt && (
            <p className="text-xs text-slate-500">
              Submitted on: {new Date(task.submittedAt).toLocaleString()}
            </p>
          )}
        </div>

        {task.submissionUrl && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              GitHub Repository / Pull Request Link
            </label>
            <a
              href={task.submissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 p-3 bg-white hover:bg-[#E6F7F0] border border-[#0D7A53]/30 rounded-full text-[#064E3B] font-bold text-xs w-full break-all transition-colors shadow-xs"
            >
              <GithubIcon className="h-4 w-4 shrink-0 text-[#0D7A53]" />
              <span className="flex-1">{task.submissionUrl}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            </a>
          </div>
        )}

        {task.submissionContent && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Student's Description of What They Did
            </label>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-[#111317] leading-relaxed whitespace-pre-wrap">
              {task.submissionContent}
            </div>
          </div>
        )}

        {task.taskUrl && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Assigned Reference Link
            </label>
            <a
              href={task.taskUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#064E3B] font-bold bg-[#E6F7F0] border border-[#0D7A53]/30 px-3.5 py-1.5 rounded-full hover:bg-[#0D7A53] hover:text-white transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>{task.taskUrl}</span>
            </a>
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#0D7A53] hover:bg-[#0A6B48] transition-all shadow-sm shadow-[#0D7A53]/20"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
