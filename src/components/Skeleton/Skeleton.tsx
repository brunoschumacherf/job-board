export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-24 animate-pulse rounded-2xl border border-border bg-surface-secondary"
        />
      ))}
    </div>
  );
}

export function BoardSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-[420px] w-72 shrink-0 animate-pulse rounded-2xl border border-border bg-surface-secondary"
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
      <div className="h-4 w-3/4 animate-pulse rounded bg-muted-bg" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-muted-bg" />
      <div className="h-10 w-full animate-pulse rounded bg-muted-bg" />
    </div>
  );
}
