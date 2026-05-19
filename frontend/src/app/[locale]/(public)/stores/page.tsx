"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search, Filter, Loader2, Store as StoreIcon } from "lucide-react";
import { Button, StoreCard } from "@/components";
import { getStores } from "@/lib/storesApi";
import type { StoreApi } from "@/types";

type SortOption = "sales" | "rating" | "newest";

export default function AllStoresPage() {
  const t = useTranslations("stores");
  const locale = useLocale();

  const [stores, setStores] = useState<StoreApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("sales");
  const [limit, setLimit] = useState(12);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchStores();
  }, [sortBy, limit, locale]);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const data = await getStores({
        search: searchQuery || undefined,
        sort: sortBy,
        limit: limit + 1,
      });

      if (data.length > limit) {
        setHasMore(true);
        setStores(data.slice(0, limit));
      } else {
        setHasMore(false);
        setStores(data);
      }
    } catch (error) {
      console.error("Failed to fetch stores:", error);
      setStores([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLimit(12);
    fetchStores();
  };

  const handleLoadMore = () => {
    setLimit((prev) => prev + 12);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSortBy("sales");
    setLimit(12);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {t("pageTitle")}
        </h1>
        <p className="text-muted">{t("pageDescription")}</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button type="submit" disabled={loading} variant="primary">
            {t("search")}
          </Button>
        </form>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted" />
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption);
              setLimit(12);
            }}
            className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="sales">{t("sort.sales")}</option>
            <option value="rating">{t("sort.rating")}</option>
            <option value="newest">{t("sort.newest")}</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      {!loading && stores.length > 0 && (
        <p className="text-sm text-muted mb-4">
          {t("storesCount", { count: stores.length })}
        </p>
      )}

      {/* Stores Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading && limit === 12
          ? // Loading Skeletons
            Array.from({ length: 12 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="rounded-2xl border border-border bg-card animate-pulse overflow-hidden"
              >
                <div className="h-32 bg-card-soft" />
                <div className="px-5 pb-5 pt-14">
                  <div className="h-6 bg-card-soft rounded mb-2" />
                  <div className="h-4 bg-card-soft rounded w-2/3 mx-auto" />
                </div>
              </div>
            ))
          : stores.map((store) => <StoreCard key={store.id} store={store} />)}
      </div>

      {/* Empty State */}
      {!loading && stores.length === 0 && (
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

      {/* Load More Button */}
      {!loading && stores.length > 0 && hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            disabled={loading}
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

      {/* End Message */}
      {!loading && stores.length > 0 && !hasMore && (
        <p className="text-center text-sm text-muted mt-8">
          {t("allStoresLoaded")}
        </p>
      )}
    </div>
  );
}
