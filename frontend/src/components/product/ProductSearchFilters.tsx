"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks";
import type {
  CategoryOption,
  ProductApi,
  ProductLabelApi,
  Locale,
} from "@/types";
import { getLabels } from "@/lib/labelsApi";

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
  syncCategoryWithRoute?: boolean;
};

export default function ProductSearchFilters({
  initialCategoryId,
  keepCategoryOnClear = false,
  initialSearch = "",
  syncCategoryWithRoute = false,
}: ProductSearchFiltersProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("productCard.searchFilters");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState(initialCategoryId ?? "");

  const [labelOptions, setLabelOptions] = useState<ProductLabelApi[]>([]);
  const [labelSlug, setLabelSlug] = useState(searchParams.get("label") ?? "");

  useEffect(() => {
    getLabels()
      .then(setLabelOptions)
      .catch(() => setLabelOptions([]));
  }, []);

  useEffect(() => {
    setLabelSlug(searchParams.get("label") ?? "");
  }, [searchParams]);

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
    label: labelSlug || undefined,
  });

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategoryId(keepCategoryOnClear ? (initialCategoryId ?? "") : "");
    handleLabelChange("");
  };

  const handleCategoryIdChange = (nextCategoryId: string) => {
    if (syncCategoryWithRoute && nextCategoryId) return;
    setCategoryId(nextCategoryId);
  };

  const handleCategorySelect = (category: CategoryOption | null) => {
    if (!syncCategoryWithRoute || !category?.slug) return;

    const params = new URLSearchParams(searchParams.toString());
    const query = params.toString();
    router.push(
      `/${locale}/category/${category.slug}${query ? `?${query}` : ""}`,
    );
  };

  const handleLabelChange = (nextSlug: string) => {
    setLabelSlug(nextSlug);

    const params = new URLSearchParams(searchParams.toString());
    if (nextSlug) {
      params.set("label", nextSlug);
    } else {
      params.delete("label");
    }

    const query = params.toString();
    router.push(`?${query}`, { scroll: false });
  };

  return (
    <section className="border-b border-border pb-8">
      {/* Filters Header */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
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
          <div className="min-w-60">
            <CategorySelect
              value={categoryId}
              onChange={handleCategoryIdChange}
              onSelectCategory={handleCategorySelect}
            />
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

      {/* Label pills */}
      {/* {labelOptions.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {labelOptions.map((label) => {
            const active = labelSlug === label.slug;
            const name = locale === "ka" ? label.nameKa : label.nameEn;
            return (
              <Button
                key={label.id}
                type="button"
                size="xs"
                variant={active ? "primary" : "secondary"}
                onClick={() => handleLabelChange(active ? "" : label.slug)}
              >
                {name}
              </Button>
            );
          })}
        </div>
      )} */}

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
