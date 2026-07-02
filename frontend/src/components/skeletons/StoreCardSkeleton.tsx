export default function StoreCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="h-28 animate-pulse rounded-xl bg-muted" />

      <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-muted" />

      <div className="mt-3 flex justify-between">
        <div className="h-4 w-12 animate-pulse rounded bg-muted" />
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
      </div>

      <div className="mt-5 h-9 w-full animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
