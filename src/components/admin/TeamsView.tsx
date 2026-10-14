import React, { useState, useEffect, useCallback } from "react";
import {
  Plus, Trash2, X, Users, CheckCircle2, Clock, AlertCircle, Calendar,
  ChevronDown, ChevronUp, ChevronRight, UserPlus, ClipboardList, Save,
  Edit, Loader2, ExternalLink, FileText, BarChart3, CheckSquare
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
    PENDING:     "bg-amber-100 text-amber-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    COMPLETED:   "bg-emerald-100 text-emerald-700",
    CANCELLED:   "bg-slate-100 text-slate-500",
  };
  return map[status] ?? "bg-slate-100 text-slate-600";
}

function statusIcon(status: string) {
  if (status === "COMPLETED")   return <CheckCircle2 className="h-3.5 w-3.5" />;
  if (status === "IN_PROGRESS") return <Clock className="h-3.5 w-3.5" />;
  if (status === "CANCELLED")   return <AlertCircle className="h-3.5 w-3.5" />;
  return <Clock className="h-3.5 w-3.5" />;
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Team Management</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor team progress dashboards, milestones, and deliverables submitted across all academy teams.
          </p>
        </div>
        <button
          onClick={() => setShowCreateTeam(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" /> Create Team
        </button>
      </div>

      {/* Global Overview Bar */}
      {teams.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="p-2 border-r border-slate-100 last:border-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Teams</span>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">{teams.length}</div>
            <p className="text-[11px] text-slate-400">{globalTotalStudents} students enrolled</p>
          </div>
          <div className="p-2 border-r border-slate-100 last:border-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Academy Progress</span>
            <div className="text-xl font-extrabold text-indigo-600 mt-0.5">{globalProgress}%</div>
            <p className="text-[11px] text-slate-400">{globalCompletedTasks}/{globalTotalTasks} milestones</p>
          </div>
          <div className="p-2 border-r border-slate-100 last:border-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Tasks</span>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">{globalTotalTasks}</div>
            <p className="text-[11px] text-slate-400">{globalCompletedTasks} completed</p>
          </div>
          <div className="p-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">GitHub Deliverables</span>
            <div className="text-xl font-extrabold text-emerald-600 mt-0.5">{globalSubmissions}</div>
            <p className="text-[11px] text-slate-400">Code repositories submitted</p>
          </div>
        </div>
      )}

      {teams.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-white text-center">
          <div className="bg-indigo-50 p-4 rounded-2xl mb-4">
            <Users className="h-10 w-10 text-indigo-400" />
          </div>
          <h4 className="text-lg font-semibold text-slate-700 mb-1">No teams yet</h4>
          <p className="text-sm text-slate-400 mb-6">Create your first team to start assigning students and tracking milestones.</p>
          <button
            onClick={() => setShowCreateTeam(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all">
      {/* Team Header / Summary */}
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50/60 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl flex-shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h4 className="font-bold text-slate-800 text-base truncate">{team.name}</h4>
              <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${team.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                {team.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            {team.description && <p className="text-xs text-slate-400 mt-0.5 truncate">{team.description}</p>}
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{team.members.length} students</span>
            <span className="flex items-center gap-1.5"><ClipboardList className="h-4 w-4" />{completedTasks}/{totalTasks} tasks</span>

            {/* Mini Progress Bar on Card Header */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-xs font-bold text-indigo-600 w-8 text-right">{progressPct}%</span>
            </div>
          </div>

          <button
            onClick={e => { e.stopPropagation(); onDeleteTeam(); }}
            title="Delete team"
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          {expanded ? <ChevronDown className="h-5 w-5 text-slate-400" /> : <ChevronRight className="h-5 w-5 text-slate-400" />}
        </div>
      </div>

      {/* Expanded Team Body */}
      {expanded && (
        <div className="border-t border-slate-100 px-6 py-5 bg-slate-50/40 space-y-4">
          {/* View Mode Tabs: Progress Dashboard vs Manage Members & Tasks */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === "dashboard"
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                Progress Dashboard
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === "members"
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
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
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 hover:border-indigo-200 rounded-xl px-3 py-1.5 transition-colors shadow-sm"
                >
                  Manage Tasks & Students
                  <ChevronRight className="h-3 w-3" />
                </button>
              )}

              {activeTab === "members" && (
                <button
                  onClick={onAddMember}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:bg-indigo-50 bg-white rounded-xl px-3 py-1.5 transition-colors shadow-sm"
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
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Team Completion
            </span>
            <span className="text-lg font-extrabold text-indigo-600">{progressPct}%</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {completedTasks} of {totalTasks} milestones completed
          </p>
        </div>

        {/* Card 2: In Progress */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex items-center gap-3.5">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">In Progress</p>
            <h5 className="text-xl font-bold text-slate-900">{inProgressTasks}</h5>
            <p className="text-xs text-slate-400">Active tasks in flight</p>
          </div>
        </div>

        {/* Card 3: Pending Tasks */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex items-center gap-3.5">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pending</p>
            <h5 className="text-xl font-bold text-slate-900">{pendingTasks}</h5>
            <p className="text-xs text-slate-400">Waiting to be started</p>
          </div>
        </div>

        {/* Card 4: Deliverables Submitted */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex items-center gap-3.5">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Submissions</p>
            <h5 className="text-xl font-bold text-slate-900">{submittedTasksList.length}</h5>
            <p className="text-xs text-slate-400">GitHub deliverables submitted</p>
          </div>
        </div>
      </div>

      {/* Multi-Segment Milestone Bar */}
      {totalTasks > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Team Milestone Distribution</span>
            <span className="text-slate-400">{totalTasks} total tasks</span>
          </div>

          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${progressPct}%` }}
              title={`Completed: ${completedTasks} (${progressPct}%)`}
              className="bg-emerald-500 h-full transition-all duration-300"
            />
            <div
              style={{ width: `${inProgressPct}%` }}
              title={`In Progress: ${inProgressTasks} (${inProgressPct}%)`}
              className="bg-blue-500 h-full transition-all duration-300"
            />
            <div
              style={{ width: `${pendingPct}%` }}
              title={`Pending: ${pendingTasks} (${pendingPct}%)`}
              className="bg-amber-400 h-full transition-all duration-300"
            />
          </div>

          <div className="flex items-center gap-4 text-xs pt-1 flex-wrap">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Completed ({completedTasks})</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500 inline-block" />
              <span>In Progress ({inProgressTasks})</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block" />
              <span>Pending ({pendingTasks})</span>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Member Progress Matrix & Team Deliverables Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Teammates Progress Matrix (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" />
              Member Progress Matrix
            </h5>
            <button
              onClick={onSwitchToMembers}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm uppercase flex-shrink-0">
            {member.student.name.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-slate-800 text-sm">{member.student.name}</div>
            <div className="text-xs text-slate-400">{member.student.email} · {member.student.studentId}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden sm:block">{done}/{member.tasks.length} tasks done</span>
          <button
            onClick={e => { e.stopPropagation(); onRemove(); }}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          {expanded ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/60 space-y-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Tasks & Deliverables</span>
            <button
              onClick={onAddTask}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:bg-indigo-50 rounded-lg px-2.5 py-1 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add Task
            </button>
          </div>

          {member.tasks.length === 0 && (
            <p className="text-xs text-slate-400 py-2 text-center">No tasks assigned yet for this student.</p>
          )}

          <div className="space-y-2">
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
    <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-sm space-y-2.5 hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onCycle}
              title="Click to cycle status"
              className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold cursor-pointer hover:opacity-80 transition-opacity ${statusBadge(task.status)}`}
            >
              {statusIcon(task.status)}
              {task.status.replace("_", " ")}
            </button>
            <h5 className="text-sm font-semibold text-slate-800">{task.title}</h5>
          </div>
          {task.description && (
            <div>
              {!expanded ? (
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{task.description}</p>
                  {isLongDescription && (
                    <button
                      type="button"
                      onClick={() => setExpanded(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <span>Show full description</span>
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 space-y-1.5 mt-1">
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{task.description}</p>
                  <button
                    type="button"
                    onClick={() => setExpanded(false)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    <span>Minimize</span>
                    <ChevronUp className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
          {task.createdAt && (
            <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
              <Calendar className="h-3 w-3 text-slate-400" />
              Assigned {new Date(task.createdAt).toLocaleDateString()}
            </span>
          )}
          {task.dueDate && (
            <span className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
              <Clock className="h-3 w-3 text-slate-400" />
              Due {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
          <button
            onClick={onEdit}
            title="Edit task"
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            title="Delete task"
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Link Column / Section */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Admin Reference Link */}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Reference Link:</span>
          {task.taskUrl ? (
            <a
              href={task.taskUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded transition-colors break-all"
            >
              <ExternalLink className="h-3 w-3" />
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
                  className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded transition-colors"
                >
                  <GithubIcon className="h-3.5 w-3.5" />
                  <span>GitHub Code</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
              {task.submissionContent && (
                <button
                  onClick={onViewSubmission}
                  className="inline-flex items-center gap-1 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium px-2 py-0.5 rounded transition-colors"
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
            <X className="h-5 w-5" />
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
    <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 mt-2">
      <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl">
        Cancel
      </button>
      <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 rounded-xl flex items-center gap-2">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {label}
      </button>
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-shadow";

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
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Task Title</div>
          <div className="text-sm font-bold text-slate-800">{task.title}</div>
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
              className="inline-flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 hover:text-emerald-950 font-semibold text-sm w-full break-all"
            >
              <GithubIcon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{task.submissionUrl}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            </a>
          </div>
        )}

        {task.submissionContent && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Student's Description of What They Did
            </label>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
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
              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>{task.taskUrl}</span>
            </a>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
