"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { getStoreBySlug } from "@/lib/storesApi";
import type { StoreApi } from "@/types";
import { ProductCard } from "@/components";
import { ImageIcon, Star } from "lucide-react";
import Image from "next/image";

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
        {/* BANNER */}
        <div className="mb-6 h-64 w-full overflow-hidden rounded-2xl border border-border bg-muted/10">
          {store.banner ? (
            <div className="relative h-full w-full">
              <Image
                src={store.banner}
                alt={store.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* LOGO */}
          <div className="h-16 w-16 overflow-hidden rounded-xl border border-border bg-muted/10">
            {store.logo ? (
              <div className="relative h-full w-full">
                <Image
                  src={store.logo}
                  alt={store.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <ImageIcon className="h-5 w-5" />
              </div>
            )}
          </div>

          {/* TEXT */}
          <div>
            <h1 className="text-3xl font-bold text-primary">{store.name}</h1>

            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
              <span>{(store.rating ?? 0).toFixed(1)}</span>
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
          {t("storeProducts", { store: store.name })}
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
