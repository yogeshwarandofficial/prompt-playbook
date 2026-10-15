import React, { useMemo } from "react";
import { ExternalLink, ArrowUpRight, BookOpen, CheckCircle, ChevronDown, ChevronUp, Layers, ListOrdered } from "lucide-react";

export interface ParsedLink {
  label: string;
  url: string;
}

/**
 * Parses comma-separated, newline-separated, labeled, or markdown reference links.
 * Example inputs:
 *  - "https://react.dev/learn, https://vite.dev/guide/"
 *  - "React Quick Start: https://react.dev/learn, Managing State: https://react.dev/learn/managing-state"
 *  - "React Quick Start: [https://react.dev/learn](https://react.dev/learn)\nVite Guide: https://vite.dev/guide/"
 */
export function parseMultiLinks(raw?: string): ParsedLink[] {
  if (!raw || typeof raw !== "string") return [];

  const rawTrimmed = raw.trim();
  if (!rawTrimmed) return [];

  // Split by newlines first
  const rawLines = rawTrimmed.split(/[\r\n]+/);
  const segments: string[] = [];

  for (const line of rawLines) {
    const l = line.trim();
    if (!l) continue;

    // Check if line contains multiple comma-separated URLs
    // We split by comma only if the comma is followed by optional whitespace and a URL or Label: URL
    if (l.includes(",")) {
      // Split on comma followed by space or URL start
      const parts = l.split(/,\s*(?=[^,]*https?:\/\/|[A-Za-z0-9_\-\s]+:|$)/i);
      for (const p of parts) {
        if (p.trim()) segments.push(p.trim());
      }
    } else {
      segments.push(l);
    }
  }

  const results: ParsedLink[] = [];

  for (const seg of segments) {
    if (!seg) continue;

    // Pattern 1: Markdown link [Label](https://url)
    const mdMatch = seg.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/i);
    if (mdMatch) {
      const url = mdMatch[2].trim();
      if (/^https?:\/\//i.test(url)) {
        results.push({ label: mdMatch[1].trim(), url });
      }
      continue;
    }

    // Pattern 2: Label: https://url or plain https://url
    const urlMatch = seg.match(/(https?:\/\/[^\s,;]+)/i);
    if (urlMatch) {
      let url = urlMatch[1].trim();
      // Remove trailing punctuation from URL
      url = url.replace(/[.,;)]+$/, "");

      if (/^https?:\/\//i.test(url)) {
        let label = seg.replace(urlMatch[0], "").trim();
        // Remove trailing or leading colons, dashes, brackets
        label = label.replace(/^[:\-–—\s\[\]]+|[:\-–—\s\[\]]+$/g, "").trim();

        if (!label) {
          try {
            const u = new URL(url);
            label = u.hostname.replace(/^www\./, "") + (u.pathname.length > 1 ? u.pathname : "");
          } catch {
            label = url;
          }
        }

        results.push({ label, url });
      }
    }
  }

  return results;
}

/**
 * Renders multiple links in separate consecutive rows ("next next lines")
 * with icons, labels, safe target="_blank", and hover states.
 */
export function TaskLinksView({
  taskUrl,
  className = "",
}: {
  taskUrl?: string;
  className?: string;
}) {
  const links = useMemo(() => parseMultiLinks(taskUrl), [taskUrl]);

  if (links.length === 0) return null;

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
        <BookOpen className="h-3 w-3 text-[#0D7A53]" />
        <span>Reference & Learning Resources ({links.length})</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {links.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#E6F7F0] hover:bg-[#d5f3e4] border border-[#0D7A53]/25 text-[#064E3B] text-xs font-bold transition-all shadow-xs group"
          >
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#0D7A53] shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <ExternalLink className="h-2.5 w-2.5" />
            </div>
            <span className="font-bold flex-1 truncate">{link.label}</span>
            <span className="text-[11px] text-[#0D7A53]/80 font-mono truncate max-w-xs hidden sm:inline">
              {link.url}
            </span>
            <ArrowUpRight className="h-3 w-3 text-[#0D7A53] shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </div>
  );
}

/**
 * Converts text containing URLs or markdown links into clickable, safe HTML elements.
 */
function renderTextWithLinks(text: string) {
  // Replace markdown links [Label](url) or plain URLs
  const parts: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<]+)/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      // Markdown link
      const label = match[1];
      const url = match[2];
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0D7A53] hover:underline font-bold inline-flex items-center gap-0.5"
        >
          <span>{label}</span>
          <ExternalLink className="h-2.5 w-2.5 inline" />
        </a>
      );
    } else if (match[3]) {
      // Plain URL
      const url = match[3].replace(/[.,;)]+$/, "");
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0D7A53] hover:underline font-bold inline-flex items-center gap-0.5 break-all"
        >
          <span>{url}</span>
          <ExternalLink className="h-2.5 w-2.5 inline" />
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

/**
 * Beautifully formats structured task descriptions (like objectives, technical requirements,
 * numbered milestones, deliverables, learning resources, constraints).
 * Preserves paragraphs, formatting, headings, and avoids messy "mingled" walls of text.
 */
export function StructuredTaskDescription({
  description,
  expanded = false,
  onToggle,
}: {
  description?: string;
  expanded?: boolean;
  onToggle?: () => void;
}) {
  if (!description || !description.trim()) return null;

  const text = description.trim();
  const isMultiLine = text.includes("\n") || text.length > 150;

  // Split into lines for structured inspection
  const lines = text.split(/\r?\n/);

  // If collapsed and long, show clean multi-line preview
  if (!expanded && isMultiLine) {
    // Show first 3 non-empty lines with clean line breaks
    const previewLines = lines.filter(l => l.trim()).slice(0, 3);

    return (
      <div className="space-y-1.5">
        <div className="space-y-1 text-xs text-slate-600">
          {previewLines.map((l, i) => (
            <div key={i} className="line-clamp-1 leading-relaxed">
              {renderTextWithLinks(l)}
            </div>
          ))}
        </div>
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0D7A53] hover:underline pt-0.5"
          >
            <span>Read full structured requirements ({lines.length} lines)</span>
            <ChevronDown className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }

  // Fully expanded / structured view:
  return (
    <div className="space-y-3">
      <div className="p-4 bg-slate-50/95 rounded-2xl border border-slate-200/90 text-xs sm:text-sm text-slate-800 space-y-2.5 shadow-xs">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          if (!trimmed) {
            return <div key={idx} className="h-2" />;
          }

          // Check if this line is a major Section Heading
          // e.g. "Objective", "Technical Requirements", "Deliverables", "Learning Resources", "Constraints:", "Expected duration:"
          const isSectionHeader =
            /^(Objective|Technical Requirements|Requirements|Deliverables|Learning Resources|Resources|Component Structure|UI Development|React Functionality|Project Setup|Testing and Git|Constraints|Expected duration|Notes):?$/i.test(
              trimmed
            ) ||
            /^[A-Z][A-Za-z\s]{2,25}:$/.test(trimmed);

          if (isSectionHeader) {
            return (
              <div key={idx} className="pt-2 pb-1 border-b border-slate-200/80 first:pt-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-white border border-slate-200 text-[#111317] shadow-xs">
                  <Layers className="h-3 w-3 text-[#0D7A53]" />
                  {trimmed.replace(/:$/, "")}
                </span>
              </div>
            );
          }

          // Check if line is a numbered sub-milestone (e.g., "1. Project Setup", "2. UI Development")
          const isNumberedHeading = /^\d+\.\s+[A-Za-z]/.test(trimmed);
          if (isNumberedHeading) {
            return (
              <div key={idx} className="pt-2 font-bold text-[#111317] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#111317] text-[#34D399] text-[10px] font-black flex items-center justify-center shrink-0">
                  {trimmed.match(/^\d+/)?.[0]}
                </span>
                <span>{trimmed.replace(/^\d+\.\s*/, "")}</span>
              </div>
            );
          }

          // Check if line is a bullet point or checklist item
          const isBullet = /^[-*•]\s+/.test(trimmed);
          if (isBullet) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2 text-slate-700">
                <span className="text-[#0D7A53] font-black text-sm leading-none pt-0.5">•</span>
                <span className="flex-1 leading-relaxed">
                  {renderTextWithLinks(trimmed.replace(/^[-*•]\s+/, ""))}
                </span>
              </div>
            );
          }

          // Standard paragraph or instruction line
          return (
            <div key={idx} className="leading-relaxed text-slate-700 whitespace-pre-wrap">
              {renderTextWithLinks(line)}
            </div>
          );
        })}
      </div>

      {onToggle && isMultiLine && (
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-[#111317] transition-colors"
        >
          <span>Collapse description</span>
          <ChevronUp className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
