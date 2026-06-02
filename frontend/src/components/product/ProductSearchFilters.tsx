"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Button from "../ui/Button";
import ProductCard from "./ProductCard";
import CategorySelect from "../navigation/CategorySelect";
import { useProducts } from "@/hooks";
import type { ProductApi } from "@/types";

export default function ProductSearchFilters() {
  const locale = useLocale();
  const t = useTranslations("productCard.searchFilters");

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const { products, loading } = useProducts({
    locale,
    limit: 20,
    search: searchQuery,
    categoryId: categoryId || undefined,
  });

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategoryId("");
  };

  return (
    <section className="border-b border-border pb-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {t("search")}
          </Button>
        </form>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="min-w-[220px]">
            <CategorySelect value={categoryId} onChange={setCategoryId} />
          </div>

          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {t("clearFilters")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading &&
          [1, 2, 3, 4].map((id) => (
            <div
              key={id}
              className="h-[340px] rounded-2xl border border-border bg-card animate-pulse"
            />
          ))}

        {!loading && products.length === 0 && (
          <div className="col-span-full rounded-2xl border border-border bg-card p-10 text-center text-muted">
            {t("notFound")}
          </div>
        )}

        {!loading &&
          products.map((product: ProductApi) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </section>
  );
}
