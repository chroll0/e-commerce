const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-muted/40 ${className}`} />
);

export default function ProductCardSkeleton() {
  return (
    <div className="rounded-xl bg-card overflow-hidden">
      <Skeleton className="aspect-square w-full rounded-none" />

      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-2/5" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
