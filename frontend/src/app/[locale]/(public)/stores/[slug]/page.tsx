"use client";

import { useCallback, useEffect, useState, memo } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { getStoreBySlug } from "@/lib/storesApi";
import type { Locale, StoreApi } from "@/types";
import { Button, CategorySelect, ProductCard, SearchBar } from "@/components";
import { ImageIcon, Star, X } from "lucide-react";
import Image from "next/image";

const StoreHeader = memo(function StoreHeader({
  store,
  t,
}: {
  store: StoreApi;
  t: any;
}) {
  return (
    <div className="mb-10">
      {/* BANNER */}
      <div className="mb-6 h-64 w-full overflow-hidden rounded-2xl border border-border bg-muted/10">
        {store.banner ? (
          <div className="relative h-full w-full">
            <Image
              src={store.banner}
              alt={store.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* LOGO */}
        <div className="h-16 w-16 overflow-hidden rounded-xl border border-border bg-muted/10">
          {store.logo ? (
            <div className="relative h-full w-full">
              <Image
                src={store.logo}
                alt={store.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageIcon className="h-5 w-5" />
            </div>
          )}
        </div>

        {/* TEXT */}
        <div>
          <h1 className="text-3xl font-bold text-primary">{store.name}</h1>

          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
            <span>{(store.rating ?? 0).toFixed(1)}</span>
            <span>•</span>

            <span>
              {store.sales ?? 0} {t("sales")}
            </span>
            <span>•</span>
            <span>
              {store._count?.products ?? 0} {t("products")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

const ProductGrid = memo(function ProductGrid({
  products,
  filterT,
}: {
  products?: StoreApi["products"];
  filterT: any;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
      {!products?.length ? (
        <div className="col-span-full rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
          {filterT("notFound")}
        </div>
      ) : (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  );
});

const StoreFilters = memo(function StoreFilters({
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
  filterT: any;
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

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleClear = () => {
    setSearchQuery("");
    setCategoryId("");
    onClearFilters();
  };

  return (
    <form onSubmit={handleSearchSubmit} className="w-full">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-1 items-end gap-2 flex-col sm:flex-row">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            locale={locale}
          />

          <Button
            type="submit"
            disabled={false}
            className="w-full sm:w-auto whitespace-nowrap"
          >
            {filterT("search")}
          </Button>
        </div>

        <div className="flex justify-center gap-3 items-end">
          <div className="min-w-[220px]">
            <CategorySelect value={categoryId} onChange={setCategoryId} />
          </div>

          <Button
            variant="outline"
            onClick={handleClear}
            className="sm:w-auto whitespace-nowrap"
          >
            {filterT("clearFilters")}
          </Button>
        </div>
      </div>
    </form>
  );
});

type StoreProductsSectionProps = {
  products?: StoreApi["products"];
  filterT: any;
  t: any;
  locale: Locale;
  activeSearch: string;
  activeCategoryId: string;
  onFilterChange: (filters: { search: string; categoryId: string }) => void;
  onClearFilters: () => void;
};

const StoreProductsSection = memo(function StoreProductsSection({
  products,
  filterT,
  t,
  locale,
  activeSearch,
  activeCategoryId,
  onFilterChange,
  onClearFilters,
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

      <ProductGrid products={products} filterT={filterT} />
    </section>
  );
});

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
        t={t}
        locale={locale as Locale}
        activeSearch={filters.search}
        activeCategoryId={filters.categoryId}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}
