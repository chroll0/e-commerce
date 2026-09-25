"use client";

import type { Locale } from "@/types";
import { useEffect, useState } from "react";
import type { TranslationFn } from "./StoreProductsSection";
import { Button, CategorySelect, SearchBar } from "@/components";

export default function StoreFilters({
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
          <div className="min-w-60">
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
