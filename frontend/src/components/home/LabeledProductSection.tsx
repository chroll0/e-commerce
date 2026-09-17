"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/productsApi";
import { ProductCard } from "@/components";
import type { ProductApi } from "@/types";

type Props = {
  labelSlug: string;
};

export default function LabeledProductSection({ labelSlug }: Props) {
  const locale = useLocale();

  const [products, setProducts] = useState<ProductApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getProducts({ locale: String(locale), label: labelSlug, limit: 10 })
      .then((data) => {
        if (cancelled) return;
        setProducts(data ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [locale, labelSlug]);

  if (loading) return null;
  if (products.length === 0) return null;

  const normalizedLocale = locale.split("-")[0];
  const matchedLabel = products
    .flatMap((p) => p.labels ?? [])
    .find((l) => l.slug === labelSlug);

  const title =
    (normalizedLocale === "ka" ? matchedLabel?.nameKa : matchedLabel?.nameEn) ??
    matchedLabel?.nameEn ??
    labelSlug;

  return (
    <section className="border-b border-border pb-8">
      <h2 className="mt-6 text-xl font-semibold text-primary">{title}</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
