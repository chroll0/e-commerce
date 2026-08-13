"use client";

import { useLocale, useTranslations } from "next-intl";

import { useProducts } from "@/hooks";
import { ProductCard, ProductCardSkeleton } from "@/components";

export default function ProductFilter() {
  const t = useTranslations("home");
  const locale = useLocale();

  const { products, loading } = useProducts({
    locale,
    limit: 5,
    onlyDiscounted: true,
  });

  const hasProducts = products.length > 0;

  if (loading && !hasProducts) {
    return null;
  }

  return (
    <section className="border-b border-border pb-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary">{t("bigSales")}</h2>
      </div>

      {/* GRID */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
        {hasProducts ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            {t("noProducts")}
          </div>
        )}
      </div>
    </section>
  );
}
