"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ProductCard } from "@/components";
import { getProducts } from "@/lib/productsApi";
import type { ProductApi } from "@/types";

export default function FlashSale() {
  const t = useTranslations("home.flashSale");
  const locale = useLocale();
  const [products, setProducts] = useState<ProductApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    getProducts({ locale: String(locale), limit: 5 })
      .then((data) => {
        if (cancelled) return;
        setProducts((data ?? []).slice(0, 5));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <section>
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary">{t("title")}</h2>
      </div>

      {/* PRODUCT LIST */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {loading &&
          [1, 2, 3, 4, 5].map((id) => <ProductCard key={id} productId={id} />)}

        {!loading &&
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </section>
  );
}
