import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/roadmaps", label: "Roadmaps" },
  { to: "/tutorials", label: "Tutorials" },
  { to: "/internships", label: "Internships" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-1.5 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl gradient-hero text-white shadow-brand">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            Infynux <span className="gradient-text">Academy</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-foreground/75 hover:text-foreground hover:bg-muted",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/internships"
            className="ml-3 inline-flex items-center justify-center rounded-md gradient-hero px-4 py-2 text-sm font-semibold text-white shadow-brand transition-transform hover:-translate-y-0.5"
          >
            Apply Now
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-muted"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <nav aria-label="Mobile" className="container-page flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-3 py-3 text-base font-medium text-foreground/85 hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/internships"
              className="mt-2 inline-flex items-center justify-center rounded-md gradient-hero px-4 py-3 text-base font-semibold text-white shadow-brand"
            >
              Apply Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
