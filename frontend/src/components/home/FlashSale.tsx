"use client";

import { useLocale, useTranslations } from "next-intl";
import { ProductCard } from "@/components";
import { useProducts } from "@/hooks";

export default function FlashSale() {
  const t = useTranslations("home.flashSale");
  const locale = useLocale();

  const { products, loading } = useProducts({
    locale,
    limit: 5,
    onlyDiscounted: true,
  });

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary">{t("title")}</h2>
      </div>

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
