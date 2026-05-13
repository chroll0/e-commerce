"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/productsApi";
import { ProductCard } from "@/components";
import type { ProductApi } from "@/types";

export default function FeaturedProducts() {
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
      {/* PRODUCTS */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 my-6">
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
