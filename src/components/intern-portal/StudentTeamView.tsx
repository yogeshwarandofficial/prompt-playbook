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
  FileText
} from "lucide-react";

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
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "PENDING":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "CANCELLED":
      return "bg-slate-100 text-slate-500 border-slate-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

function statusIcon(status: string) {
  if (status === "COMPLETED") return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  if (status === "IN_PROGRESS") return <Clock className="h-4 w-4 text-blue-600" />;
  if (status === "CANCELLED") return <AlertCircle className="h-4 w-4 text-slate-400" />;
  return <Clock className="h-4 w-4 text-amber-600" />;
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
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
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

        <div className="overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-8 ring-indigo-50/50 mb-6">
            <Users className="h-8 w-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-900">No Team Assigned Yet</h4>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            You haven't been assigned to a team yet. Your mentor or administrator will assign you to your project team and provide your tasks shortly.
          </p>
        </div>
      </div>
    );
  }

  // Filter tasks for the logged-in student
  const myFilteredTasks = currentTeam.myTasks.filter((t) => {
    if (taskFilter === "ALL") return true;
    return t.status === taskFilter;
  });

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
    <div className="space-y-8">
      {/* Header & Team Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-slate-900">{currentTeam.name}</h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                currentTeam.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
              }`}
            >
              {currentTeam.isActive ? "Active Team" : "Inactive"}
            </span>
          </div>
          {currentTeam.description && (
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">{currentTeam.description}</p>
          )}
        </div>

        {teams.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500">Switch Team:</label>
            <select
              value={currentTeam.id}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Team Progress Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Progress Bar Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Team Progress
            </span>
            <span className="text-sm font-bold text-indigo-600">
              {currentTeam.progressPercentage}%
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${currentTeam.progressPercentage}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-slate-400">
            {currentTeam.completedTasks} of {currentTeam.totalTasks} milestones completed
          </p>
        </div>

        {/* Members Count */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Teammates</p>
            <h4 className="text-2xl font-bold text-slate-900">{currentTeam.members.length}</h4>
            <p className="text-xs text-slate-400">Collaborating</p>
          </div>
        </div>

        {/* My Tasks Overview */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">My Tasks</p>
            <h4 className="text-2xl font-bold text-slate-900">
              {currentTeam.myTasks.filter((t) => t.status === "COMPLETED").length}/
              {currentTeam.myTasks.length}
            </h4>
            <p className="text-xs text-slate-400">Completed by you</p>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">In Progress</p>
            <h4 className="text-2xl font-bold text-slate-900">{currentTeam.inProgressTasks}</h4>
            <p className="text-xs text-slate-400">Active tasks across team</p>
          </div>
        </div>
      </div>

      {/* Main Grid: My Assigned Tasks & Teammates' Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: My Assigned Tasks (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div>
              <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-indigo-600" />
                My Assigned Tasks
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Tasks assigned to you by administrators and mentors.
              </p>
            </div>

            {/* Filter Pills & Expand/Collapse All Button */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {(["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTaskFilter(filter)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      taskFilter === filter
                        ? "bg-white text-indigo-700 shadow-sm"
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
                ))}
              </div>

              {myFilteredTasks.length > 0 && (
                <button
                  type="button"
                  onClick={toggleExpandAll}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 hover:border-indigo-200 transition-colors shadow-sm"
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
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 p-8 text-center">
              <CheckSquare className="mx-auto h-10 w-10 text-slate-300 mb-2" />
              <h5 className="text-sm font-semibold text-slate-800">No tasks in this view</h5>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
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
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow transition-shadow space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1 min-w-0">
                        {/* Title & Status Row */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => toggleTaskExpand(task.id)}
                            title={isExpanded ? "Minimize details" : "Expand details"}
                            className="p-1 -ml-1 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>

                          <h5
                            onClick={() => toggleTaskExpand(task.id)}
                            className={`text-base font-semibold cursor-pointer transition-colors ${
                              task.status === "COMPLETED"
                                ? "line-through text-slate-400 hover:text-slate-600"
                                : "text-slate-900 hover:text-indigo-600"
                            }`}
                          >
                            {task.title}
                          </h5>

                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge(
                              task.status
                            )}`}
                          >
                            {statusIcon(task.status)}
                            {task.status.replace("_", " ")}
                          </span>
                        </div>

                        {/* Collapsible / Expandable Task Description */}
                        {task.description && (
                          <div>
                            {!isExpanded ? (
                              <div className="space-y-1">
                                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                  {task.description}
                                </p>
                                {isLongDescription && (
                                  <button
                                    type="button"
                                    onClick={() => toggleTaskExpand(task.id)}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors pt-0.5"
                                  >
                                    <span>Read full description</span>
                                    <ChevronDown className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60 space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                  <span>Task Requirements & Instructions</span>
                                  <button
                                    type="button"
                                    onClick={() => toggleTaskExpand(task.id)}
                                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 text-[11px] font-medium transition-colors"
                                  >
                                    <span>Minimize</span>
                                    <ChevronUp className="h-3 w-3" />
                                  </button>
                                </div>
                                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                                  {task.description}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Meta: Due Date & Reference Link */}
                        <div className="flex items-center gap-3 pt-1 flex-wrap text-xs">
                          {task.dueDate && (
                            <span
                              className={`inline-flex items-center gap-1 font-medium ${
                                isOverdue ? "text-red-600 font-bold" : "text-slate-500"
                              }`}
                            >
                              <Calendar className="h-3.5 w-3.5" />
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                              {isOverdue && " (Overdue)"}
                            </span>
                          )}

                          {/* Admin Reference Link */}
                          {task.taskUrl && (
                            <a
                              href={task.taskUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 font-semibold px-2 py-0.5 rounded-md transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Assigned Spec / Link
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="shrink-0 flex items-center gap-2">
                        {task.status === "PENDING" && (
                          <>
                            <button
                              disabled={updatingTaskId === task.id}
                              onClick={() => handleUpdateStatus(task.id, "IN_PROGRESS")}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors disabled:opacity-50"
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
                              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold transition-colors shadow-sm"
                            >
                              <Send className="h-3.5 w-3.5" />
                              Submit
                            </button>
                          </>
                        )}

                        {task.status === "IN_PROGRESS" && (
                          <button
                            onClick={() => setSubmittingTask(task)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold transition-colors shadow-sm"
                          >
                            <Send className="h-3.5 w-3.5" />
                            Submit Work
                          </button>
                        )}

                      </div>
                    </div>

                    {/* Student Submission Card when Task is Completed or has Submission Details */}
                    {(task.submissionUrl || task.submissionContent) && (() => {
                      const isSubExpanded = Boolean(expandedSubmissions[task.id]);
                      const isSubLong = Boolean(
                        task.submissionContent &&
                          (task.submissionContent.length > 120 || task.submissionContent.includes("\n"))
                      );

                      return (
                        <div className="mt-2 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2">
                          <div
                            className="flex items-center justify-between text-xs cursor-pointer select-none"
                            onClick={() => toggleSubmissionExpand(task.id)}
                          >
                            <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              Your Submitted Deliverable
                            </span>
                            <div className="flex items-center gap-2">
                              {task.submittedAt && (
                                <span className="text-[11px] text-emerald-700">
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
                                  className="p-0.5 text-emerald-700 hover:text-emerald-950 rounded hover:bg-emerald-100/60 transition-colors"
                                  title={isSubExpanded ? "Minimize submission details" : "Expand submission details"}
                                >
                                  {isSubExpanded ? (
                                    <ChevronUp className="h-3.5 w-3.5" />
                                  ) : (
                                    <ChevronDown className="h-3.5 w-3.5" />
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
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-100/70 hover:bg-emerald-200/70 px-2.5 py-1 rounded-lg transition-colors break-all"
                              >
                                <GithubIcon className="h-3.5 w-3.5 shrink-0" />
                                <span>{task.submissionUrl}</span>
                                <ExternalLink className="h-3 w-3 shrink-0" />
                              </a>
                            </div>
                          )}

                          {task.submissionContent && (
                            <div>
                              {!isSubExpanded ? (
                                <div className="space-y-1">
                                  <p className="text-xs text-slate-700 bg-white/70 p-2.5 rounded-lg border border-emerald-100/60 leading-relaxed line-clamp-2">
                                    {task.submissionContent}
                                  </p>
                                  {isSubLong && (
                                    <button
                                      type="button"
                                      onClick={() => toggleSubmissionExpand(task.id)}
                                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 transition-colors pt-0.5"
                                    >
                                      <span>Read full submission notes</span>
                                      <ChevronDown className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <div className="bg-white/80 p-3 rounded-lg border border-emerald-100/70 space-y-2">
                                  <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                                    <span>Submitted Notes & Documentation</span>
                                    <button
                                      type="button"
                                      onClick={() => toggleSubmissionExpand(task.id)}
                                      className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 text-[11px] font-medium transition-colors"
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

        {/* Right Column: Teammates & Progress (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              Teammates Progress
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor team member milestones & tasks.
            </p>
          </div>

          <div className="space-y-3">
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
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm transition-all"
                >
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() =>
                      setExpandedMemberId(isExpanded ? null : member.id)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                        {member.student.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            {member.student.name}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                              You
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
                        <span className="text-xs font-bold text-slate-800">
                          {completedMemberTasks}/{totalMemberTasks}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {progress}% Done
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Expanded Teammate Tasks List */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                        <span>Assigned Tasks</span>
                      </div>

                      {member.tasks.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-1">
                          No tasks assigned to this teammate yet.
                        </p>
                      ) : (
                        member.tasks.map((t) => (
                          <div
                            key={t.id}
                            className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {statusIcon(t.status)}
                                <span
                                  className={`font-medium ${
                                    t.status === "COMPLETED"
                                      ? "line-through text-slate-400"
                                      : "text-slate-800"
                                  }`}
                                >
                                  {t.title}
                                </span>
                              </div>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusBadge(
                                  t.status
                                )}`}
                              >
                                {t.status.replace("_", " ")}
                              </span>
                            </div>

                            {/* Show if teammate submitted Github code */}
                            {t.submissionUrl && (
                              <div className="pl-6">
                                <a
                                  href={t.submissionUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-medium"
                                >
                                  <GithubIcon className="h-3 w-3" />
                                  <span>View Code</span>
                                  <ExternalLink className="h-2.5 w-2.5" />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Submit Task Work</h4>
              <p className="text-xs text-slate-400">Describe what you did and link your GitHub repository</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Task Summary Banner */}
        <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Task Title</div>
          <div className="text-sm font-semibold text-slate-800">{task.title}</div>
          {task.description && (
            <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
          )}
          {task.taskUrl && (
            <a
              href={task.taskUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold pt-1"
            >
              <ExternalLink className="h-3 w-3" /> View Assigned Spec / Reference Link
            </a>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              GitHub Repository / Pull Request Link <span className="text-red-500">*</span>
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
                className="w-full rounded-xl border border-slate-300 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Provide the GitHub link where your solution or committed code is stored.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Describe What You Did <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Explain your implementation, what was built, features added, files changed, or instructions for review..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
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
