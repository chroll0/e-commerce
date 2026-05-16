"use client";

import Link from "next/link";
import type { StoreApi } from "@/types";
import { useTranslations } from "next-intl";
import { Store, Star, TrendingUp, Package } from "lucide-react";

type Props = {
  store: StoreApi;
};

export default function StoreCard({ store }: Props) {
  const t = useTranslations("stores");

  return (
    <Link href={`/stores/${store.slug}`}>
      <div className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Banner */}
        <div className="relative h-32 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
          {store.banner ? (
            <img
              src={store.banner}
              alt={store.name}
              className="w-full h-full object-cover opacity-60 transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
          )}
        </div>

        {/* Logo */}
        <div className="absolute left-1/2 top-20 -translate-x-1/2">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-background bg-card shadow-lg">
            {store.logo ? (
              <img
                src={store.logo}
                alt={store.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-card-soft">
                <Store className="h-8 w-8 text-muted" />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pb-5 pt-14 text-center">
          <h3 className="text-lg font-semibold text-primary truncate mb-2">
            {store.name}
          </h3>

          {/* Stats */}
          <div className="flex items-center justify-center gap-4 text-sm">
            {/* Rating */}
            {store.rating && store.rating > 0 && (
              <div className="flex items-center gap-1 text-yellow-600">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-medium">{store.rating.toFixed(1)}</span>
              </div>
            )}

            {/* Sales */}
            <div className="flex items-center gap-1 text-muted">
              <TrendingUp className="h-4 w-4" />
              <span>
                {store.sales} {t("sales")}
              </span>
            </div>
          </div>

          {/* Products Count */}
          {store._count?.products !== undefined && (
            <div className="mt-3 flex items-center justify-center gap-1 text-sm text-muted">
              <Package className="h-4 w-4" />
              <span>
                {store._count.products} {t("products")}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
