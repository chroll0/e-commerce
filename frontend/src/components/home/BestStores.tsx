"use client";

import Image from "next/image";
import Link from "next/link";
import { useStores } from "@/hooks";
import { useTranslations } from "next-intl";
import { ImageIcon, Star } from "lucide-react";
import { Button, StoreCardSkeleton } from "@/components";

export default function BestStores() {
  const t = useTranslations("home.stores");
  const { stores, loading, error } = useStores(4);

  return (
    <section>
      <h2 className="my-6 text-xl font-semibold text-primary">{t("title")}</h2>

      {/* LOADING */}
      {loading && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StoreCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center text-destructive">
          {t("loadError")}
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && (!stores || stores.length === 0) && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
          {t("noStores")}
        </div>
      )}

      {/* CONTENT */}
      {!loading && !error && stores && stores.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stores.map((store) => (
            <Link
              key={store.id}
              href={`/stores/${store.slug}`}
              className="
                group flex flex-col rounded-2xl border border-border bg-card p-4
                transition-all duration-300
                hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl
              "
            >
              {/* LOGO */}
              <div className="relative mb-4 flex h-28 items-center justify-center overflow-hidden rounded-xl border border-border bg-card-soft p-6">
                {store.logo ? (
                  <Image
                    src={store.logo}
                    alt={store.name}
                    fill
                    className="object-contain p-4"
                  />
                ) : (
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                )}
              </div>

              {/* INFO */}
              <div className="space-y-2">
                <h3 className="truncate font-semibold text-primary">
                  {store.name}
                </h3>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                    <span>{(store.rating ?? 0).toFixed(1)}</span>
                  </div>

                  <span className="text-muted-foreground">
                    {store.sales ?? 0} {t("sales")}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-auto pt-4">
                <Button variant="outline" size="sm" fullWidth>
                  {t("viewStore")}
                </Button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
