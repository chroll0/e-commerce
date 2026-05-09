"use client";

import { useEffect, useState } from "react";
import { getBestStores } from "@/lib/storesApi";
import type { StoreApi } from "@/types";
import { useRouter } from "next/navigation";

export default function BestStores() {
  const [stores, setStores] = useState<StoreApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await getBestStores(4);
        setStores(data);
      } catch (err) {
        console.error("Failed to fetch stores:", err);
        setError("Failed to load stores");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

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
              className="bg-card shadow-[0_2px_12px_var(--color-shadow)] p-4 rounded-xl border border-border animate-pulse"
            >
              <div className="w-full h-20 bg-card-soft rounded-lg"></div>
              <div className="mt-2 h-4 bg-card-soft rounded"></div>
              <div className="mt-1 h-3 bg-card-soft rounded w-2/3"></div>
              <div className="mt-3 h-8 bg-card-soft rounded-lg"></div>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((store) => (
            <div
              key={store}
              className="group bg-card shadow-[0_2px_12px_var(--color-shadow)] p-4 rounded-xl border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_var(--color-shadow)] cursor-pointer"
            >
              {/* LOGO */}
              <div className="w-full h-20 bg-card-soft rounded-lg border border-border flex items-center justify-center overflow-hidden">
                <span className="text-xs text-muted">Store Logo</span>
              </div>

              {/* INFO */}
              <p className="mt-2 font-medium text-primary">Store #{store}</p>

              <div className="flex items-center gap-1 text-xs text-muted">
                ⭐ 4.8 <span>•</span> <span>120 sales</span>
              </div>

              {/* CTA */}
              <button className="mt-3 w-full text-xs font-medium py-2 rounded-lg bg-card-soft border border-border hover:bg-border transition">
                View Store
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-primary">
        Best Selling Stores
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stores.map((store) => (
          <div
            key={store.id}
            onClick={() => handleStoreClick(store.slug)}
            className="group bg-card shadow-[0_2px_12px_var(--color-shadow)] p-4 rounded-xl border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_var(--color-shadow)] cursor-pointer"
          >
            {/* LOGO */}
            <div className="w-full h-20 bg-card-soft rounded-lg border border-border flex items-center justify-center overflow-hidden">
              {store.logo ? (
                <img
                  src={store.logo}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-muted">{store.name}</span>
              )}
            </div>

            {/* INFO */}
            <p className="mt-2 font-medium text-primary">{store.name}</p>

            <div className="flex items-center gap-1 text-xs text-muted">
              ⭐ {store.rating?.toFixed(1) || "N/A"} <span>•</span>{" "}
              <span>{store.sales} sales</span>
            </div>

            {/* CTA */}
            <button className="mt-3 w-full text-xs font-medium py-2 rounded-lg bg-card-soft border border-border hover:bg-border transition">
              View Store
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
