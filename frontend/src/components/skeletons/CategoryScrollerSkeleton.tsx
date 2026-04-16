export default function CategoryScrollerSkeleton() {
  return (
    <div className="flex gap-8 overflow-x-auto no-scrollbar p-3 bg-card-soft rounded-xl border border-border">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center min-w-20 animate-pulse"
        >
          <div className="w-14 h-14 rounded-full bg-muted border border-border" />
          <div className="w-10 h-3 mt-2 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}
