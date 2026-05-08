"use client";

import { useLocale, useTranslations } from "next-intl";
import { getProducts } from "@/lib/productsApi";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components";
import type { ProductApi } from "@/types";

export default function FlashSale() {
  const t = useTranslations("home.flashSale");
  const locale = useLocale();
  const [products, setProducts] = useState<ProductApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const data = await getProducts({
          locale: String(locale),
          limit: 100,
        });

        if (cancelled) return;

        const flashSaleProducts = (data ?? [])
          .filter((p) => p.discount && p.discount > 0)
          .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0))
          .slice(0, 5);

        setProducts(flashSaleProducts);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducts();

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

      {/* PRODUCTS */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
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
