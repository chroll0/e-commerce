"use client";

import type { StoreApi } from "@/types";
import { ImageIcon, Star } from "lucide-react";
import Image from "next/image";

type StoreHeaderProps = {
  store: StoreApi;
  t: any;
};

export default function StoreHeader({ store, t }: StoreHeaderProps) {
  return (
    <div className="mb-10">
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

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
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
}
