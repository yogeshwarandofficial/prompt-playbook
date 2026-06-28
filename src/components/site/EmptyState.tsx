import { BookOpen } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  cta?: ReactNode;
}

export function EmptyState({
  title = "Nothing here yet",
  message = "Check back soon.",
  cta,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground">
        <BookOpen className="h-7 w-7" />
      </div>
      <h2 className="mt-4 font-display text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      {cta && <div className="mt-5">{cta}</div>}
    </div>
  );
}
