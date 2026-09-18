"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";

import { Button } from "@/components";
import type { ProductApi } from "@/types";
import { useProductData } from "@/hooks";
import { useCartActions } from "@/state/useCartActions";

type Props = {
  product: ProductApi;
};

export default function ProductCard({ product }: Props) {
  const t = useTranslations("productCard");
  const locale = useLocale();
  const router = useRouter();

  const data = useProductData(product);
  const { add } = useCartActions();

  const images = useMemo(() => product.images ?? [], [product.images]);
  const initialIndex = useMemo(() => {
    if (!product.primaryImage) return 0;
    const idx = images.indexOf(product.primaryImage);
    return idx === -1 ? 0 : idx;
  }, [images, product.primaryImage]);

  const [imageIndex, setImageIndex] = useState(initialIndex);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  if (!data) return null;

  const activeImage = images[imageIndex] ?? data.image;
  const hasMultipleImages = images.length > 1;
  const normalizedLocale = locale.split("-")[0];
  const visibleLabels = (product.labels ?? []).slice(0, 2);
  const href = `/${locale}/products/${data.slug}`;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setImageIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setImageIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product?.id || !data) return;

    setIsAddingToCart(true);
    try {
      await add({
        productId: product.id,
        name: data.title,
        slug: data.slug ?? String(product.id),
        image: data.image ?? null,
        price: data.price,
        quantity: 1,
        availableStock: data.stock,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product?.id || !data) return;

    setIsAddingToCart(true);
    try {
      await add({
        productId: product.id,
        name: data.title,
        slug: data.slug ?? String(product.id),
        image: data.image ?? null,
        price: data.price,
        quantity: 1,
        availableStock: data.stock,
      });
      router.push(`/${locale}/checkout`);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_var(--color-shadow)]"
    >
      {/* IMAGE */}
      <div className="relative aspect-square overflow-hidden bg-card-soft">
        {activeImage ? (
          <Image
            src={activeImage}
            alt={data.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">
            {t("noImage")}
          </div>
        )}

        {/* TOP LEFT — labels */}
        {visibleLabels.length > 0 && (
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {visibleLabels.map((label) => (
              <span
                key={label.id}
                className="rounded-md bg-highlight px-2 py-1 text-[11px] font-semibold text-white"
              >
                {normalizedLocale === "ka" ? label.nameKa : label.nameEn}
              </span>
            ))}
          </div>
        )}

        {/* TOP RIGHT — discount */}
        {data.discount && (
          <div className="absolute right-2 top-2 rounded-md bg-destructive px-2 py-1 text-[11px] font-semibold text-white">
            -{data.discount}%
          </div>
        )}

        {/* CAROUSEL CONTROLS */}
        {hasMultipleImages && (
          <>
            <Button
              variant="outline"
              iconOnly
              size="sm"
              aria-label={t("previousImage")}
              onClick={handlePrevImage}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full bg-card/80 opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              iconOnly
              size="sm"
              aria-label={t("nextImage")}
              onClick={handleNextImage}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-card/80 opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition">
              {imageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-foreground leading-snug">
          {data.title}
        </h3>

        <div className="my-3 flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">
            {data.price.toFixed(2)}₾
          </span>

          {data.oldPrice && data.oldPrice > data.price && (
            <span className="relative text-xs text-foreground/50">
              {data.oldPrice.toFixed(2)}₾
              <span
                className="absolute inset-0 flex items-center overflow-hidden"
                aria-hidden="true"
              >
                <svg
                  className="w-full rotate-8"
                  height="1.5"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 1.5"
                >
                  <line
                    x1="0"
                    y1="1.5"
                    x2="100"
                    y2="0"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                  />
                </svg>
              </span>
            </span>
          )}
        </div>

        {data.isLowStock && (
          <p className="mb-2 text-xs font-medium text-destructive">
            {t("lowStock")}
          </p>
        )}

        <div className="flex-1" />

        {/* CTA */}
        <div className="flex items-center gap-2 mt-3">
          <Button
            variant="outline"
            iconOnly
            size="sm"
            disabled={data.isOutOfStock || isAddingToCart}
            aria-label={t("addToCart")}
            onClick={handleAddToCart}
            className="rounded-md shrink-0"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>

          <Button
            variant="primary"
            size="sm"
            fullWidth
            disabled={data.isOutOfStock || isAddingToCart}
            loading={isAddingToCart}
            onClick={handleBuyNow}
            className="rounded-md"
          >
            {data.isOutOfStock ? t("outOfStock") : t("buyNow")}
          </Button>
        </div>
      </div>
    </Link>
  );
}
