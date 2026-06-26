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
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{session.email}</span>
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-muted"
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
                    "inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors " +
                    (active
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/75 hover:bg-muted hover:text-foreground")
                  }
                >
                  <Icon className="h-4 w-4" />
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
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{d.short}</span>
                            <span className="text-muted-foreground">{count} ({pct}%)</span>
                          </div>
                          <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                            <div className="h-full gradient-hero" style={{ width: `${pct}%` }} />
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
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search…"
                    className="h-9 w-56 rounded-md border border-input bg-background pl-8 pr-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="py-2 pr-3 font-medium">ID</th>
                      <th className="py-2 pr-3 font-medium">Applicant</th>
                      <th className="py-2 pr-3 font-medium">Domain</th>
                      <th className="py-2 pr-3 font-medium">Date</th>
                      <th className="py-2 pr-3 font-medium">Status</th>
                      <th className="py-2 pr-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApps.map((a) => (
                      <tr key={a.id} className="border-b border-border/60 last:border-0">
                        <td className="py-3 pr-3 font-mono text-xs text-muted-foreground">{a.id}</td>
                        <td className="py-3 pr-3">
                          <div className="font-medium">{a.name}</div>
                          <div className="text-xs text-muted-foreground">{a.email}</div>
                        </td>
                        <td className="py-3 pr-3">{a.domain}</td>
                        <td className="py-3 pr-3 text-muted-foreground">{a.date}</td>
                        <td className="py-3 pr-3"><StatusBadge status={a.status} /></td>
                        <td className="py-3 pr-3">
                          <div className="flex flex-wrap gap-1">
                            {(["Pending", "Reviewed", "Accepted"] as const).map((s) => (
                              <button
                                key={s}
                                onClick={() => updateStatus(a.id, s)}
                                className={
                                  "rounded px-2 py-1 text-xs font-medium transition-colors " +
                                  (a.status === s
                                    ? "bg-primary text-primary-foreground"
                                    : "border border-input hover:bg-muted")
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
                        <td colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
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
              <div className="grid gap-4 sm:grid-cols-2">
                {DOMAINS.map((d) => (
                  <div
                    key={d.key}
                    className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{d.icon}</span>
                        <div>
                          <div className="font-semibold">{d.name}</div>
                          <div className="text-xs text-muted-foreground">{d.duration}</div>
                        </div>
                      </div>
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        {d.tutorials} tutorials
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{d.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {d.skills.slice(0, 4).map((s) => (
                        <span key={s} className="rounded-md bg-muted px-2 py-0.5 text-xs">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs text-muted-foreground">
                Manage tutorials from the public{" "}
                <Link to="/tutorials" className="text-primary hover:underline">tutorials page</Link>.
              </p>
            </Card>
          )}

          {tab === "messages" && (
            <Card title="Contact Messages">
              <ul className="divide-y divide-border">
                {MOCK_MESSAGES.map((m) => (
                  <li key={m.id} className="flex items-start gap-3 py-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-medium">{m.subject}</p>
                        <span className="text-xs text-muted-foreground">{m.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {m.name} · {m.email}
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
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <Icon className={`h-4 w-4 ${toneCls}`} />
      </div>
      <p className="mt-2 font-display text-3xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
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
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {right}
      </div>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: AppRow["status"] }) {
  const map: Record<AppRow["status"], string> = {
    Pending: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    Reviewed: "bg-sky-500/10 text-sky-500 border-sky-500/30",
    Accepted: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  };
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[status]}`}>
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
    <li className="flex items-start gap-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p>{text}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </li>
  );
}
