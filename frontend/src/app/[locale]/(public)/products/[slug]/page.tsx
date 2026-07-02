"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircleIcon, PackageSearchIcon } from "lucide-react";

import { useProduct, useProductData } from "@/hooks";
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

  return (
    <section className="mx-auto mt-10 w-full max-w-7xl px-4">
      {/* BREADCRUMBS */}
      <Breadcrumbs
        items={[
          { label: "Satori", href: `/${locale}` },
          { label: navT("products"), href: `/${locale}/products` },
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
