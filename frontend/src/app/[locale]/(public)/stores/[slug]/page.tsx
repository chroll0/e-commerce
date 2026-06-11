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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
  });

  // FETCH STORE HEADER ONLY ONCE
  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(false);

        const data = await getStoreBySlug(slug, {
          locale: locale || undefined,
        });

        setStoreHeader(data);
        setProducts(data.products ?? []);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug, locale]);

  // FETCH PRODUCTS ONLY WHEN FILTERS CHANGE
  useEffect(() => {
    if (!slug) return;

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const data = await getStoreBySlug(slug, {
          locale: locale || undefined,
          search: filters.search || undefined,
          categoryId: filters.categoryId || undefined,
        });

        setProducts(data.products ?? []);
      } finally {
        setLoading(false);
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

  if (loading && !storeHeader) {
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

        <section className="border-b border-border pb-8">
          <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex-1 min-w-0">
              <ProductCardSkeleton className="h-14 w-full rounded-2xl" />
            </div>
            <div className="grid flex-1 min-w-[220px] grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              <ProductCardSkeleton className="h-12 w-full rounded-2xl" />
              <ProductCardSkeleton className="h-12 w-full rounded-2xl" />
              <ProductCardSkeleton className="h-12 w-full rounded-2xl" />
              <ProductCardSkeleton className="h-12 w-full rounded-2xl" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <ProductCardSkeleton
                key={index}
                className="h-60 w-full rounded-3xl"
              />
            ))}
          </div>
        </section>
      </div>
    );
  }

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
        loading={loading}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}
