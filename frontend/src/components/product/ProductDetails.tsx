"use client";

import Image from "next/image";
import { Button } from "@/components";
import type { ProductApi } from "@/types";
import { useProductData } from "@/hooks";
import { useLocale, useTranslations } from "next-intl";
import {
  ChevronLeft,
  ChevronRight,
  Package2Icon,
  ShoppingCartIcon,
} from "lucide-react";
import { useCartActions } from "@/state/useCartActions";
import { useEffect, useMemo, useState } from "react";

type Props = {
  product: ProductApi;
};

export default function ProductDetails({ product }: Props) {
  const t = useTranslations("productDetails");
  const tCard = useTranslations("productCard");
  const locale = useLocale();
  const data = useProductData(product);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { add } = useCartActions();

  const images = useMemo(() => product.images ?? [], [product.images]);
  const initialIndex = useMemo(() => {
    const primaryIndex = product.primaryImage
      ? images.indexOf(product.primaryImage)
      : -1;
    return primaryIndex >= 0 ? primaryIndex : 0;
  }, [images, product.primaryImage]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(initialIndex);

  useEffect(() => {
    setSelectedImageIndex(initialIndex);
  }, [product.id, initialIndex]);

  const hasMultipleImages = images.length > 1;
  const selectedImage = images[selectedImageIndex];

  const handlePreviousImage = () => {
    setSelectedImageIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  };

  if (!data) return null;

  const normalizedLocale = locale.split("-")[0];
  const translation =
    product.translations?.find((t) => t.locale === normalizedLocale) ??
    product.translations?.[0];

  const handleAddToCart = async () => {
    if (!product?.id) return;

    setIsAddingToCart(true);
    try {
      await add({
        productId: product.id,
        name: data.title,
        slug: data.slug ?? String(product.id),
        image: data.image ?? null,
        price: data.price,
        quantity: 1,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <section className="grid gap-8 lg:grid-cols-2">
      {/* IMAGE SIDE */}
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_2px_12px_var(--color-shadow)]">
          <div className="relative aspect-square overflow-hidden bg-card-soft">
            {selectedImage ? (
              <Image
                src={selectedImage}
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
                <span className="text-sm font-medium">{tCard("noImage")}</span>
              </div>
            )}

            {data.discount && data.discount > 0 && (
              <div className="absolute top-4 right-4 rounded-lg bg-destructive px-3 py-1 text-sm font-medium text-white shadow-lg">
                -{data.discount}%
              </div>
            )}

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  aria-label={tCard("previousImage")}
                  onClick={handlePreviousImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/70 text-primary backdrop-blur-sm transition hover:bg-background"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  aria-label={tCard("nextImage")}
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/70 text-primary backdrop-blur-sm transition hover:bg-background"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/70 px-2.5 py-1 text-xs font-medium text-primary backdrop-blur-sm">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>

        {/* THUMBNAILS */}
        {hasMultipleImages && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                aria-label={`${data.title} ${index + 1}`}
                onClick={() => setSelectedImageIndex(index)}
                className={[
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition",
                  index === selectedImageIndex
                    ? "border-destructive"
                    : "border-border hover:border-primary/50",
                ].join(" ")}
              >
                <Image
                  src={image}
                  alt={`${data.title} ${index + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CONTENT SIDE */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold tracking-tight text-primary md:text-3xl">
          {data.title}
        </h1>

        {translation?.description && (
          <p className="mt-4 leading-7 text-secondary">
            {translation.description}
          </p>
        )}

        <div className="mt-6 flex items-end gap-3">
          <span className="text-3xl font-bold text-primary">
            ₾{data.price.toFixed(2)}
          </span>

          {data.oldPrice && data.oldPrice > data.price && (
            <span className="pb-1 text-md line-through text-destructive">
              ₾{data.oldPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* STATUS */}
        <div className="mt-6 flex flex-wrap gap-3">
          {data.isOutOfStock ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
              {tCard("outOfStock")}
            </div>
          ) : data.isLowStock ? (
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 text-sm font-medium text-yellow-600">
              {tCard("lowStock")}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card-soft px-3 py-2 text-sm font-medium text-primary">
              {t("inStock")}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<ShoppingCartIcon className="h-5 w-5" />}
            disabled={data.isOutOfStock}
            loading={isAddingToCart}
            onClick={handleAddToCart}
          >
            {t("addToCart")}
          </Button>

          <Button variant="outline" size="lg">
            {t("buyNow")}
          </Button>
        </div>
      </div>
    </section>
  );
}
