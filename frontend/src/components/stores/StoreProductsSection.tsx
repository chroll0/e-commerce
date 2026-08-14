"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Locale, StoreApi } from "@/types";
import { Button, CategorySelect, ProductCard, SearchBar } from "@/components";

type TranslationFn = ReturnType<typeof useTranslations>;

type StoreProductsSectionProps = {
  products?: StoreApi["products"];
  filterT: TranslationFn;
  locale: Locale;
  activeSearch: string;
  activeCategoryId: string;
  onFilterChange: (filters: { search: string; categoryId: string }) => void;
  onClearFilters: () => void;
  loading?: boolean;
};

function ProductGrid({
  products,
  filterT,
  loading,
}: {
  products?: StoreApi["products"];
  filterT: TranslationFn;
  loading?: boolean;
}) {
  const hasProducts = products && products.length > 0;

  if (loading) {
    // Show skeletons while loading (for filter updates)
    // Use opacity to indicate content is being refreshed
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 opacity-50 pointer-events-none transition-opacity">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-xl bg-card"
          >
            <div className="aspect-square w-full bg-muted" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-4/5 rounded bg-muted" />
              <div className="h-3 w-2/5 rounded bg-muted" />
              <div className="h-6 w-20 rounded bg-muted" />
              <div className="h-10 w-full rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
      {hasProducts ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="col-span-full rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
          {filterT("notFound")}
        </div>
      )}
    </div>
  );
}

function StoreFilters({
  initialSearch,
  initialCategoryId,
  locale,
  filterT,
  onFilterChange,
  onClearFilters,
}: {
  initialSearch: string;
  initialCategoryId: string;
  locale: Locale;
  filterT: TranslationFn;
  onFilterChange: (filters: { search: string; categoryId: string }) => void;
  onClearFilters: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState(initialCategoryId);

  useEffect(() => {
    setSearchQuery(initialSearch);
    setCategoryId(initialCategoryId);
  }, [initialSearch, initialCategoryId]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onFilterChange({
        search: searchQuery.trim(),
        categoryId,
      });
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [searchQuery, categoryId, onFilterChange]);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-1 items-end gap-2 flex-col sm:flex-row">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            locale={locale}
          />

          <Button type="submit" className="w-full sm:w-auto whitespace-nowrap">
            {filterT("search")}
          </Button>
        </div>

        <div className="flex justify-center gap-3 items-end">
          <div className="min-w-[220px]">
            <CategorySelect value={categoryId} onChange={setCategoryId} />
          </div>

          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setCategoryId("");
              onClearFilters();
            }}
            className="sm:w-auto whitespace-nowrap"
          >
            {filterT("clearFilters")}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default function StoreProductsSection({
  products,
  filterT,
  locale,
  activeSearch,
  activeCategoryId,
  onFilterChange,
  onClearFilters,
  loading,
}: StoreProductsSectionProps) {
  return (
    <section className="border-b border-border pb-8">
      <StoreFilters
        initialSearch={activeSearch}
        initialCategoryId={activeCategoryId}
        locale={locale}
        filterT={filterT}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
      />

      <ProductGrid products={products} filterT={filterT} loading={loading} />
    </section>
  );
}
