"use client";

import { useStoreData, useStores } from "@/hooks";
import { useRouter } from "next/navigation";

export default function BestStores() {
  const router = useRouter();
  const { stores, loading, error } = useStores(4);

  const handleStoreClick = (slug: string) => {
    router.push(`/stores/${slug}`);
  };

  if (loading) {
    return (
      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Best Selling Stores
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-card p-4 rounded-xl border border-border animate-pulse"
            >
              <div className="w-full h-20 bg-card-soft rounded-lg" />
              <div className="mt-2 h-4 bg-card-soft rounded" />
              <div className="mt-1 h-3 bg-card-soft rounded w-2/3" />
              <div className="mt-3 h-8 bg-card-soft rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || stores.length === 0) {
    return (
      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Best Selling Stores
        </h2>

        <p className="text-sm text-muted">No stores available</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-primary">
        Best Selling Stores
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stores.map((store) => {
          const data = useStoreData(store);
          if (!data) return null;

          return (
            <div
              key={data.id}
              onClick={() => handleStoreClick(data.slug)}
              className="group bg-card shadow-[0_2px_12px_var(--color-shadow)] p-4 rounded-xl border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_var(--color-shadow)] cursor-pointer"
            >
              {/* LOGO */}
              <div className="w-full h-20 bg-card-soft rounded-lg border border-border flex items-center justify-center overflow-hidden">
                {data.logo ? (
                  <img
                    src={data.logo}
                    alt={data.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-muted">{data.name}</span>
                )}
              </div>

              {/* INFO */}
              <p className="mt-2 font-medium text-primary">{data.name}</p>

              <div className="flex items-center gap-1 text-xs text-muted">
                ⭐ {data.rating.toFixed(1)} <span>•</span>{" "}
                <span>{data.sales} sales</span>
              </div>

              {/* CTA */}
              <button className="mt-3 w-full text-xs font-medium py-2 rounded-lg bg-card-soft border border-border hover:bg-border transition">
                View Store
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
