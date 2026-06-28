import { Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    title: "Learn",
    links: [
      { label: "Roadmaps", to: "/roadmaps" },
      { label: "Tutorials", to: "/tutorials" },
      { label: "Free Resources", to: "/roadmaps" },
    ],
  },
  {
    title: "Programs",
    links: [
      { label: "Internships", to: "/internships" },
      { label: "Apply Now", to: "/internships" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", to: "/contact" },
      { label: "Privacy Policy", to: "/contact" },
      { label: "Terms of Service", to: "/contact" },
    ],
  },
];

const SOCIALS = [
  { href: "https://www.instagram.com/infynuxacademy/", label: "Instagram", Icon: Instagram },
  { href: "https://whatsapp.com/channel/0029VbCVGAtBVJkxGWCc4002", label: "WhatsApp", Icon: MessageCircle },
  { href: "https://www.facebook.com/share/1BpJDJeTC2/", label: "Facebook", Icon: Facebook },
  { href: "https://linkedin.com/company/infynux-solutions/", label: "LinkedIn", Icon: Linkedin },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative border-t border-slate-200 bg-white/80 backdrop-blur-sm"
      aria-label="Site footer"
    >
      {/* Subtle maroon gradient top line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#800000]/30 to-transparent" />

      <div className="container-page py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand block */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 font-display font-bold hover:opacity-80 transition-opacity"
              aria-label="Infynux Academy home"
            >
              <img src="/new-logo.png" alt="Infynux Academy Logo" className="h-14 w-auto object-contain drop-shadow-sm" />
              <span className="font-orbitron text-lg text-[#800000]">Infynux Academy</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500 font-outfit">
              Free learning roadmaps, tutorials, and remote internships for students and freshers in India. Start your tech career today.
            </p>

            {/* Contact info */}
            <ul className="mt-5 space-y-2.5" role="list">
              <li>
                <a
                  href="mailto:support@infynuxsolutions.in"
                  className="group inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#800000] transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0 text-[#800000]/50 group-hover:text-[#800000] transition-colors" aria-hidden="true" />
                  support@infynuxsolutions.in
                </a>
              </li>
              <li>
                <a
                  href="tel:+919999999999"
                  className="group inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#800000] transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[#800000]/50 group-hover:text-[#800000] transition-colors" aria-hidden="true" />
                  +91 70108 50923
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="h-4 w-4 shrink-0 text-[#800000]/50" aria-hidden="true" />
                  India (Remote-first)
                </span>
              </li>
            </ul>

            {/* Social links */}
            <ul className="mt-6 flex gap-2.5" role="list">
              {SOCIALS.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:border-[#800000]/25 hover:text-[#800000] hover:bg-[#800000]/5 hover:shadow-[0_2px_8px_rgba(128,0,0,0.10)]"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav sections */}
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#800000] font-orbitron">
                {section.title}
              </h3>
              <ul className="space-y-3" role="list">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="group inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-[#800000] font-outfit"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-2 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-slate-400 font-outfit">
            © {year} Infynux Solutions. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 font-outfit">
            Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
}
