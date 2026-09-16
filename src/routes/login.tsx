import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
    <>
      <style>{`
        .login-page-wrapper {
            background-color: #050505;
            background-image: 
                radial-gradient(circle at 15% 50%, rgba(16, 185, 129, 0.08), transparent 25%),
                radial-gradient(circle at 85% 30%, rgba(16, 185, 129, 0.12), transparent 25%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 24px;
            color: #111827;
            font-family: 'Inter', sans-serif;
            margin: 0;
            box-sizing: border-box;
        }

        .login-page-wrapper * {
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
        }

        /* Container */
        .login-container {
            width: 100%;
            max-width: 1200px;
            height: 760px;
            background: #FFFFFF;
            border-radius: 32px;
            box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.7);
            display: flex;
            overflow: hidden;
            position: relative;
            animation: fadeIn 0.8s ease-out forwards;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Left Panel - Login */
        .login-left {
            width: 45%;
            padding: 56px 64px;
            display: flex;
            flex-direction: column;
            background: #FFFFFF;
        }

        .login-top-bar {
            margin-bottom: auto;
        }

        .login-back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            font-weight: 600;
            color: #6B7280;
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 999px;
            border: 1px solid #E5E7EB;
            transition: all 0.2s;
            width: max-content;
        }

        .login-back-link:hover {
            color: #10B981;
            border-color: #10B981;
            background: #F0FDF4;
        }

        .login-back-link svg {
            width: 16px;
            height: 16px;
            stroke: currentColor;
        }

        .login-content {
            max-width: 380px;
            width: 100%;
            margin: 0 auto;
        }

        .login-brand {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 32px;
        }

        .login-brand img {
            height: 48px;
            width: auto;
        }

        .login-brand h2 {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.5px;
            color: #111827;
            margin: 0;
        }

        .login-brand h2 span {
            color: #10B981;
        }

        .login-title {
            font-size: 36px;
            font-weight: 800;
            letter-spacing: -1px;
            color: #111827;
            margin-bottom: 12px;
            margin-top: 0;
        }

        .login-subtitle {
            font-size: 15px;
            color: #6B7280;
            margin-bottom: 40px;
            line-height: 1.5;
            margin-top: 0;
        }

        .login-form-group {
            margin-bottom: 24px;
            position: relative;
        }

        .login-form-group label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
        }

        .login-input-wrapper {
            position: relative;
        }

        .login-input-wrapper input {
            width: 100%;
            height: 52px;
            border-radius: 12px;
            border: 1px solid #E5E7EB;
            background: #F9FAFB;
            padding: 0 16px;
            font-size: 15px;
            color: #111827;
            transition: all 0.2s;
        }

        .login-input-wrapper input::placeholder {
            color: #9CA3AF;
        }

        .login-input-wrapper input:focus {
            outline: none;
            background: #FFFFFF;
            border-color: #10B981;
            box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }

        .login-eye-btn {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #9CA3AF;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            transition: color 0.2s;
        }

        .login-eye-btn:hover {
            color: #4B5563;
        }

        .login-submit-btn {
            width: 100%;
            height: 52px;
            border-radius: 12px;
            border: none;
            background: #10B981;
            color: #FFFFFF;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s;
            margin-top: 12px;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
        }

        .login-submit-btn:hover:not(:disabled) {
            background: #059669;
            transform: translateY(-1px);
            box-shadow: 0 8px 20px rgba(16, 185, 129, 0.35);
        }

        .login-submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }

        .login-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto;
            font-size: 13px;
            color: #9CA3AF;
        }

        .login-footer a {
            color: #6B7280;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s;
        }

        .login-footer a:hover {
            color: #10B981;
        }

        /* Right Panel - Hero */
        .login-right {
            width: 55%;
            background-color: #09090B;
            background-image: 
                linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 32px 32px;
            background-position: center;
            position: relative;
            overflow: hidden;
            padding: 56px 64px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: #FFFFFF;
        }

        /* Dark gradient mask for the grid */
        .login-right::before {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at center, transparent 0%, #09090B 90%);
            z-index: 0;
        }

        .login-right > * {
            position: relative;
            z-index: 2;
        }

        .login-badge {
            align-self: flex-start;
            display: inline-flex;
            align-items: center;
            padding: 6px 16px;
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.2);
            border-radius: 999px;
            color: #10B981;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        .login-student-showcase {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            height: 240px;
            margin: 10px 0;
        }

        .login-glow-orb {
            position: absolute;
            width: 220px;
            height: 220px;
            background: #10B981;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.25;
        }

        .login-decoration-circle {
            position: absolute;
            width: 240px;
            height: 240px;
            border: 1px dashed rgba(16, 185, 129, 0.3);
            border-radius: 50%;
            animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .login-student-img {
            max-height: 280px;
            width: auto;
            object-fit: contain;
            z-index: 2;
            filter: drop-shadow(0 20px 30px rgba(0,0,0,0.5));
        }

        .login-hero-text h1 {
            font-size: 44px;
            font-weight: 800;
            line-height: 1.1;
            letter-spacing: -1px;
            color: #FFFFFF;
            margin-bottom: 16px;
            margin-top: 0;
        }

        .login-hero-text h1 span {
            color: #10B981;
        }

        .login-hero-text p {
            font-size: 15px;
            color: #A1A1AA;
            line-height: 1.6;
            margin-bottom: 32px;
            margin-top: 0;
            max-width: 90%;
        }

        .login-features-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .login-feature-card {
            display: flex;
            align-items: flex-start;
            gap: 16px;
            padding: 16px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            backdrop-filter: blur(10px);
            transition: all 0.3s;
        }

        .login-feature-card:hover {
            background: rgba(255, 255, 255, 0.04);
            border-color: rgba(16, 185, 129, 0.3);
            transform: translateY(-2px);
        }

        .login-feature-icon {
            width: 36px;
            height: 36px;
            flex-shrink: 0;
            border-radius: 10px;
            background: rgba(16, 185, 129, 0.1);
            color: #10B981;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .login-feature-icon svg {
            width: 18px;
            height: 18px;
            stroke: currentColor;
            strokeWidth: 2;
            strokeLinecap: round;
            strokeLinejoin: round;
            fill: none;
        }

        .login-feature-text h3 {
            font-size: 14px;
            font-weight: 600;
            color: #FFFFFF;
            margin-bottom: 4px;
            margin-top: 0;
        }

        .login-feature-text p {
            font-size: 13px;
            color: #8F968F;
            line-height: 1.4;
            margin: 0;
        }

        /* MOBILE */
        @media(max-width: 1024px) {
            .login-container {
                flex-direction: column;
                height: auto;
                max-width: 560px;
                margin: 40px 0;
            }
            
            .login-left, .login-right {
                width: 100%;
                padding: 48px 40px;
            }
            
            .login-features-grid {
                grid-template-columns: 1fr;
            }

            .login-student-showcase {
                height: 200px;
            }

            .login-student-img {
                max-height: 240px;
            }

            .login-hero-text h1 {
                font-size: 36px;
            }
        }
      `}</style>
      <div className="login-page-wrapper">
        <div className="login-container">
          {/* LEFT LOGIN PANEL */}
          <section className="login-left">
              <div className="login-top-bar">
                  <Link to="/" className="login-back-link">
                      <svg viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Back to site
                  </Link>
              </div>

              <div className="login-content">
                  <div className="login-brand">
                      <img src="/INfynux-Logo 1.png" alt="Infynux Logo" />
                      <h2>Infynux <span>Academy</span></h2>
                  </div>

                  <h1 className="login-title">Welcome back</h1>
                  <p className="login-subtitle">Sign in to your account to continue your learning journey.</p>

                  <form onSubmit={onSubmit}>
                      <div className="login-form-group">
                          <label>User ID (Student or Admin)</label>
                          <div className="login-input-wrapper">
                              <input 
                                type="text" 
                                placeholder="INFY-26-TEST-001" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                          </div>
                      </div>

                      <div className="login-form-group">
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <label style={{ marginBottom: 0 }}>Password</label>
                              <a href="#" style={{ fontSize: '13px', color: '#10B981', textDecoration: 'none', fontWeight: 500 }}>Forgot?</a>
                          </div>
                          <div className="login-input-wrapper">
                              <input 
                                id="password" 
                                type={showPw ? "text" : "password"} 
                                placeholder="••••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                              />
                              <button type="button" className="login-eye-btn" onClick={() => setShowPw(!showPw)}>
                                  {showPw ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                      <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                  ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                  )}
                              </button>
                          </div>
                      </div>

                      {error && (
                        <div style={{ padding: '12px', fontSize: '13px', color: '#DC2626', backgroundColor: '#FEF2F2', borderRadius: '8px', marginBottom: '16px' }}>
                          {error}
                        </div>
                      )}

                      <button type="submit" className="login-submit-btn" disabled={loading}>
                          {loading ? "Signing In..." : "Sign In"} 
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                      </button>
                  </form>
              </div>

              <div className="login-footer">
                  <p>© {new Date().getFullYear()} Infynux Academy.</p>
                  <a href="#">Help & Support</a>
              </div>
          </section>

          {/* RIGHT PANEL */}
          <section className="login-right">
              <div className="login-badge">LEARN • BUILD • GET HIRED</div>

              <div className="login-student-showcase">
                  <div className="login-glow-orb"></div>
                  <div className="login-decoration-circle"></div>
                  <img className="login-student-img" src="/student.png" alt="Student" />
              </div>

              <div className="login-hero-text">
                  <h1>Your future in tech<br/><span>starts here.</span></h1>
                  <p>Gain hands-on experience, work on real-world projects, and build the skills you need to launch your dream career in technology.</p>
              </div>

              <div className="login-features-grid">
                  <div className="login-feature-card">
                      <div className="login-feature-icon">
                          <svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                      </div>
                      <div className="login-feature-text">
                          <h3>Structured Roadmaps</h3>
                          <p>Learn step-by-step with curated paths.</p>
                      </div>
                  </div>

                  <div className="login-feature-card">
                      <div className="login-feature-icon">
                          <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                      </div>
                      <div className="login-feature-text">
                          <h3>Hands-on Projects</h3>
                          <p>Build portfolio-worthy applications.</p>
                      </div>
                  </div>

                  <div className="login-feature-card">
                      <div className="login-feature-icon">
                          <svg viewBox="0 0 24 24"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2l.5-.5m1.5-1.5 2.5 2.5m11.5-11.5c-2.5.5-5 1.5-7 3.5-3 3-4 6.5-4 9.5 3-1 6.5-2 9.5-5 2-2 3-4.5 3.5-7Z"/></svg>
                      </div>
                      <div className="login-feature-text">
                          <h3>Internships & Placements</h3>
                          <p>Work with verified industry projects.</p>
                      </div>
                  </div>

                  <div className="login-feature-card">
                      <div className="login-feature-icon">
                          <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                      </div>
                      <div className="login-feature-text">
                          <h3>Certificates & Growth</h3>
                          <p>Earn credentials and become ready.</p>
                      </div>
                  </div>
              </div>
          </section>
        </div>
      </div>
    </>
  );
}
