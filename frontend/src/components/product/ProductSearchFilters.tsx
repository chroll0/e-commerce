"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { useProducts } from "@/hooks";
import type { ProductApi, Locale } from "@/types";

import {
  Button,
  CategorySelect,
  ProductCard,
  ProductCardSkeleton,
  SearchBar,
} from "@/components";

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
      <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="w-full">
          <div className="flex flex-1 flex-col items-end gap-2 sm:flex-row">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              locale={locale}
            />

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              size="sm"
              className="w-full whitespace-nowrap sm:w-auto"
            >
              {t("search")}
            </Button>
          </div>
        </form>

        {/* Filters */}
        <div className="flex items-end justify-center gap-3">
          <div className="min-w-[220px]">
            <CategorySelect value={categoryId} onChange={setCategoryId} />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            disabled={loading}
            className="whitespace-nowrap sm:w-auto"
          >
            {t("clearFilters")}
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))
        ) : products.length > 0 ? (
          products.map((product: ProductApi) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            {t("notFound")}
          </div>
        )}
      </div>
    </section>
  );
}
