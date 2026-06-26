import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { signIn, getSession, DEMO_CREDENTIALS } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Infynux Academy" },
      { name: "description", content: "Sign in to the Infynux Academy admin dashboard." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getSession()) navigate({ to: "/admin" });
  }, [navigate]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => {
      const session = signIn(email, password);
      setLoading(false);
      if (session) navigate({ to: "/admin" });
      else setError("Invalid email or password. Please try again.");
    }, 500);
  }

  return (
    <section className="container-page flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl gradient-hero shadow-brand">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold">
            Admin <span className="gradient-text">Sign In</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Restricted area. Authorized personnel only.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
        >
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@infynux.com"
                  className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-10 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded text-muted-foreground hover:bg-muted"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center rounded-md gradient-hero px-4 text-sm font-semibold text-white shadow-brand transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>

            <div className="rounded-md border border-dashed border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground/80">Demo credentials</p>
              <p className="mt-0.5">Email: {DEMO_CREDENTIALS.email}</p>
              <p>Password: {DEMO_CREDENTIALS.password}</p>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground">
                ← Back to site
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
