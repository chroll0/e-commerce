"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircleIcon, PackageSearchIcon } from "lucide-react";

import { useProduct, useProductData } from "@/hooks";
import { Breadcrumbs, ProductDetails, ProductCardSkeleton } from "@/components";

export default function Page() {
  const { slug } = useParams<{ slug: string }>();
  const locale = useLocale();
  const t = useTranslations("productDetails");
  const navT = useTranslations("nav");
  const { product, loading, error } = useProduct(slug, locale);
  const data = useProductData(product ?? undefined);

  return (
    <section className="mx-auto mt-10 w-full max-w-7xl px-4">
      <Breadcrumbs
        items={[
          { label: "Satori", href: `/${locale}` },
          { label: navT("products"), href: `/${locale}/products` },
          { label: product?.translations?.[0]?.title ?? slug },
        ]}
      />

      {/* LOADING */}
      {loading && (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* IMAGE */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card p-4">
            <ProductCardSkeleton className="aspect-square w-full rounded-xl" />
          </div>

          {/* CONTENT */}
          <div className="space-y-4">
            <ProductCardSkeleton className="h-10 w-2/3 rounded-lg" />

            <ProductCardSkeleton className="h-5 w-full rounded-lg" />
            <ProductCardSkeleton className="h-5 w-5/6 rounded-lg" />
            <ProductCardSkeleton className="h-5 w-4/6 rounded-lg" />

            <div className="flex gap-3 pt-4">
              <ProductCardSkeleton className="h-12 w-32 rounded-xl" />
              <ProductCardSkeleton className="h-12 w-28 rounded-xl" />
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="space-y-4">
                <ProductCardSkeleton className="h-5 w-full rounded-lg" />
                <ProductCardSkeleton className="h-5 w-full rounded-lg" />
                <ProductCardSkeleton className="h-5 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      )}

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
