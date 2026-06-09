"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { getStoreBySlug } from "@/lib/storesApi";
import type { Locale, StoreApi } from "@/types";
import { StoreHeader, StoreProductsSection } from "@/components";

export default function StorePage() {
  const params = useParams();
  const slug = params.slug as string;
  const locale = params.locale as string;

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
    return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>;
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
      <StoreHeader store={storeHeader} t={t} />

      <StoreProductsSection
        products={products}
        filterT={filterT}
        locale={locale as Locale}
        activeSearch={filters.search}
        activeCategoryId={filters.categoryId}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}
