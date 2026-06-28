import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 overflow-hidden",
        className
      )}
    >
      {/* Thumbnail */}
      <div className="skeleton-shimmer mb-4 aspect-[16/9] rounded-lg" />
      {/* Badge */}
      <div className="skeleton-shimmer h-5 w-20 rounded-full" />
      {/* Title */}
      <div className="skeleton-shimmer mt-3 h-4 w-full rounded" />
      <div className="skeleton-shimmer mt-2 h-4 w-3/4 rounded" />
      {/* Description */}
      <div className="skeleton-shimmer mt-3 h-3 w-full rounded" />
      <div className="skeleton-shimmer mt-1.5 h-3 w-5/6 rounded" />
      <div className="skeleton-shimmer mt-1.5 h-3 w-4/5 rounded" />
      {/* Tags row */}
      <div className="mt-4 flex gap-2">
        <div className="skeleton-shimmer h-5 w-14 rounded" />
        <div className="skeleton-shimmer h-5 w-16 rounded" />
        <div className="skeleton-shimmer h-5 w-12 rounded" />
      </div>
      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="skeleton-shimmer h-4 w-16 rounded" />
        <div className="skeleton-shimmer h-4 w-20 rounded" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
