"use client";

import { useLocale, useTranslations } from "next-intl";
import { Button, ProductCard } from "@/components";
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
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary">
          {t("productFilter.title")}
        </h2>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
        {loading &&
          [1, 2, 3, 4, 5].map((id) => <ProductCard key={id} productId={id} />)}

        {!loading &&
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>

      {/* TAB BUTTONS */}
      <div className="flex gap-4 border-b border-border py-6">
        <Button variant="outline" size="sm">
          {t("featuredProducts.tabs.bestSeller")}
        </Button>
        <Button variant="outline" size="sm">
          {t("featuredProducts.tabs.keepStylish")}
        </Button>
        <Button variant="outline" size="sm">
          {t("featuredProducts.tabs.specialDiscount")}
        </Button>
      </div>
    </section>
  );
}
