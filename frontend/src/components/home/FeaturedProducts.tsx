"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/productsApi";
import { ProductCard } from "@/components";
import type { ProductApi } from "@/types";

export default function FeaturedProducts() {
  const locale = useLocale();
  const [products, setProducts] = useState<ProductApi[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("home");

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

  return (
    <section className="border-b border-border pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary mt-6">
          {t("allProducts")}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
        {!loading &&
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </section>
  );
}
