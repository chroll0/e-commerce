"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getStores } from "@/lib/storesApi";
import type { Locale, StoreApi } from "@/types";
import { Breadcrumbs, StoreCardSkeleton } from "@/components";
import { useLocale, useMessages, useTranslations } from "next-intl";

interface SaleAdContent {
  storeSlug: string;
  storeName: string;
  badge: string;
  title: string;
  description: string;
  discountPercent: number;
}

const SALE_ADS: Array<
  Omit<SaleAdContent, "storeName" | "badge" | "title" | "description"> & {
    storeSlug: string;
  }
> = [
  { storeSlug: "outdoorhub", discountPercent: 40 },
  { storeSlug: "gadgetzone", discountPercent: 25 },
  { storeSlug: "styleco", discountPercent: 30 },
  { storeSlug: "homefair", discountPercent: 20 },
];

function SaleAdCard({
  ad,
  store,
  locale,
  t,
}: {
  ad: SaleAdContent;
  store?: StoreApi;
  locale: string;
  t: (key: string) => string;
}) {
  const storeName = store?.name ?? ad.storeName;
  const href = `/${locale}/stores/${store?.slug ?? ad.storeSlug}`;

  return (
    <Link
      href={href}
      className="group flex h-full flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          {ad.badge}
        </span>
        <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive">
          -{ad.discountPercent}%
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/60 text-sm font-semibold text-primary">
          {store?.logo ? (
            <Image
              src={store.logo}
              alt={storeName}
              width={48}
              height={48}
              className="h-full w-full object-contain p-1"
            />
          ) : (
            <span>{storeName.slice(0, 2).toUpperCase()}</span>
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">{storeName}</p>
          <p className="text-sm text-muted-foreground">{t("offerLabel")}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-primary">{ad.title}</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {ad.description}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-3 text-sm font-medium text-primary">
        <span>{t("viewStore")}</span>
        <span className="transition group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}

const SalesPage = () => {
  const locale = useLocale() as Locale;
  const t = useTranslations("sales");
  const messages = useMessages() as Record<string, any>;
  const [storeMap, setStoreMap] = useState<Record<string, StoreApi>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const data = await getStores({ limit: 50 });
        const map: Record<string, StoreApi> = {};
        data.forEach((store) => {
          if (store.slug) map[store.slug] = store;
        });
        setStoreMap(map);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <main className="mx-auto mt-8 w-full max-w-7xl px-4 pb-16">
      <Breadcrumbs
        items={[
          { label: "eShop", href: `/${locale}` },
          { label: t("nav"), href: `/${locale}/sales` },
        ]}
      />

      <section className="mb-8 overflow-hidden rounded-4xl border border-border bg-linear-to-br from-primary/10 via-card to-background p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="mb-3 inline-flex items-center rounded-full border border-primary/20 bg-background/70 px-3 py-1 text-sm font-medium text-primary">
              {t("heroBadge")}
            </span>
            <h1 className="mb-3 text-3xl font-bold text-primary sm:text-4xl">
              {t("title")}
            </h1>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              {t("description")}
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">
              {t("heroSideTitle")}
            </p>
            <p>{t("heroSideDescription")}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: SALE_ADS.length }).map((_, i) => (
              <StoreCardSkeleton key={i} />
            ))
          : SALE_ADS.map((ad, index) => {
              const salesMessages = messages.sales?.ads?.[index] as
                | {
                    storeName?: string;
                    badge?: string;
                    title?: string;
                    description?: string;
                    discountPercent?: number;
                  }
                | undefined;

              const translatedAd = {
                storeSlug: ad.storeSlug,
                storeName: salesMessages?.storeName ?? "",
                badge: salesMessages?.badge ?? "",
                title: salesMessages?.title ?? "",
                description: salesMessages?.description ?? "",
                discountPercent:
                  salesMessages?.discountPercent ?? ad.discountPercent,
              };

              return (
                <SaleAdCard
                  key={ad.storeSlug}
                  ad={translatedAd}
                  store={storeMap[ad.storeSlug]}
                  locale={locale}
                  t={t}
                />
              );
            })}
      </div>
    </main>
  );
};

export default SalesPage;
