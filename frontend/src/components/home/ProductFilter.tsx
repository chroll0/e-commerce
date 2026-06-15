"use client";

import { useLocale, useTranslations } from "next-intl";
import { ProductCard } from "@/components";
import { useProducts } from "@/hooks";

export default function ProductFilter() {
  const t = useTranslations("home");
  const locale = useLocale();

  const { products, loading } = useProducts({
    locale,
    limit: 5,
    onlyDiscounted: true,
  });

  return (
    <section className="border-b border-border pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary">{t("bigSales")}</h2>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
        {!loading &&
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </section>
  );
}
