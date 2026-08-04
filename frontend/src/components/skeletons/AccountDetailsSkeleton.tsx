const AccountDetailsSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-5xl py-10 animate-pulse">
      {/* AccountHeader */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-7 w-40 rounded-lg bg-muted" />
          <div className="h-4 w-64 rounded-lg bg-muted" />
        </div>
        <div className="h-9 w-24 rounded-lg bg-muted" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* AccountProfileCard */}
        <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
            <div className="h-4 w-32 rounded-lg bg-muted" />
          </div>

          {/* Info rows */}
          <div className="mt-4 flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between gap-4">
                <div className="h-3 w-16 rounded bg-muted" />
                <div className="h-3 w-28 rounded bg-muted" />
              </div>
            ))}
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 rounded-xl bg-muted" />
            <div className="h-16 rounded-xl bg-muted" />
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mt-2">
            <div className="h-9 w-full rounded-lg bg-muted" />
            <div className="h-9 w-full rounded-lg bg-muted" />
          </div>
        </div>

        {/* AdminActions / AccountQuickActions */}
        <div className="md:col-span-2 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
          <div className="h-5 w-32 rounded-lg bg-muted" />
          <div className="grid grid-cols-2 gap-3 mt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </div>

      {/* Advertisement */}
      <div className="mt-8 h-24 w-full rounded-2xl bg-muted" />
    </div>
  );
};

export default AccountDetailsSkeleton;
