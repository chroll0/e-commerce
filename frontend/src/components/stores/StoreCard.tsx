"use client";

import Link from "next/link";
import type { StoreApi } from "@/types";
import { useTranslations } from "next-intl";
import { Store, Star, TrendingUp, Package, ImageIcon } from "lucide-react";
import Image from "next/image";

type Props = {
  store: StoreApi;
};

export default function StoreCard({ store }: Props) {
  const t = useTranslations("stores");

  return (
    <Link href={`/stores/${store.slug}`}>
      <div className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        {/* BANNER */}
        <div className="relative h-32 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
          {store.banner ? (
            <Image
              src={store.banner}
              alt={store.name}
              fill
              className="object-cover opacity-60 transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageIcon className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* LOGO */}
        <div className="absolute left-1/2 top-20 -translate-x-1/2">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-background bg-card shadow-lg">
            {store.logo ? (
              <Image
                src={store.logo}
                alt={store.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-card-soft text-muted-foreground">
                <Store className="h-8 w-8" />
              </div>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-5 pb-5 pt-14 text-center">
          <h3 className="mb-2 truncate text-lg font-semibold text-primary">
            {store.name}
          </h3>

          {/* STATS */}
          <div className="flex items-center justify-center gap-4 text-sm">
            {/* RATING */}
            {store.rating && store.rating > 0 && (
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                <span className="font-medium">{store.rating.toFixed(1)}</span>
              </div>
            )}

            {/* SALES */}
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>
                {store.sales} {t("sales")}
              </span>
            </div>
          </div>

          {/* PRODUCTS COUNT */}
          {store._count?.products !== undefined && (
            <div className="mt-3 flex items-center justify-center gap-1 text-sm text-muted-foreground">
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
