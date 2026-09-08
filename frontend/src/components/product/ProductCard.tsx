"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, EyeIcon } from "lucide-react";

import type { ProductApi } from "@/types";
import { Button } from "@/components";
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
  const activeImage = images[imageIndex] ?? data?.image;
  const hasMultipleImages = images.length > 1;

  const handleNavigation = () => {
    if (!data?.slug) return;
    router.push(`/${locale}/products/${data.slug}`);
  };

  const handlePreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!product?.id || !data) return;

    add({
      productId: product.id,
      name: data.title,
      slug: data.slug ?? String(product.id),
      image: data.image ?? null,
      price: data.price,
      quantity: 1,
    });
  };

  if (!data) return null;

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_var(--color-shadow)]"
      onClick={handleNavigation}
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

        {/* CAROUSEL CONTROLS */}
        {hasMultipleImages && (
          <>
            <button
              type="button"
              aria-label={t("previousImage")}
              onClick={handlePreviousImage}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-background/70 text-primary opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-background"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              aria-label={t("nextImage")}
              onClick={handleNextImage}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-background/70 text-primary opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-background"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-medium text-primary backdrop-blur-sm">
              {imageIndex + 1} / {images.length}
            </div>
          </>
        )}

        {/* VIEW */}
        <div className="absolute top-2 left-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition">
          <Button
            variant="text"
            iconOnly
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigation();
            }}
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* ADD TO CART */}
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300">
          <Button
            size="sm"
            disabled={data.isOutOfStock}
            onClick={handleAddToCart}
          >
            {t("addToCart")}
          </Button>
        </div>

        {/* DISCOUNT */}
        {data.discount && (
          <div className="absolute top-2 right-2 rounded-md bg-destructive px-2 py-1 text-[11px] font-semibold text-white">
            -{data.discount}%
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-3">
        <h3 className="line-clamp-2 mt-1 text-sm font-medium text-primary">
          {data.title}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <span className="font-bold text-primary">
            ₾{data.price.toFixed(2)}
          </span>

          {data.oldPrice && data.oldPrice > data.price && (
            <span className="text-xs line-through text-destructive">
              ₾{data.oldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
