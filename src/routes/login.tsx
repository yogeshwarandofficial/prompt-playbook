import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { signIn, getSession } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Portal Login — Infynux Academy" },
      { name: "description", content: "Sign in to the Infynux Academy portal." },
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
    getSession().then((session) => {
      if (session) {
        if (session.role === 'STUDENT') {
          navigate({ to: "/intern-portal" });
        } else {
          navigate({ to: "/admin" });
        }
      }
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const session = await signIn(email, password);
    setLoading(false);
    
    if (session) {
      if (session.role === 'STUDENT') {
        navigate({ to: "/intern-portal" });
      } else {
        navigate({ to: "/admin" });
      }
    } else {
      setError("Invalid credentials. Please try again.");
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] md:h-[700px]">
        
        {/* Left Side - Branding (Hidden on small screens) */}
        <div className="hidden md:flex md:w-1/2 relative p-12 flex-col justify-between overflow-hidden bg-[#0A1128]">
          {/* Abstract Background Gradient/Shapes */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0A1128] via-[#101F42] to-[#1A316B] opacity-90"></div>
            {/* CSS waves to mimic the screenshot */}
            <div className="absolute -bottom-32 -left-20 w-[120%] h-96 bg-blue-600/20 blur-3xl rounded-full transform -rotate-12"></div>
            <div className="absolute top-1/3 -right-20 w-80 h-80 bg-indigo-500/20 blur-3xl rounded-full mix-blend-screen"></div>
          </div>

          <div className="relative z-10 flex items-center gap-2">
             <div className="rounded-lg p-1">
                {/* Minimal logo placeholder */}
                <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" fillOpacity="0.1"/>
                  <path d="M12 7V17M8 11L12 15L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
             </div>
             <span className="text-white text-xl font-bold tracking-tight">Infynux <span className="text-blue-500 font-medium">Academy</span></span>
          </div>

          <div className="relative z-10 max-w-md mt-20">
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              The platform where students <span className="text-blue-400">learn</span> and build real <span className="text-indigo-400">projects</span>.
            </h1>
            <p className="mt-6 text-slate-400 text-lg">
              The trusted choice for launching your tech career.
            </p>
          </div>

          <div className="relative z-10 text-slate-500 text-xs">
            © {new Date().getFullYear()} Infynux Academy. All rights reserved.
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center relative bg-white">
          
          <div className="absolute top-8 right-8 hidden sm:block">
            <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back to site
            </Link>
          </div>

          <div className="max-w-md w-full mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl font-semibold text-slate-900 mb-2">Welcome back!</h2>
              <p className="text-slate-500 text-sm">Sign in to your account to continue</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-medium text-slate-500 ml-1">
                  User ID (Student or Admin)
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    id="email"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="INFY-26-TEST-001 or admin ID"
                    className="w-full h-12 pl-11 pr-4 bg-slate-50 border-none rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/50 transition-shadow outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-xs font-medium text-slate-500 ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 pl-11 pr-12 bg-slate-50 border-none rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/50 transition-shadow outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-[#4F84FF] to-[#7B5CFF] hover:opacity-90 text-white font-medium text-sm rounded-xl transition-opacity disabled:opacity-70 mt-4"
              >
                {loading ? "Signing in..." : "Sign In"} <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </form>

            <div className="mt-8 flex items-center gap-4 before:h-px before:flex-1 before:bg-slate-100 after:h-px after:flex-1 after:bg-slate-100">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">OR</span>
            </div>

            <div className="mt-8">
              <Link to="/" className="w-full h-12 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium text-sm rounded-xl transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
