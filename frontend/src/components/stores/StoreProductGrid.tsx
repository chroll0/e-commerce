import type { TranslationFn } from "./StoreProductsSection";
import type { StoreApi } from "@/types";
import { ProductCard } from "@/components";

export default function StoreProductGrid({
  products,
  filterT,
  loading,
}: {
  products?: StoreApi["products"];
  filterT: TranslationFn;
  loading?: boolean;
}) {
  const hasProducts = products && products.length > 0;

  if (loading) {
    // Show skeletons while loading (for filter updates)
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 opacity-50 pointer-events-none transition-opacity">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-xl bg-card"
          >
            <div className="aspect-square w-full bg-muted" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-4/5 rounded bg-muted" />
              <div className="h-3 w-2/5 rounded bg-muted" />
              <div className="h-6 w-20 rounded bg-muted" />
              <div className="h-10 w-full rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
      {hasProducts ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="col-span-full rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
          {filterT("notFound")}
        </div>
      )}
    </div>
  );
}
