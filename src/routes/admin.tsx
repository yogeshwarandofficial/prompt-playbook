import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Briefcase,
  Mail,
  LogOut,
  Search,
  TrendingUp,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { getSession, signOut, type AdminSession } from "@/lib/auth";
import { DOMAINS } from "@/data/content";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Infynux Academy" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type TabKey = "overview" | "applications" | "tutorials" | "messages";

interface AppRow {
  id: string;
  name: string;
  email: string;
  domain: string;
  status: "Pending" | "Reviewed" | "Accepted";
  date: string;
}

const MOCK_APPS: AppRow[] = [
  { id: "APP-1042", name: "Ananya Sharma", email: "ananya.s@example.com", domain: "Web Development", status: "Accepted", date: "2026-06-24" },
  { id: "APP-1041", name: "Rohan Verma", email: "rohan.v@example.com", domain: "Cloud AWS", status: "Reviewed", date: "2026-06-23" },
  { id: "APP-1040", name: "Priya Iyer", email: "priya.i@example.com", domain: "AI / ML", status: "Pending", date: "2026-06-23" },
  { id: "APP-1039", name: "Karthik Reddy", email: "karthik.r@example.com", domain: "App Development", status: "Pending", date: "2026-06-22" },
  { id: "APP-1038", name: "Neha Gupta", email: "neha.g@example.com", domain: "Digital Marketing", status: "Accepted", date: "2026-06-21" },
  { id: "APP-1037", name: "Aditya Singh", email: "aditya.s@example.com", domain: "Web Development", status: "Reviewed", date: "2026-06-20" },
  { id: "APP-1036", name: "Sneha Patil", email: "sneha.p@example.com", domain: "Cloud AWS", status: "Pending", date: "2026-06-20" },
];

const MOCK_MESSAGES = [
  { id: "MSG-201", name: "Vikram Joshi", email: "vikram@example.com", subject: "Collaboration inquiry", date: "2026-06-25" },
  { id: "MSG-200", name: "Meera Nair", email: "meera@example.com", subject: "Internship question", date: "2026-06-24" },
  { id: "MSG-199", name: "Arjun Mehta", email: "arjun@example.com", subject: "Tutorial request: GraphQL", date: "2026-06-23" },
];

function AdminPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [tab, setTab] = useState<TabKey>("overview");
  const [query, setQuery] = useState("");
  const [apps, setApps] = useState<AppRow[]>(MOCK_APPS);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      navigate({ to: "/login" });
      return;
    }
    setSession(s);
  }, [navigate]);

  const filteredApps = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return apps;
    return apps.filter((a) =>
      [a.id, a.name, a.email, a.domain, a.status].some((v) => v.toLowerCase().includes(q)),
    );
  }, [apps, query]);

  const stats = useMemo(() => {
    return {
      apps: apps.length,
      pending: apps.filter((a) => a.status === "Pending").length,
      accepted: apps.filter((a) => a.status === "Accepted").length,
      tutorials: DOMAINS.reduce((s, d) => s + d.tutorials, 0),
    };
  }, [apps]);

  function handleSignOut() {
    signOut();
    navigate({ to: "/login" });
  }

  function updateStatus(id: string, status: AppRow["status"]) {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  if (!session) return null;

  return (
    <section className="container-page py-8">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-[#222] pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black sm:text-4xl font-orbitron text-slate-900 tracking-wide uppercase">
            Admin <span className="text-primary bg-[#0A0A0A] px-3 py-1 rounded-lg border-2 border-black ml-1 shadow-[4px_4px_0px_rgba(0,0,0,1)]">Dashboard</span>
          </h1>
          <p className="mt-4 text-sm font-outfit font-bold text-slate-500">
            Signed in as <span className="text-slate-900 border-b-2 border-primary">{session.email}</span>
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="inline-flex h-12 items-center gap-2 rounded-xl border-4 border-[#222] bg-white px-5 text-sm font-black uppercase tracking-widest font-orbitron shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:border-black hover:bg-[#0A0A0A] hover:text-white transition-all active:translate-y-1 active:shadow-none"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside>
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {[
              { k: "overview" as const, label: "Overview", icon: LayoutDashboard },
              { k: "applications" as const, label: "Applications", icon: Briefcase },
              { k: "tutorials" as const, label: "Tutorials", icon: BookOpen },
              { k: "messages" as const, label: "Messages", icon: Mail },
            ].map(({ k, label, icon: Icon }) => {
              const active = tab === k;
              return (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={
                    "inline-flex w-full items-center gap-3 whitespace-nowrap rounded-2xl border-4 px-4 py-3.5 text-sm font-black transition-all uppercase tracking-wider font-orbitron " +
                    (active
                      ? "bg-[#0A0A0A] text-primary border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] translate-x-2"
                      : "bg-white border-[#222] text-slate-700 hover:border-black hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]")
                  }
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0">
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Applications" value={stats.apps} icon={Users} hint="+12 this week" />
                <StatCard label="Pending Review" value={stats.pending} icon={Clock} hint="Action needed" tone="warn" />
                <StatCard label="Accepted" value={stats.accepted} icon={CheckCircle2} hint="This month" tone="ok" />
                <StatCard label="Published Tutorials" value={stats.tutorials} icon={BookOpen} hint="Across 5 domains" />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card title="Applications by Domain">
                  <ul className="space-y-3">
                    {DOMAINS.map((d) => {
                      const count = apps.filter((a) => a.domain.toLowerCase().includes(d.short.toLowerCase().split(" ")[0])).length;
                      const pct = stats.apps ? Math.round((count / stats.apps) * 100) : 0;
                      return (
                        <li key={d.key}>
                          <div className="flex items-center justify-between text-sm font-outfit font-bold">
                            <span className="text-slate-800">{d.short}</span>
                            <span className="text-slate-500">{count} ({pct}%)</span>
                          </div>
                          <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100 border-2 border-[#222]">
                            <div className="h-full bg-primary border-r-2 border-[#222]" style={{ width: `${pct}%` }} />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </Card>

                <Card title="Recent Activity">
                  <ul className="space-y-3 text-sm">
                    <ActivityItem icon={Briefcase} text="New application from Ananya Sharma" time="2h ago" />
                    <ActivityItem icon={Mail} text="Contact message: Collaboration inquiry" time="5h ago" />
                    <ActivityItem icon={CheckCircle2} text="Accepted: Rohan Verma — Cloud AWS" time="1d ago" />
                    <ActivityItem icon={TrendingUp} text="Tutorial views +18% this week" time="2d ago" />
                  </ul>
                </Card>
              </div>
            </div>
          )}

          {tab === "applications" && (
            <Card
              title="Internship Applications"
              right={
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search…"
                    className="h-12 w-64 rounded-2xl border-4 border-[#222] bg-white pl-12 pr-4 text-sm font-bold font-outfit text-slate-800 focus:outline-none focus:border-primary focus:shadow-[4px_4px_0px_rgba(156,255,59,1)] transition-all"
                  />
                </div>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b-4 border-[#222] text-left text-[11px] uppercase tracking-widest text-slate-500 font-orbitron font-black">
                      <th className="py-4 pr-4">ID</th>
                      <th className="py-4 pr-4">Applicant</th>
                      <th className="py-4 pr-4">Domain</th>
                      <th className="py-4 pr-4">Date</th>
                      <th className="py-4 pr-4">Status</th>
                      <th className="py-4 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="font-outfit font-medium">
                    {filteredApps.map((a) => (
                      <tr key={a.id} className="border-b-2 border-[#222] border-dashed last:border-0 hover:bg-[#F9FAF5] transition-colors">
                        <td className="py-4 pr-4 font-mono text-xs font-bold text-slate-500">{a.id}</td>
                        <td className="py-4 pr-4">
                          <div className="font-bold text-slate-900">{a.name}</div>
                          <div className="text-xs text-slate-500">{a.email}</div>
                        </td>
                        <td className="py-4 pr-4">{a.domain}</td>
                        <td className="py-4 pr-4 text-slate-500">{a.date}</td>
                        <td className="py-4 pr-4"><StatusBadge status={a.status} /></td>
                        <td className="py-4 pr-4">
                          <div className="flex flex-wrap gap-2">
                            {(["Pending", "Reviewed", "Accepted"] as const).map((s) => (
                              <button
                                key={s}
                                onClick={() => updateStatus(a.id, s)}
                                className={
                                  "rounded-lg px-3 py-1.5 text-[11px] font-black uppercase tracking-widest font-orbitron transition-all border-2 " +
                                  (a.status === s
                                    ? "bg-[#0A0A0A] text-primary border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                                    : "bg-white border-[#222] text-slate-600 hover:border-black hover:text-slate-900 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]")
                                }
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredApps.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-sm font-bold text-slate-500 font-outfit">
                          No applications match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {tab === "tutorials" && (
            <Card title="Tutorials by Domain">
              <div className="grid gap-6 sm:grid-cols-2">
                {DOMAINS.map((d) => (
                  <div
                    key={d.key}
                    className="rounded-3xl border-4 border-[#222] bg-[#0A0A0A] p-6 transition-all hover:border-primary hover:shadow-[8px_8px_0px_rgba(156,255,59,1)] hover:-translate-y-1"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#333] bg-[#111] shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                          <span className="text-2xl">{d.icon}</span>
                        </div>
                        <div>
                          <div className="font-black text-white font-orbitron">{d.name}</div>
                          <div className="text-xs font-bold text-slate-500 font-outfit mt-0.5">{d.duration}</div>
                        </div>
                      </div>
                      <span className="rounded-lg border-2 border-primary bg-primary/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-primary font-orbitron">
                        {d.tutorials} tutorials
                      </span>
                    </div>
                    <p className="mt-5 text-sm font-medium text-[#C7CBCE] font-outfit">{d.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {d.skills.slice(0, 4).map((s) => (
                        <span key={s} className="rounded-lg border border-[#333] bg-[#111] px-2.5 py-1 text-[11px] font-bold text-slate-400 font-orbitron uppercase tracking-wider">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-sm font-bold text-slate-500 font-outfit">
                Manage tutorials from the public{" "}
                <Link to="/tutorials" className="text-primary hover:underline hover:text-lime-400">tutorials page</Link>.
              </p>
            </Card>
          )}

          {tab === "messages" && (
            <Card title="Contact Messages">
              <ul className="divide-y-4 divide-[#222] divide-dashed">
                {MOCK_MESSAGES.map((m) => (
                  <li key={m.id} className="flex items-start gap-4 py-6">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#0A0A0A] border-2 border-[#222] text-primary shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1 font-outfit">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-base font-black text-slate-900">{m.subject}</p>
                        <span className="text-xs font-bold text-slate-500">{m.date}</span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-slate-600">
                        <span className="font-bold text-slate-800">{m.name}</span> · {m.email}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
  tone?: "ok" | "warn";
}) {
  const toneCls =
    tone === "ok"
      ? "text-emerald-500"
      : tone === "warn"
        ? "text-amber-500"
        : "text-primary";
  return (
    <div className="rounded-3xl border-4 border-[#222] bg-[#0A0A0A] p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] text-white">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-black uppercase tracking-widest text-[#C7CBCE] font-orbitron">{label}</p>
        <Icon className={`h-6 w-6 ${toneCls}`} />
      </div>
      <p className="mt-4 text-4xl font-black font-orbitron tracking-wide">{value}</p>
      {hint && <p className="mt-2 text-xs font-bold text-slate-500 font-outfit">{hint}</p>}
    </div>
  );
}

function Card({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border-4 border-[#222] bg-white p-6 sm:p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-black font-orbitron uppercase tracking-wide text-slate-900">{title}</h2>
        {right}
      </div>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: AppRow["status"] }) {
  const map: Record<AppRow["status"], string> = {
    Pending: "bg-amber-100 text-amber-700 border-amber-300",
    Reviewed: "bg-sky-100 text-sky-700 border-sky-300",
    Accepted: "bg-primary text-black border-black",
  };
  return (
    <span className={`inline-flex items-center rounded-lg border-2 px-3 py-1 text-[11px] font-black uppercase tracking-wider font-orbitron shadow-[2px_2px_0px_rgba(0,0,0,1)] ${map[status]}`}>
      {status}
    </span>
  );
}

function ActivityItem({
  icon: Icon,
  text,
  time,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  time: string;
}) {
  return (
    <li className="flex items-start gap-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0A0A0A] border-2 border-[#222] text-primary shadow-[2px_2px_0px_rgba(0,0,0,1)]">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 font-outfit">
        <p className="text-sm font-bold text-slate-800">{text}</p>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">{time}</p>
      </div>
    </li>
  );
}
