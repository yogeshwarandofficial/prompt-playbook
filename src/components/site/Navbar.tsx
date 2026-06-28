import { Link, useRouterState } from "@tanstack/react-router";
import { GraduationCap, Menu, X, Instagram, Linkedin, MessageCircle, Facebook } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { to: "/roadmaps", label: "Roadmaps" },
  { to: "/tutorials", label: "Tutorials" },
  { to: "/internships", label: "Internships" },
  { to: "/contact", label: "Contact" },
] as const;

const SOCIALS = [
  { href: "https://www.instagram.com/infynuxacademy/", label: "Instagram", Icon: Instagram },
  { href: "https://whatsapp.com/channel/0029VbCVGAtBVJkxGWCc4002", label: "WhatsApp", Icon: MessageCircle },
  { href: "https://www.facebook.com/share/1BpJDJeTC2/", label: "Facebook", Icon: Facebook },
  { href: "https://linkedin.com/company/infynux-solutions/", label: "LinkedIn", Icon: Linkedin },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Trap focus in drawer
  useEffect(() => {
    if (!open) return;
    const el = drawerRef.current;
    if (!el) return;
    const focusables = el.querySelectorAll<HTMLElement>(
      'a, button, input, [tabindex]:not([tabindex="-1"])'
    );
    focusables[0]?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); hamburgerRef.current?.focus(); }
      if (e.key === "Tab") {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300 border-b",
          scrolled
            ? "border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm"
            : "border-transparent bg-white/70 backdrop-blur-md"
        )}
        role="banner"
      >
        <nav
          className="container-page flex h-16 items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-display text-lg font-bold text-slate-900 hover:opacity-80 transition-opacity"
            aria-label="Infynux Academy home"
          >
            <img src="/new-logo.png" alt="Infynux Academy Logo" className="h-14 w-auto object-contain drop-shadow-sm" />
            <span className="hidden sm:block font-orbitron text-[#800000]">Infynux Academy</span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 md:flex" role="list">
            {NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.to);
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={cn(
                      "relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 font-orbitron",
                      isActive
                        ? "text-[#800000]"
                        : "text-slate-600 hover:text-[#800000] hover:bg-[#800000]/5"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-[#800000]"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/internships"
              className="hidden items-center rounded-xl bg-[#800000] px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_15px_rgba(128,0,0,0.25)] transition-all hover:bg-[#6B0000] hover:shadow-[0_4px_20px_rgba(128,0,0,0.35)] hover:scale-[1.02] active:scale-[0.98] md:flex font-orbitron"
            >
              Apply Now
            </Link>

            {/* Hamburger — mobile */}
            <button
              ref={hamburgerRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-[#800000] hover:border-[#800000]/20 hover:bg-[#800000]/5 transition-all md:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "fixed inset-y-0 right-0 z-[70] flex w-72 flex-col bg-white border-l border-slate-200 shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Drawer header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <Link to="/" className="flex items-center gap-2 font-display text-base font-bold">
            <img src="/new-logo.png" alt="Infynux Academy Logo" className="h-10 w-auto object-contain drop-shadow-sm" />
            <span className="font-orbitron text-[#800000] text-sm">Infynux</span>
          </Link>
          <button
            type="button"
            onClick={() => { setOpen(false); hamburgerRef.current?.focus(); }}
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:text-[#800000] hover:bg-[#800000]/5 transition-all"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Mobile navigation">
          <ul className="space-y-1" role="list">
            {NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.to);
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={cn(
                      "flex min-h-[52px] items-center rounded-xl px-4 text-base font-medium transition-all font-orbitron",
                      isActive
                        ? "bg-[#800000]/8 text-[#800000] border border-[#800000]/15"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#800000] border border-transparent"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-6">
            <Link
              to="/internships"
              className="flex w-full items-center justify-center rounded-xl bg-[#800000] px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_15px_rgba(128,0,0,0.2)] font-orbitron hover:bg-[#6B0000] transition-all"
            >
              Apply for Internship
            </Link>
          </div>
        </nav>

        {/* Social links at bottom */}
        <div className="border-t border-slate-100 px-5 py-6 bg-slate-50/50">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 font-orbitron">
            Follow us
          </p>
          <ul className="flex gap-2.5" role="list">
            {SOCIALS.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:border-[#800000]/30 hover:text-[#800000] hover:bg-[#800000]/5"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
