"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/productsApi";
import { ProductCard, ProductCardSkeleton } from "@/components";
import type { ProductApi } from "@/types";

export default function FeaturedProducts() {
  const locale = useLocale();
  const t = useTranslations("home");

  const [products, setProducts] = useState<ProductApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getProducts({
      locale: String(locale),
      limit: 10,
    })
      .then((data) => {
        if (cancelled) return;
        setProducts(data ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  if (loading && products.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-border pb-8">
      <div className="flex items-center justify-between">
        <h2 className="mt-6 text-xl font-semibold text-primary">
          {t("allProducts")}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            {t("noProducts")}
          </div>
        )}
      </div>
    </section>
  );
}
