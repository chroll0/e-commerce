"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { getStoreBySlug } from "@/lib/storesApi";
import type { Locale, StoreApi } from "@/types";

import {
  Breadcrumbs,
  ProductCardSkeleton,
  StoreHeader,
  StoreHeaderSkeleton,
  StoreProductsSection,
} from "@/components";

export default function StorePage() {
  const params = useParams();
  const slug = params.slug as string;
  const locale = params.locale as string;

  const navT = useTranslations("nav");
  const t = useTranslations("productCard.storePage");
  const filterT = useTranslations("productCard.searchFilters");

  const [storeHeader, setStoreHeader] = useState<StoreApi | null>(null);
  const [products, setProducts] = useState<StoreApi["products"]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(false);
  const [error, setError] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
  });

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      try {
        setInitialLoading(true);
        setError(false);

        const data = await getStoreBySlug(slug, {
          locale: locale || undefined,
        });

        setStoreHeader(data);
        setProducts(data.products ?? []);
      } catch {
        setError(true);
      } finally {
        setInitialLoading(false);
      }
    };

    load();
  }, [slug, locale]);

  useEffect(() => {
    if (!slug) return;

    const timeout = setTimeout(async () => {
      try {
        setFiltersLoading(true);

        const data = await getStoreBySlug(slug, {
          locale: locale || undefined,
          search: filters.search || undefined,
          categoryId: filters.categoryId || undefined,
        });

        setProducts(data.products ?? []);
      } finally {
        setFiltersLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [filters, slug, locale]);

  const handleFilterChange = useCallback((nextFilters: typeof filters) => {
    setFilters(nextFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ search: "", categoryId: "" });
  }, []);

  if (initialLoading && !storeHeader) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        <Breadcrumbs
          items={[
            { label: "Satori", href: `/${locale}` },
            { label: navT("stores"), href: `/${locale}/stores` },
            { label: slug },
          ]}
        />

        <StoreHeaderSkeleton />

        <section>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ERROR
  if (error || !storeHeader) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1>{t("notFound")}</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Satori", href: `/${locale}` },
          { label: navT("stores"), href: `/${locale}/stores` },
          { label: storeHeader.name },
        ]}
      />

      <StoreHeader store={storeHeader} t={t} />

      <StoreProductsSection
        products={products}
        filterT={filterT}
        locale={locale as Locale}
        activeSearch={filters.search}
        activeCategoryId={filters.categoryId}
        loading={filtersLoading}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}
