"use client";

import { useEffect, useState } from "react";
import { useProducts } from "@/hooks";
import type { ProductApi, Locale } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import { Button, CategorySelect, ProductCard, SearchBar } from "@/components";

type ProductSearchFiltersProps = {
  initialCategoryId?: string;
  keepCategoryOnClear?: boolean;
  initialSearch?: string;
};

export default function ProductSearchFilters({
  initialCategoryId,
  keepCategoryOnClear = false,
  initialSearch = "",
}: ProductSearchFiltersProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("productCard.searchFilters");

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState(initialCategoryId ?? "");

  useEffect(() => {
    if (initialCategoryId !== undefined) {
      setCategoryId(initialCategoryId);
    }
  }, [initialCategoryId]);

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
    setCategoryId(keepCategoryOnClear ? (initialCategoryId ?? "") : "");
  };

  return (
    <section className="border-b border-border pb-8">
      {/* Filters Header */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="w-full">
          <div className="flex flex-1 items-end gap-2 flex-col sm:flex-row">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              locale={locale}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto whitespace-nowrap"
            >
              {t("search")}
            </Button>
          </div>
        </form>

        {/* Filters */}
        <div className="flex justify-center gap-3 items-end">
          <div className="min-w-[220px]">
            <CategorySelect value={categoryId} onChange={setCategoryId} />
          </div>

          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={loading}
            className="sm:w-auto whitespace-nowrap"
          >
            {t("clearFilters")}
          </Button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {loading &&
          Array.from({ length: 4 }).map((_, id) => (
            <div
              key={id}
              className="h-[340px] rounded-2xl border border-border bg-card/60 animate-pulse"
            />
          ))}

        {!loading && products.length === 0 && (
          <div className="col-span-full rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
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
