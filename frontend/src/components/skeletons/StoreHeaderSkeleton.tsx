import ProductCardSkeleton from "./ProductCardSkeleton";

export default function StoreHeaderSkeleton() {
  return (
    <div className="mb-10">
      <div className="mb-6 h-64 w-full overflow-hidden rounded-2xl border border-border bg-card p-4">
        <ProductCardSkeleton className="h-full w-full rounded-2xl" />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="h-16 w-16 overflow-hidden rounded-xl border border-border bg-card">
          <ProductCardSkeleton className="h-full w-full rounded-xl" />
        </div>

        <div className="space-y-4 flex-1">
          <ProductCardSkeleton className="h-8 w-52 rounded-xl" />

          <div className="flex flex-wrap gap-3">
            <ProductCardSkeleton className="h-4 w-24 rounded-full" />
            <ProductCardSkeleton className="h-4 w-28 rounded-full" />
            <ProductCardSkeleton className="h-4 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
