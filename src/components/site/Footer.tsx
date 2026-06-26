import { Link } from "@tanstack/react-router";
import { Github, Instagram, Linkedin, Twitter, Youtube, GraduationCap } from "lucide-react";

const SOCIALS = [
  { href: "https://linkedin.com", label: "LinkedIn", Icon: Linkedin },
  { href: "https://instagram.com", label: "Instagram", Icon: Instagram },
  { href: "https://twitter.com", label: "Twitter / X", Icon: Twitter },
  { href: "https://github.com", label: "GitHub", Icon: Github },
  { href: "https://youtube.com", label: "YouTube", Icon: Youtube },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-hero text-white shadow-brand">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>Infynux Academy</span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Free structured learning + real internships for India's next generation of builders.
          </p>
          <ul className="mt-5 flex gap-3" aria-label="Social links">
            {SOCIALS.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-primary hover:border-primary"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <FooterCol
          title="Quick Links"
          links={[
            { to: "/", label: "Home" },
            { to: "/roadmaps", label: "Roadmaps" },
            { to: "/tutorials", label: "Tutorials" },
            { to: "/internships", label: "Internships" },
            { to: "/contact", label: "Contact" },
          ]}
        />
        <FooterCol
          title="Domains"
          links={[
            { to: "/roadmaps", label: "Web Development" },
            { to: "/roadmaps", label: "Cloud (AWS)" },
            { to: "/roadmaps", label: "App Development" },
            { to: "/roadmaps", label: "AI & Automation" },
            { to: "/roadmaps", label: "Digital Marketing" },
          ]}
        />
        <div>
          <h3 className="text-sm font-semibold text-foreground">Get in touch</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>hello@infynuxacademy.com</li>
            <li>+91 90000 00000</li>
            <li>Mon–Fri · 9AM – 6PM IST</li>
          </ul>
          <div className="mt-5 flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-5 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Infynux Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
