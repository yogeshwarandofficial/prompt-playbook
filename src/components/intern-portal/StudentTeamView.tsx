import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  CheckSquare,
  Loader2,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronRight,
  X,
  ExternalLink,
  Send,
  FileText,
  ArrowUpRight,
  Sparkles
} from "lucide-react";

import { TaskLinksView, StructuredTaskDescription } from "../ui/task-content";

const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:3001";

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
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

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
}

interface TeamTask {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  taskUrl?: string;
  submissionContent?: string;
  submissionUrl?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

interface TeamMember {
  id: string;
  studentId: string;
  joinedAt: string;
  student: Student;
  tasks: TeamTask[];
}

interface Team {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  members: TeamMember[];
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  progressPercentage: number;
  myMemberId?: string;
  myTasks: TeamTask[];
}

function statusBadge(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-[#0D7A53] text-white border border-[#0A6B48] font-bold shadow-xs";
    case "IN_PROGRESS":
      return "bg-[#111317] text-[#34D399] border border-[#111317] font-bold";
    case "PENDING":
      return "bg-[#E6F7F0] text-[#064E3B] border border-[#0D7A53]/30 font-bold";
    case "CANCELLED":
      return "bg-slate-100 text-slate-500 border border-slate-200 font-medium";
    default:
      return "bg-slate-100 text-slate-600 border border-slate-200 font-medium";
  }
}

function statusIcon(status: string) {
  if (status === "COMPLETED") return <CheckCircle2 className="h-3.5 w-3.5 text-white" />;
  if (status === "IN_PROGRESS") return <Clock className="h-3.5 w-3.5 text-[#34D399]" />;
  if (status === "CANCELLED") return <AlertCircle className="h-3.5 w-3.5 text-slate-400" />;
  return <Clock className="h-3.5 w-3.5 text-[#064E3B]" />;
}

// XSS Sanitizer: ensures only valid http/https URLs are rendered in anchor hrefs
function safeUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return null;
}

export function StudentTeamView({ session }: { session: any }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  // Submit Modal state
  const [submittingTask, setSubmittingTask] = useState<TeamTask | null>(null);
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);
  const [taskFilter, setTaskFilter] = useState<"ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED">("ALL");
  const [expandedTaskIds, setExpandedTaskIds] = useState<Record<string, boolean>>({});
  const [expandedSubmissions, setExpandedSubmissions] = useState<Record<string, boolean>>({});
  const [activeSection, setActiveSection] = useState<"all" | "tasks" | "team">("all");

  const fetchTeams = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/student/teams`, { credentials: "include" });
      if (res.ok) {
        const data: Team[] = await res.json();
        setTeams(data);
        if (data.length > 0 && !selectedTeamId) {
          setSelectedTeamId(data[0].id);
        } else if (data.length > 0 && !data.some(t => t.id === selectedTeamId)) {
          setSelectedTeamId(data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load student teams:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedTeamId]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const currentTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    setUpdatingTaskId(taskId);
    try {
      const res = await fetch(`${API_URL}/api/student/teams/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await fetchTeams();
      }
    } catch (err) {
      console.error("Failed to update task status:", err);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
        <Loader2 className="animate-spin h-8 w-8 text-[#0D7A53]" />
        <p className="text-sm font-medium">Loading your team workspace...</p>
      </div>
    );
  }

  // If user has NO teams assigned
  if (!currentTeam || teams.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Team Workspace</h3>
          <p className="text-sm text-slate-500 mt-1">
            Collaborate with peers, complete milestones, and submit your GitHub deliverables.
          </p>
        </div>

        <div className="overflow-hidden rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/90 p-12 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.04)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E6F7F0] text-[#0D7A53] border border-[#0D7A53]/30 mb-6">
            <Users className="h-8 w-8" />
          </div>
          <h4 className="text-xl font-bold text-[#111317]">No Team Assigned Yet</h4>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            You haven't been assigned to a team yet. Your mentor or administrator will assign you to your project team and provide your tasks shortly.
          </p>
        </div>
      </div>
    );
  }

  // Filter tasks for the logged-in student (newest assigned first)
  const myFilteredTasks = currentTeam.myTasks
    .filter((t) => {
      if (taskFilter === "ALL") return true;
      return t.status === taskFilter;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const toggleTaskExpand = (taskId: string) => {
    setExpandedTaskIds((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const toggleSubmissionExpand = (taskId: string) => {
    setExpandedSubmissions((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const allExpanded =
    myFilteredTasks.length > 0 &&
    myFilteredTasks.every((t) => expandedTaskIds[t.id]);

  const toggleExpandAll = () => {
    const nextState = !allExpanded;
    const newMap: Record<string, boolean> = {};
    const newSubMap: Record<string, boolean> = {};
    myFilteredTasks.forEach((t) => {
      newMap[t.id] = nextState;
      newSubMap[t.id] = nextState;
    });
    setExpandedTaskIds(newMap);
    setExpandedSubmissions(newSubMap);
  };

  return (
    <div className="space-y-7">
      {/* Top Header with Team Illustration from Screenshot */}
      <div className="relative overflow-hidden rounded-[32px] bg-white/80 backdrop-blur-xl border border-white/90 p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 min-w-0 z-10 w-full">
          {/* Breadcrumb pill tags matching screenshot */}
          <div className="flex items-center gap-2 mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#E6F7F0] text-[#064E3B] border border-[#0D7A53]/30 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#0D7A53]" />
              Team Workspace
            </span>
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-white/80 backdrop-blur-md border border-slate-200 text-slate-600 shadow-xs">
              Active Sprint
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111317]">
              {currentTeam.name}
            </h2>
            <span
              className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold ${
                currentTeam.isActive
                  ? "bg-[#0D7A53] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {currentTeam.isActive ? "● Active Team" : "Inactive"}
            </span>
          </div>

          {currentTeam.description && (
            <p className="text-sm text-slate-500 mt-2 max-w-xl leading-relaxed">
              {currentTeam.description}
            </p>
          )}

          {/* Action Controls / Team Switcher */}
          <div className="flex items-center gap-3 mt-4 pt-1 flex-wrap">
            {teams.length > 1 && (
              <div className="flex items-center gap-2 bg-slate-100/80 px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-xs">
                <span className="text-xs font-bold text-slate-500 pl-1">Switch Team:</span>
                <select
                  value={currentTeam.id}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="bg-transparent text-xs font-bold text-[#111317] focus:outline-none cursor-pointer pr-2"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="button"
              onClick={fetchTeams}
              title="Refresh team data"
              className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-[#111317] hover:text-[#34D399] hover:border-[#111317] transition-all shadow-xs"
            >
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Team Graphic with transparent PNG fitting box fully */}
        <div className="shrink-0 w-full md:w-[380px] lg:w-[460px] h-36 sm:h-44 md:h-52 flex items-center justify-center md:justify-end z-10">
          <img
            src="/Teamwork Around Giant TEAM Letters.png"
            alt="Teamwork Around Giant TEAM Letters"
            className="w-full h-full object-contain drop-shadow-sm select-none"
          />
        </div>
      </div>

      {/* Bento Grid: 4 Frosted Glass Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Team Progress (Frosted Glass Card) */}
        <div className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/90 p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Team Progress
            </span>
            <div className="w-8 h-8 rounded-full bg-[#E6F7F0] flex items-center justify-center text-[#0D7A53]">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-[#111317] tracking-tight">
              {currentTeam.progressPercentage}%
            </div>
            <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#0D7A53] h-2 rounded-full transition-all duration-500"
                style={{ width: `${currentTeam.progressPercentage}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Milestones Done</span>
            <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F7F0] text-[#064E3B] border border-[#0D7A53]/20">
              {currentTeam.completedTasks}/{currentTeam.totalTasks}
            </span>
          </div>
        </div>

        {/* Card 2: Teammates (Frosted Glass Card) */}
        <div className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/90 p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Teammates
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-[#111317] tracking-tight">
              {currentTeam.members.length}
            </div>
            <p className="text-xs text-slate-400 mt-1">Colleagues collaborating</p>
          </div>
          {/* Avatar stack matching reference design */}
          <div className="flex items-center -space-x-2 pt-1">
            {currentTeam.members.slice(0, 4).map((m) => (
              <div
                key={m.id}
                title={m.student.name}
                className="h-8 w-8 rounded-full bg-[#111317] text-[#34D399] font-bold text-xs flex items-center justify-center ring-2 ring-white shadow-xs"
              >
                {m.student.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {currentTeam.members.length > 4 && (
              <div className="h-8 w-8 rounded-full bg-[#0D7A53] text-white font-extrabold text-[11px] flex items-center justify-center ring-2 ring-white shadow-xs">
                +{currentTeam.members.length - 4}
              </div>
            )}
          </div>
        </div>

        {/* Card 3: My Assigned Tasks (Frosted Glass Card) */}
        <div className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/90 p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              My Tasks
            </span>
            <div className="w-8 h-8 rounded-full bg-[#0D7A53] flex items-center justify-center text-white">
              <CheckSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-[#111317] tracking-tight">
              {currentTeam.myTasks.filter((t) => t.status === "COMPLETED").length}/
              {currentTeam.myTasks.length}
            </div>
            <p className="text-xs text-slate-400 mt-1">Tasks completed by you</p>
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#111317] text-[#34D399]">
              {currentTeam.myTasks.filter((t) => t.status === "IN_PROGRESS").length} Active
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F7F0] text-[#064E3B] border border-[#0D7A53]/20">
              {currentTeam.myTasks.filter((t) => t.status === "PENDING").length} Pending
            </span>
          </div>
        </div>

        {/* Card 4: Team In-Progress Sprints (Frosted Glass Card) */}
        <div className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/90 p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Sprints
            </span>
            <div className="w-8 h-8 rounded-full bg-[#111317] flex items-center justify-center text-[#34D399]">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-[#111317] tracking-tight">
              {currentTeam.inProgressTasks}
            </div>
            <p className="text-xs text-slate-400 mt-1">In-flight across entire team</p>
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400 font-medium">Team Status</span>
            <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#0D7A53] text-white">
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Section Filter Pills / View Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="inline-flex items-center p-1 bg-slate-100/90 rounded-full border border-slate-200/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSection("all")}
            className={`px-4 py-1.5 rounded-full transition-all ${
              activeSection === "all"
                ? "bg-[#111317] text-white shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Sections
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("tasks")}
            className={`px-4 py-1.5 rounded-full transition-all ${
              activeSection === "tasks"
                ? "bg-[#111317] text-white shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            My Assigned Tasks ({currentTeam.myTasks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("team")}
            className={`px-4 py-1.5 rounded-full transition-all ${
              activeSection === "team"
                ? "bg-[#111317] text-white shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Teammates Progress ({currentTeam.members.length})
          </button>
        </div>
      </div>

      {/* Main Content Layout: Full Width Stacked Bento Sections */}
      <div className="space-y-7">
        {/* Full-Width Section: My Assigned Tasks */}
        {(activeSection === "all" || activeSection === "tasks") && (
          <div className="w-full space-y-4">
            <div className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/90 p-6 sm:p-7 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] space-y-5">
              {/* Header & Filter Capsules */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#111317] flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-[#0D7A53]" />
                  My Assigned Tasks
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tasks assigned to you by administrators and mentors.
                </p>
              </div>

              {/* Capsule Filter Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full text-xs font-semibold border border-slate-200/60">
                  {(["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"] as const).map((filter) => {
                    const isActive = taskFilter === filter;
                    return (
                      <button
                        key={filter}
                        onClick={() => setTaskFilter(filter)}
                        className={`px-3 py-1.5 rounded-full transition-all ${
                          isActive
                            ? "bg-[#111317] text-white font-bold shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {filter === "ALL"
                          ? `All (${currentTeam.myTasks.length})`
                          : filter === "PENDING"
                          ? `Pending (${currentTeam.myTasks.filter((t) => t.status === "PENDING").length})`
                          : filter === "IN_PROGRESS"
                          ? `Active (${currentTeam.myTasks.filter((t) => t.status === "IN_PROGRESS").length})`
                          : `Done (${currentTeam.myTasks.filter((t) => t.status === "COMPLETED").length})`}
                      </button>
                    );
                  })}
                </div>

                {myFilteredTasks.length > 0 && (
                  <button
                    type="button"
                    onClick={toggleExpandAll}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-[#111317] bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-xs"
                    title={allExpanded ? "Minimize all task descriptions" : "Expand all task descriptions"}
                  >
                    <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400" />
                    <span>{allExpanded ? "Minimize All" : "Expand All"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Task Cards List */}
            {myFilteredTasks.length === 0 ? (
              <div className="rounded-[22px] border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-[#E6F7F0] flex items-center justify-center text-[#0D7A53] mx-auto mb-3">
                  <CheckSquare className="h-6 w-6" />
                </div>
                <h5 className="text-sm font-bold text-[#111317]">No tasks in this view</h5>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {taskFilter === "ALL"
                    ? "You have no tasks assigned in this team yet. Your mentor or administrator will assign tasks to you."
                    : `You don't have any tasks marked as ${taskFilter.toLowerCase().replace("_", " ")}.`}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myFilteredTasks.map((task) => {
                  const isOverdue =
                    task.dueDate &&
                    new Date(task.dueDate).getTime() < Date.now() &&
                    task.status !== "COMPLETED";

                  const isExpanded = Boolean(expandedTaskIds[task.id]);
                  const isLongDescription = Boolean(
                    task.description && (task.description.length > 120 || task.description.includes("\n"))
                  );

                  return (
                    <div
                      key={task.id}
                      className="bg-white/90 backdrop-blur-md rounded-[22px] border border-slate-200/90 p-5 shadow-xs transition-all space-y-3 hover:border-slate-300 hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2 flex-1 min-w-0">
                          {/* Title & Status Row */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => toggleTaskExpand(task.id)}
                              title={isExpanded ? "Minimize details" : "Expand details"}
                              className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#111317] hover:border-slate-300 transition-colors shadow-xs"
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                              )}
                            </button>

                            <h4
                              onClick={() => toggleTaskExpand(task.id)}
                              className={`text-base font-bold cursor-pointer transition-colors ${
                                task.status === "COMPLETED"
                                  ? "line-through text-slate-400"
                                  : "text-[#111317] hover:text-[#0D7A53]"
                              }`}
                            >
                              {task.title}
                            </h4>

                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${statusBadge(
                                task.status
                              )}`}
                            >
                              {statusIcon(task.status)}
                              {task.status.replace("_", " ")}
                            </span>
                          </div>

                          {/* Structured Task Description: preserves paragraphs, headings, bullet points */}
                          <StructuredTaskDescription
                            description={task.description}
                            expanded={isExpanded}
                            onToggle={() => toggleTaskExpand(task.id)}
                          />

                          {/* Meta: Assigned Date, Due Date */}
                          <div className="flex items-center gap-2.5 pt-1 flex-wrap text-xs">
                            {task.createdAt && (
                              <span className="inline-flex items-center gap-1 font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                                <Calendar className="h-3 w-3 text-slate-400" />
                                Assigned: {new Date(task.createdAt).toLocaleDateString()}
                              </span>
                            )}

                            {task.dueDate && (
                              <span
                                className={`inline-flex items-center gap-1 font-semibold px-2.5 py-1 rounded-full border ${
                                  isOverdue
                                    ? "bg-rose-50 text-rose-700 border-rose-200 font-bold"
                                    : "bg-slate-50 text-slate-600 border-slate-200"
                                }`}
                              >
                                <Clock className="h-3 w-3" />
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                {isOverdue && " (Overdue)"}
                              </span>
                            )}
                          </div>

                          {/* Reference Links: Each on separate consecutive lines */}
                          <TaskLinksView taskUrl={task.taskUrl} className="pt-2" />
                        </div>

                        {/* Action Buttons: Pill-shaped CTA in Velvet Emerald */}
                        <div className="shrink-0 flex items-center gap-2">
                          {task.status === "PENDING" && (
                            <>
                              <button
                                disabled={updatingTaskId === task.id}
                                onClick={() => handleUpdateStatus(task.id, "IN_PROGRESS")}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#111317] border border-slate-300 hover:bg-slate-100 text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                              >
                                {updatingTaskId === task.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Clock className="h-3.5 w-3.5" />
                                )}
                                Start
                              </button>
                              <button
                                onClick={() => setSubmittingTask(task)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0D7A53] hover:bg-[#0A6B48] text-white text-xs font-bold transition-all shadow-sm shadow-[#0D7A53]/20"
                              >
                                <Send className="h-3.5 w-3.5" />
                                Submit
                              </button>
                            </>
                          )}

                          {task.status === "IN_PROGRESS" && (
                            <button
                              onClick={() => setSubmittingTask(task)}
                              className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-[#0D7A53] hover:bg-[#0A6B48] text-white text-xs font-bold transition-all shadow-sm shadow-[#0D7A53]/20"
                            >
                              <Send className="h-3.5 w-3.5" />
                              Submit Work
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Submitted Deliverable Details (Glass Card) */}
                      {(task.submissionUrl || task.submissionContent) && (() => {
                        const isSubExpanded = Boolean(expandedSubmissions[task.id]);
                        const isSubLong = Boolean(
                          task.submissionContent &&
                            (task.submissionContent.length > 120 || task.submissionContent.includes("\n"))
                        );

                        return (
                          <div className="mt-3 p-4 bg-gradient-to-br from-[#E6F7F0]/90 via-[#E6F7F0]/70 to-white/90 rounded-[20px] border border-[#0D7A53]/30 space-y-2.5 backdrop-blur-md">
                            <div
                              className="flex items-center justify-between text-xs cursor-pointer select-none"
                              onClick={() => toggleSubmissionExpand(task.id)}
                            >
                              <span className="font-extrabold text-[#064E3B] flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-[#0D7A53]" />
                                Your Submitted Deliverable
                              </span>
                              <div className="flex items-center gap-2">
                                {task.submittedAt && (
                                  <span className="text-[11px] font-semibold text-[#0D7A53]">
                                    Submitted: {new Date(task.submittedAt).toLocaleDateString()}
                                  </span>
                                )}
                                {task.submissionContent && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleSubmissionExpand(task.id);
                                    }}
                                    className="w-6 h-6 rounded-full bg-white border border-[#0D7A53]/40 flex items-center justify-center text-[#0D7A53] hover:bg-[#0D7A53] hover:text-white transition-colors"
                                    title={isSubExpanded ? "Minimize submission details" : "Expand submission details"}
                                  >
                                    {isSubExpanded ? (
                                      <ChevronUp className="h-3 w-3" />
                                    ) : (
                                      <ChevronDown className="h-3 w-3" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>

                            {task.submissionUrl && (
                              <div className="pt-0.5">
                                <a
                                  href={task.submissionUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-xs font-bold text-[#064E3B] bg-white hover:bg-[#E6F7F0] border border-[#0D7A53]/40 px-3.5 py-1.5 rounded-full transition-colors break-all shadow-xs"
                                >
                                  <GithubIcon className="h-3.5 w-3.5 shrink-0 text-[#0D7A53]" />
                                  <span>{task.submissionUrl}</span>
                                  <ExternalLink className="h-3 w-3 shrink-0 text-slate-400" />
                                </a>
                              </div>
                            )}

                            {task.submissionContent && (
                              <div>
                                {!isSubExpanded ? (
                                  <div className="space-y-1">
                                    <p className="text-xs text-slate-700 bg-white/90 p-3 rounded-xl border border-slate-200/80 leading-relaxed line-clamp-2">
                                      {task.submissionContent}
                                    </p>
                                    {isSubLong && (
                                      <button
                                        type="button"
                                        onClick={() => toggleSubmissionExpand(task.id)}
                                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0D7A53] hover:underline transition-colors pt-0.5"
                                      >
                                        <span>Read full submission notes</span>
                                        <ChevronDown className="h-3 w-3" />
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                                    <div className="flex items-center justify-between text-[11px] font-bold text-[#064E3B] uppercase tracking-wider">
                                      <span>Submitted Notes & Documentation</span>
                                      <button
                                        type="button"
                                        onClick={() => toggleSubmissionExpand(task.id)}
                                        className="inline-flex items-center gap-1 text-slate-500 hover:text-[#111317] text-[11px] font-semibold transition-colors"
                                      >
                                        <span>Minimize</span>
                                        <ChevronUp className="h-3 w-3" />
                                      </button>
                                    </div>
                                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                                      {task.submissionContent}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        )}

        {/* Full-Width Section: Teammates Progress (Frosted Glass Bento Card) */}
        {(activeSection === "all" || activeSection === "team") && (
          <div className="w-full space-y-4">
            <div className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/90 p-6 sm:p-7 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-[#111317] flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#0D7A53]" />
                    Teammates Progress
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Monitor team member milestones & tasks across your team ({currentTeam.members.length} member{currentTeam.members.length === 1 ? "" : "s"}).
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-[#0D7A53]" />
                  <span>{currentTeam.completedTasks} of {currentTeam.totalTasks} Milestones Completed</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start pt-1">
              {currentTeam.members.map((member) => {
                const isCurrentUser =
                  member.student.id === session.id ||
                  member.student.studentId === session.studentId;
                const totalMemberTasks = member.tasks.length;
                const completedMemberTasks = member.tasks.filter(
                  (t) => t.status === "COMPLETED"
                ).length;
                const progress =
                  totalMemberTasks > 0
                    ? Math.round((completedMemberTasks / totalMemberTasks) * 100)
                    : 0;
                const isExpanded = expandedMemberId === member.id;

                return (
                  <div
                    key={member.id}
                    className="bg-white/90 backdrop-blur-md rounded-[22px] border border-slate-200/90 p-4 shadow-xs transition-all hover:border-slate-300"
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() =>
                        setExpandedMemberId(isExpanded ? null : member.id)
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#111317] text-[#34D399] font-extrabold text-sm flex items-center justify-center shadow-xs">
                          {member.student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#111317]">
                              {member.student.name}
                            </span>
                            {isCurrentUser && (
                              <span className="text-[10px] bg-[#E6F7F0] text-[#064E3B] border border-[#0D7A53]/30 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                YOU
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-mono">
                            {member.student.studentId}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-[#111317]">
                            {completedMemberTasks}/{totalMemberTasks}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-semibold">
                            {progress}% Done
                          </span>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-500 shadow-xs">
                          {isExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#0D7A53] h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Expanded Teammate Tasks List */}
                    {isExpanded && (
                      <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
                          <span>Assigned Milestones</span>
                          <span className="text-[11px] font-normal text-slate-400">
                            {member.tasks.length} tasks
                          </span>
                        </div>

                        {member.tasks.length === 0 ? (
                          <p className="text-xs text-slate-400 italic py-1">
                            No tasks assigned to this teammate yet.
                          </p>
                        ) : (
                          [...member.tasks]
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((t) => (
                            <div
                              key={t.id}
                              className="bg-slate-50/90 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 shadow-xs"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  {statusIcon(t.status)}
                                  <span
                                    className={`font-semibold truncate ${
                                      t.status === "COMPLETED"
                                        ? "line-through text-slate-400"
                                        : "text-[#111317]"
                                    }`}
                                  >
                                    {t.title}
                                  </span>
                                </div>
                                <span
                                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold shrink-0 ${statusBadge(
                                    t.status
                                  )}`}
                                >
                                  {t.status.replace("_", " ")}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 pl-5 text-[11px] text-slate-400">
                                {t.createdAt && (
                                  <span>Assigned: {new Date(t.createdAt).toLocaleDateString()}</span>
                                )}
                                {t.dueDate && (
                                  <span>• Due: {new Date(t.dueDate).toLocaleDateString()}</span>
                                )}
                              </div>

                              <TaskLinksView taskUrl={t.taskUrl} className="pl-5 pt-1" />

                              {t.submissionUrl && safeUrl(t.submissionUrl) && (
                                <div className="pl-5 pt-0.5">
                                  <a
                                    href={safeUrl(t.submissionUrl)!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-[11px] text-[#064E3B] hover:underline font-bold bg-[#E6F7F0] px-2.5 py-0.5 rounded-full border border-[#0D7A53]/30"
                                  >
                                    <GithubIcon className="h-3 w-3 text-[#0D7A53]" />
                                    <span>View Code</span>
                                    <ExternalLink className="h-2.5 w-2.5 text-slate-500" />
                                  </a>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SUBMISSION MODAL */}
      {submittingTask && (
        <SubmitTaskModal
          task={submittingTask}
          onClose={() => setSubmittingTask(null)}
          onSubmitted={async () => {
            setSubmittingTask(null);
            await fetchTeams();
          }}
        />
      )}
    </div>
  );
}

// ─── Submit Task Modal ────────────────────────────────────────────────────────

function SubmitTaskModal({
  task,
  onClose,
  onSubmitted,
}: {
  task: TeamTask;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [submissionUrl, setSubmissionUrl] = useState(task.submissionUrl || "");
  const [content, setContent] = useState(task.submissionContent || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionUrl.trim() && !content.trim()) {
      setError("Please provide your GitHub repository link and/or describe what you did.");
      return;
    }

    if (submissionUrl.trim() && !/^https?:\/\//i.test(submissionUrl.trim())) {
      setError("Submission URL must be a valid link starting with http:// or https://");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/student/teams/tasks/${task.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          submissionUrl: submissionUrl.trim() || undefined,
          content: content.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed to submit task");
      }
      onSubmitted();
    } catch (err: any) {
      setError(err.message || "Failed to submit task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111317]/70 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-[32px] bg-white/95 backdrop-blur-2xl p-7 shadow-2xl border border-white/80">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#E6F7F0] text-[#0D7A53] rounded-full border border-[#0D7A53]/30">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-lg font-black text-[#111317]">Submit Task Deliverable</h4>
              <p className="text-xs text-slate-500">Provide GitHub repo and implementation notes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-[#111317] hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Task Summary Banner */}
        <div className="mt-4 p-4 bg-slate-50/80 rounded-[20px] border border-slate-200/80 space-y-1.5">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">Task Title</div>
          <div className="text-sm font-bold text-[#111317]">{task.title}</div>
          {task.description && (
            <div className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto p-2.5 bg-white rounded-xl border border-slate-200">
              {task.description}
            </div>
          )}
          {task.taskUrl && (
            <TaskLinksView taskUrl={task.taskUrl} className="pt-1" />
          )}
        </div>

        {error && (
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              GitHub Repository / Pull Request Link <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <GithubIcon className="h-4 w-4" />
              </div>
              <input
                type="url"
                required
                value={submissionUrl}
                onChange={(e) => setSubmissionUrl(e.target.value)}
                placeholder="https://github.com/username/project or PR link"
                className="w-full rounded-2xl border border-slate-300 pl-10 pr-3.5 py-2.5 text-sm text-[#111317] placeholder:text-slate-400 focus:border-[#0D7A53] focus:ring-2 focus:ring-[#0D7A53]/20 focus:outline-none bg-white"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Provide the GitHub link where your solution or committed code is stored.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Describe What You Did <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Explain your implementation, what was built, features added, files changed, or instructions for review..."
              className="w-full rounded-2xl border border-slate-300 px-3.5 py-2.5 text-sm text-[#111317] placeholder:text-slate-400 focus:border-[#0D7A53] focus:ring-2 focus:ring-[#0D7A53]/20 focus:outline-none bg-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#0D7A53] hover:bg-[#0A6B48] transition-all shadow-sm shadow-[#0D7A53]/20 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Submit Work
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
