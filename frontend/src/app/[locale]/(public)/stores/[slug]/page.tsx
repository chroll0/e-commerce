"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { getStoreBySlug } from "@/lib/storesApi";
import type { StoreApi } from "@/types";

import { ProductCard } from "@/components";

export default function StorePage() {
  const params = useParams();
  const slug = params.slug as string;

  const t = useTranslations("productCard.storePage");

  const [store, setStore] = useState<StoreApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchStore = async () => {
      try {
        setLoading(true);

        const data = await getStoreBySlug(slug);

        setStore(data);
      } catch (err) {
        console.error("Failed to fetch store:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-64 bg-card-soft rounded-xl mb-8" />

          <div className="h-8 bg-card-soft rounded w-1/3 mb-4" />

          <div className="h-4 bg-card-soft rounded w-1/4 mb-8" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-card-soft rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-primary mb-3">
          {t("notFound")}
        </h1>

        <p className="text-muted">{t("notFoundDescription")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* STORE HEADER */}
      <div className="mb-10">
        {store.banner && (
          <div className="w-full h-64 rounded-2xl overflow-hidden mb-6 border border-border">
            <img
              src={store.banner}
              alt={store.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {store.logo && (
            <img
              src={store.logo}
              alt={store.name}
              className="w-16 h-16 rounded-xl border border-border object-cover"
            />
          )}

          <div>
            <h1 className="text-3xl font-bold text-primary">{store.name}</h1>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
              <span>⭐ {(store.rating ?? 0).toFixed(1)}</span>

              <span>•</span>

              <span>
                {store.sales ?? 0} {t("sales")}
              </span>

              <span>•</span>

              <span>
                {store._count?.products ?? 0} {t("products")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <section>
        <h2 className="text-xl font-semibold mb-6 text-primary">
          {t("storeProducts", {
            store: store.name,
          })}
        </h2>

        {!store.products?.length ? (
          <div className="py-12 text-center">
            <p className="text-muted">{t("empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {store.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
