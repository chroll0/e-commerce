"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Filter, Loader2, Store as StoreIcon } from "lucide-react";

import {
  Breadcrumbs,
  Button,
  SearchBar,
  StoreCard,
  StoreCardSkeleton,
} from "@/components";

import { getStores, type GetStoresParams } from "@/lib/storesApi";
import type { Locale, StoreApi } from "@/types";

const PAGE_SIZE = 8;

type SortOption = GetStoresParams["sort"];

function StoresGrid({
  stores,
  loading,
}: {
  stores: StoreApi[];
  loading: boolean;
}) {
  const hasStores = stores.length > 0;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {loading
        ? Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <StoreCardSkeleton key={index} />
          ))
        : hasStores
          ? stores.map((store) => <StoreCard key={store.id} store={store} />)
          : null}
    </div>
  );
}

export default function AllStoresPage() {
  const t = useTranslations("stores");
  const navT = useTranslations("nav");
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

        const pageData = data.slice(0, limit);

        setStores(pageData);
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

  const handleLoadMore = () => setLimit((prev) => prev + PAGE_SIZE);

  const handleClearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSortBy("sales");
    setLimit(PAGE_SIZE);
  };

  const isEmpty = !loading && stores.length === 0;

  const isInitialLoading = loading && limit === PAGE_SIZE;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10">
      <Breadcrumbs
        items={[
          { label: "eShop", href: `/${locale}` },
          { label: navT("stores"), href: `/${locale}/stores` },
        ]}
      />

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-primary">
          {t("pageTitle")}
        </h1>
        <p className="text-muted">{t("pageDescription")}</p>
      </div>

      {/* FILTERS */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <SearchBar
          value={search}
          onChange={setSearch}
          locale={locale}
          placeholder={t("searchPlaceholder")}
        />

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted" />

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortOption);
                setLimit(PAGE_SIZE);
              }}
              className="max-w-[150px] appearance-none truncate rounded-lg border border-border bg-background py-2.5 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="sales">{t("sort.sales")}</option>
              <option value="rating">{t("sort.rating")}</option>
              <option value="newest">{t("sort.newest")}</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <Button variant="outline" onClick={handleClearFilters}>
          {t("clearFilters")}
        </Button>
      </div>

      {/* COUNT */}
      {!loading && stores.length > 0 && (
        <p className="mb-4 text-sm text-muted">
          {t("storesCount", { count: stores.length })}
        </p>
      )}

      {/* GRID */}
      <StoresGrid stores={stores} loading={isInitialLoading} />

      {/* EMPTY STATE */}
      {isEmpty && (
        <div className="py-16 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-card-soft">
            <StoreIcon className="h-8 w-8 text-muted" />
          </div>

          <h3 className="mb-2 text-lg font-semibold text-primary">
            {t("noStoresTitle")}
          </h3>

          <p className="mb-6 text-muted">{t("noStoresDescription")}</p>

          <Button variant="outline" onClick={handleClearFilters}>
            {t("clearFilters")}
          </Button>
        </div>
      )}

      {/* LOAD MORE */}
      {!loading && stores.length > 0 && hasMore && (
        <div className="mt-8 flex justify-center">
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

      {/* END */}
      {!loading && stores.length > 0 && !hasMore && (
        <p className="mt-8 text-center text-sm text-muted">
          {t("allStoresLoaded")}
        </p>
      )}
    </div>
  );
}
