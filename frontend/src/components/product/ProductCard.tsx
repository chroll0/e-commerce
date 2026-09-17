"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, EyeIcon } from "lucide-react";

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
      availableStock: data.stock,
    });
  };

  if (!data) return null;

  const normalizedLocale = locale.split("-")[0];
  const visibleLabels = (product.labels ?? []).slice(0, 2);

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

        {/* LABEL BADGES */}
        {visibleLabels.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
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

        {/* CAROUSEL CONTROLS */}
        {hasMultipleImages && (
          <>
            <Button
              variant="outline"
              iconOnly
              size="sm"
              aria-label={t("previousImage")}
              onClick={handlePreviousImage}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full bg-card opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-card/90"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              iconOnly
              size="sm"
              aria-label={t("nextImage")}
              onClick={handleNextImage}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-card opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-card/90"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[10px] font-medium text-highlight backdrop-blur-sm">
              {imageIndex + 1} / {images.length}
            </div>
          </>
        )}

        {/* VIEW */}
        <div className="absolute top-1.5 left-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition">
          <Button
            variant="text"
            iconOnly
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigation();
            }}
          >
            <EyeIcon className="h-4 w-4 text-highlight" />
          </Button>
        </div>

        {/* ADD TO CART */}
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300">
          <Button
            variant="highlight"
            size="sm"
            fullWidth
            disabled={data.isOutOfStock}
            onClick={handleAddToCart}
          >
            {data.isOutOfStock ? t("outOfStock") : t("addToCart")}
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

        {data.isLowStock && (
          <p className="mt-2 text-xs font-medium text-primary">
            {t("lowStock")}
          </p>
        )}
      </div>
    </div>
  );
}
