export default function StoreHeaderSkeleton() {
  return (
    <div className="mb-10">
      {/* COVER */}
      <div className="mb-6 h-64 w-full rounded-2xl bg-muted animate-pulse" />

      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* LOGO */}
        <div className="h-16 w-16 rounded-xl bg-muted animate-pulse" />

        {/* INFO */}
        <div className="flex-1 space-y-4">
          {/* TITLE */}
          <div className="h-8 w-52 rounded-xl bg-muted animate-pulse" />

          {/* TAGS */}
          <div className="flex flex-wrap gap-3">
            <div className="h-4 w-24 rounded-full bg-muted animate-pulse" />
            <div className="h-4 w-28 rounded-full bg-muted animate-pulse" />
            <div className="h-4 w-20 rounded-full bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
