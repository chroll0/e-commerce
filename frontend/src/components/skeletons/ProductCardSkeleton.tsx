export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl bg-card">
      <div className="aspect-square w-full bg-muted" />

      <div className="space-y-3 p-4">
        <div className="h-4 w-4/5 rounded bg-muted" />
        <div className="h-3 w-2/5 rounded bg-muted" />
        <div className="h-6 w-20 rounded bg-muted" />
        <div className="h-10 w-full rounded bg-muted" />
      </div>
    </div>
  );
}
