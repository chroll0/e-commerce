"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircleIcon, PackageSearchIcon } from "lucide-react";

import { useProduct, useProductData } from "@/hooks";
import { getCategoryBySlug } from "@/lib/categoriesApi";
import { getStoreBySlug } from "@/lib/storesApi";
import {
  Breadcrumbs,
  ProductDetails,
  ProductDetailsPageSkeleton,
} from "@/components";

export default function Page() {
  const { slug } = useParams<{ slug: string }>();
  const locale = useLocale();
  const t = useTranslations("productDetails");
  const navT = useTranslations("nav");

  const { product, loading, error } = useProduct(slug, locale);
  const data = useProductData(product ?? undefined);

  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const brandSlug = searchParams.get("brand");
  // items === null means the context was resolved but is unavailable
  const [trail, setTrail] = useState<{
    key: string;
    items: { label: string; href?: string }[] | null;
  } | null>(null);

  const contextKey = categorySlug
    ? `category:${categorySlug}:${locale}`
    : brandSlug
      ? `brand:${brandSlug}:${locale}`
      : null;

  useEffect(() => {
    if (!contextKey) return;
    let cancelled = false;

    const load = async () => {
      try {
        if (categorySlug) {
          const category = await getCategoryBySlug(categorySlug, locale);
          if (cancelled) return;
          if (!category) {
            setTrail({ key: contextKey, items: null });
            return;
          }
          setTrail({
            key: contextKey,
            items: [
              { label: "Category" },
              ...[...(category.ancestors ?? []), category].map((c) => ({
                label: c.name,
                href: `/${locale}/category/${c.slug}`,
              })),
            ],
          });
        } else if (brandSlug) {
          const store = await getStoreBySlug(brandSlug, { locale });
          if (cancelled) return;
          setTrail({
            key: contextKey,
            items: [
              { label: navT("brands"), href: `/${locale}/brands` },
              { label: store.name, href: `/${locale}/brands/${store.slug}` },
            ],
          });
        }
      } catch {
        if (!cancelled) setTrail({ key: contextKey, items: null });
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [contextKey, categorySlug, brandSlug, locale, navT]);

  const contextResolved = !contextKey || trail?.key === contextKey;
  const contextItems = contextResolved
    ? contextKey
      ? (trail?.items ?? [])
      : []
    : [{ label: "", skeleton: true }, { label: "", skeleton: true }];

  return (
    <section className="mx-auto mt-10 w-full max-w-7xl px-4">
      {/* BREADCRUMBS */}
      <Breadcrumbs
        items={[
          { label: "eShop", href: `/${locale}` },
          ...contextItems,
          { label: product?.translations?.[0]?.title ?? slug },
        ]}
      />

      {/* LOADING */}
      {loading && <ProductDetailsPageSkeleton />}

      {/* ERROR */}
      {!loading && error && (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-border bg-card-soft px-6 text-center">
          <div className="rounded-full border border-destructive/20 bg-destructive/10 p-4">
            <AlertCircleIcon className="h-10 w-10 text-destructive" />
          </div>

          <h2 className="mt-5 text-2xl font-semibold text-primary">
            {t("errorTitle")}
          </h2>

          <p className="mt-2 max-w-md text-secondary">
            {t("errorDescription")}
          </p>
        </div>
      )}

      {/* NOT FOUND */}
      {!loading && !error && (!product || !data) && (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-border bg-card-soft px-6 text-center">
          <div className="rounded-full border border-border bg-card p-4">
            <PackageSearchIcon className="h-10 w-10 text-muted" />
          </div>

          <h2 className="mt-5 text-2xl font-semibold text-primary">
            {t("notFoundTitle")}
          </h2>

          <p className="mt-2 max-w-md text-secondary">
            {t("notFoundDescription")}
          </p>
        </div>
      )}

      {/* CONTENT */}
      {!loading && !error && product && <ProductDetails product={product} />}
    </section>
  );
}
