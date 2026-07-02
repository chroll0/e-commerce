export default function ProductDetailsPageSkeleton() {
  return (
    <section className="grid gap-8 lg:grid-cols-2 animate-pulse">
      {/* IMAGE SIDE */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_2px_12px_var(--color-shadow)]">
        <div className="relative aspect-square bg-card-soft">
          {/* image placeholder */}
          <div className="flex h-full items-center justify-center">
            <div className="h-full w-full bg-muted" />
          </div>
        </div>
      </div>

      {/* CONTENT SIDE */}
      <div className="flex flex-col">
        {/* TITLE */}
        <div className="h-8 w-3/4 rounded-lg bg-muted md:h-10" />

        {/* DESCRIPTION */}
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-11/12 rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
        </div>

        {/* PRICE */}
        <div className="mt-6 flex items-end gap-3">
          <div className="h-10 w-32 rounded bg-muted" />
          <div className="h-4 w-20 rounded bg-muted" />
        </div>

        {/* STATUS */}
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="h-8 w-28 rounded-lg bg-muted" />
          <div className="h-8 w-24 rounded-lg bg-muted" />
          <div className="h-8 w-32 rounded-lg bg-muted" />
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="h-12 w-full rounded-lg bg-muted sm:w-44" />
          <div className="h-12 w-full rounded-lg bg-muted sm:w-36" />
        </div>
      </div>
    </section>
  );
}
