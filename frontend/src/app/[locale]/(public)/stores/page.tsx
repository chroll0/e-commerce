"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Filter, Loader2, Store as StoreIcon } from "lucide-react";
import { Button, SearchBar, StoreCard } from "@/components";
import { getStores, type GetStoresParams } from "@/lib/storesApi";
import type { Locale, StoreApi } from "@/types";

const PAGE_SIZE = 12;

type SortOption = GetStoresParams["sort"];

type StoresGridProps = {
  stores: StoreApi[];
  loading: boolean;
};

function StoresGrid({ stores, loading }: StoresGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: PAGE_SIZE }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border bg-card animate-pulse overflow-hidden"
          >
            <div className="h-32 bg-card-soft" />
            <div className="px-5 pb-5 pt-14">
              <div className="h-6 bg-card-soft rounded mb-2" />
              <div className="h-4 bg-card-soft rounded w-2/3 mx-auto" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stores.map((store) => (
        <StoreCard key={store.id} store={store} />
      ))}
    </div>
  );
}

export default function AllStoresPage() {
  const t = useTranslations("stores");
  const locale = useLocale() as Locale;

  const [stores, setStores] = useState<StoreApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("sales");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [hasMore, setHasMore] = useState(true);

  const query = useMemo<GetStoresParams>(
    () => ({
      search: debouncedSearch || undefined,
      sort: sortBy,
      limit: limit + 1,
    }),
    [debouncedSearch, sortBy, limit],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setLimit(PAGE_SIZE);
      setDebouncedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);

      try {
        const data = await getStores(query);
        const nextPage = data.slice(0, limit);

        setStores(nextPage);
        setHasMore(data.length > limit);
      } catch (error) {
        console.error(error);
        setStores([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [query, locale, limit]);

  const handleLoadMore = () => setLimit((current) => current + PAGE_SIZE);

  const handleClearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSortBy("sales");
    setLimit(PAGE_SIZE);
  };

  const isEmpty = !loading && stores.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {t("pageTitle")}
        </h1>
        <p className="text-muted">{t("pageDescription")}</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <SearchBar value={search} onChange={setSearch} locale={locale} />

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted" />
          <select
            value={sortBy}
            onChange={(event) => {
              setSortBy(event.target.value as SortOption);
              setLimit(PAGE_SIZE);
            }}
            className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="sales">{t("sort.sales")}</option>
            <option value="rating">{t("sort.rating")}</option>
            <option value="newest">{t("sort.newest")}</option>
          </select>
        </div>

        <Button variant="outline" onClick={handleClearFilters}>
          {t("clearFilters")}
        </Button>
      </div>

      {!loading && stores.length > 0 && (
        <p className="text-sm text-muted mb-4">
          {t("storesCount", { count: stores.length })}
        </p>
      )}

      <StoresGrid stores={stores} loading={loading && limit === PAGE_SIZE} />

      {isEmpty && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-card-soft mb-4">
            <StoreIcon className="w-8 h-8 text-muted" />
          </div>

          <h3 className="text-lg font-semibold text-primary mb-2">
            {t("noStoresTitle")}
          </h3>
          <p className="text-muted mb-6">{t("noStoresDescription")}</p>

          <Button variant="outline" onClick={handleClearFilters}>
            {t("clearFilters")}
          </Button>
        </div>
      )}

      {!loading && stores.length > 0 && hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            className="min-w-[200px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("loading")}
              </>
            ) : (
              t("loadMore")
            )}
          </Button>
        </div>
      )}

      {!loading && stores.length > 0 && !hasMore && (
        <p className="text-center text-sm text-muted mt-8">
          {t("allStoresLoaded")}
        </p>
      )}
    </div>
  );
}
