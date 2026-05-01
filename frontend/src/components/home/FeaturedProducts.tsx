"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getProducts } from "@/lib/productsApi";
import type { ProductApi } from "@/types";
import { Button, ProductCard } from "@/components";

export default function FeaturedProducts() {
  const t = useTranslations("home.featuredProducts");
  const locale = useLocale();
  const [products, setProducts] = useState<ProductApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getProducts({
      locale: String(locale),
      limit: 5,
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
    <section>
      {/* TAB BUTTONS */}
      <div className="flex gap-4 border-b border-border pb-3">
        <Button variant="outline" size="sm">
          {t("tabs.bestSeller")}
        </Button>
        <Button variant="outline" size="sm">
          {t("tabs.keepStylish")}
        </Button>
        <Button variant="outline" size="sm">
          {t("tabs.specialDiscount")}
        </Button>
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-5">
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
