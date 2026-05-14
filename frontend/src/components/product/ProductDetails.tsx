"use client";

import Image from "next/image";
import { Button } from "@/components";
import type { ProductApi } from "@/types";
import { useProductData } from "@/hooks";
import { useLocale, useTranslations } from "next-intl";
import { Package2Icon, ShoppingCartIcon, TagIcon } from "lucide-react";

type Props = {
  product: ProductApi;
};

export default function ProductDetails({ product }: Props) {
  const t = useTranslations("productCard");
  const locale = useLocale();
  const data = useProductData(product);

  if (!data) return null;

  const normalizedLocale = locale.split("-")[0];
  const translation =
    product.translations?.find((t) => t.locale === normalizedLocale) ??
    product.translations?.[0];

  return (
    <section className="grid gap-8 lg:grid-cols-2">
      {/* IMAGE SIDE */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_2px_12px_var(--color-shadow)]">
        <div className="relative aspect-square overflow-hidden bg-card-soft">
          {data.image ? (
            <Image
              src={data.image}
              alt={data.title}
              fill
              priority
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-muted">
              <div className="rounded-full border border-border bg-card p-5">
                <Package2Icon className="h-10 w-10 opacity-50" />
              </div>

              <span className="text-sm font-medium">{t("noImage")}</span>
            </div>
          )}

          {/* DISCOUNT */}
          {data.discount && data.discount > 0 && (
            <div className="absolute top-4 right-4 rounded-lg bg-destructive px-3 py-1 text-sm font-medium text-white shadow-lg">
              -{data.discount}%
            </div>
          )}
        </div>
      </div>

      {/* CONTENT SIDE */}
      <div className="flex flex-col">
        {/* TITLE */}
        <h1 className="text-2xl font-semibold tracking-tight text-primary md:text-3xl">
          {data.title}
        </h1>

        {/* DESCRIPTION */}
        {translation?.description && (
          <p className="mt-4 leading-7 text-secondary">
            {translation.description}
          </p>
        )}

        {/* PRICE */}
        <div className="mt-6 flex items-end gap-3">
          <span className="text-3xl font-bold text-primary">
            ${data.price.toFixed(2)}
          </span>

          {data.oldPrice && data.oldPrice > data.price && (
            <span className="pb-1 text-sm text-muted line-through">
              ${data.oldPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* STATUS */}
        <div className="mt-6 flex flex-wrap gap-3">
          {data.isOutOfStock ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
              {t("outOfStock")}
            </div>
          ) : data.isLowStock ? (
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 text-sm font-medium text-yellow-600">
              {t("lowStock")}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card-soft px-3 py-2 text-sm font-medium text-primary">
              {data.stock} in stock
            </div>
          )}
        </div>

        {/* META */}
        <div className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Product ID</span>

            <span className="font-medium text-primary">#{product.id}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Stock</span>

            <span className="font-medium text-primary">{data.stock}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Discount</span>

            <span className="inline-flex items-center gap-1 font-medium text-primary">
              <TagIcon className="h-4 w-4" />

              {data.discount ? `${data.discount}%` : "—"}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<ShoppingCartIcon className="h-5 w-5" />}
          >
            Add To Cart
          </Button>

          <Button variant="outline" size="lg">
            Buy Now
          </Button>
        </div>
      </div>
    </section>
  );
}
