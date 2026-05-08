"use client";

import { useTranslations } from "next-intl";
import type { ProductApi } from "@/types";
import { Button, ProductCardSkeleton } from "@/components";
import { useProductData } from "@/hooks/useProductData";

type Props = {
  productId?: number;
  product?: ProductApi;
  showCategoryBadge?: boolean;
};

export default function ProductCard({
  productId,
  product,
  showCategoryBadge = false,
}: Props) {
  const t = useTranslations("productCard");
  const data = useProductData(product);

  // Loading skeleton
  if (!data) {
    return (
      <div className="bg-card rounded-xl shadow-[0_2px_12px_var(--color-shadow)] p-4 border border-border overflow-hidden">
        <ProductCardSkeleton className="w-full h-48 rounded-lg mb-3" />
        <ProductCardSkeleton className="h-5 w-full mb-2 rounded" />
        <ProductCardSkeleton className="h-4 w-2/3 mb-3 rounded" />
        <ProductCardSkeleton className="h-5 w-1/3 mb-3 rounded" />
        <ProductCardSkeleton className="h-2 w-full mb-2 rounded-full" />
        <ProductCardSkeleton className="h-3 w-1/2 rounded" />
      </div>
    );
  }

  return (
    <div className="group bg-card rounded-xl shadow-[0_2px_12px_var(--color-shadow)] border border-border hover:shadow-[0_8px_24px_var(--color-shadow)] transition-all duration-300 cursor-pointer overflow-hidden h-full flex flex-col">
      {/* Image Container */}
      <div className="relative w-full h-48 bg-card-soft overflow-hidden">
        {data.image ? (
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-(--color-card-soft) to-(--color-border) flex items-center justify-center">
            <span className="text-muted text-sm">{t("noImage")}</span>
          </div>
        )}

        {/* Discount Badge */}
        {data.discount && data.discount > 0 && (
          <div className="absolute top-3 right-3 bg-(--color-destructive) text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            {t("discount_label", { percent: data.discount })}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-lg font-semibold text-primary line-clamp-2 mb-2 leading-tight">
          {data.title}
        </h3>

        {/* Price Section */}
        <div className="flex gap-2 items-baseline mb-3">
          <span className="text-xl font-bold text-primary">
            ${data.price.toFixed(2)}
          </span>
          {data.oldPrice && data.oldPrice > data.price && (
            <span className="line-through text-destructive text-sm font-medium">
              ${data.oldPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex gap-2 items-center mb-3">
          <Button variant="outline" size="sm" className="mt-auto">
            {t("viewDetails")}
          </Button>
          <Button variant="primary" size="sm" className="mt-2">
            {t("addToCart")}
          </Button>
        </div>
      </div>
    </div>
  );
}
