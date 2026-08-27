import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
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
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-slate-50 border border-black shadow-sm">
            <ShieldCheck className="h-8 w-8 text-slate-700" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Admin <span className="text-slate-900 bg-slate-50 px-3 py-1 rounded-lg border-2 border-black ml-1 shadow-sm">Sign In</span>
          </h1>
          <p className="mt-6 text-base text-slate-500 font-medium">
            Restricted area. Authorized personnel only.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border-2 border-black bg-white p-8 sm:p-10 shadow-sm"
        >
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@infynux.com"
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>

            <div className="rounded-xl border border-black bg-slate-50 px-5 py-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800 mb-2 text-xs uppercase tracking-widest">Demo credentials</p>
              <p className="mt-0.5"><span className="text-slate-500">Email:</span> <span className="font-semibold text-slate-900">{DEMO_CREDENTIALS.email}</span></p>
              <p className="mt-1"><span className="text-slate-500">Password:</span> <span className="font-semibold text-slate-900">{DEMO_CREDENTIALS.password}</span></p>
            </div>

            <p className="text-center text-sm font-medium text-slate-500 mt-6 pt-2 border-t border-slate-100">
              <Link to="/" className="hover:text-slate-900 transition-colors flex items-center justify-center gap-2 mt-4">
                <ArrowLeft className="h-4 w-4" /> Back to site
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
