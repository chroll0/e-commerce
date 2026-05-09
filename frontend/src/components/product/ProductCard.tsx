"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { ProductApi } from "@/types";
import { Button, ProductCardSkeleton } from "@/components";
import { useProductData } from "@/hooks";
import { EyeIcon } from "lucide-react";
import Image from "next/image";

type Props = {
  product?: ProductApi;
  productId?: number;
};

export default function ProductCard({ product }: Props) {
  const t = useTranslations("productCard");
  const locale = useLocale();
  const router = useRouter();
  const data = useProductData(product);

  const handleNavigation = () => {
    const target = data?.slug ?? String(product?.id ?? "");
    if (!target) return;
    router.push(`/${locale}/products/${target}`);
  };

  // Loading State
  if (!data) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_2px_12px_var(--color-shadow)]">
        <ProductCardSkeleton className="h-44 w-full rounded-none sm:h-52" />
        <div className="space-y-3 p-3">
          <ProductCardSkeleton className="h-4 w-full rounded-md" />
          <ProductCardSkeleton className="h-4 w-2/3 rounded-md" />
          <div className="flex items-center gap-2">
            <ProductCardSkeleton className="h-5 w-20 rounded-md" />
            <ProductCardSkeleton className="h-4 w-14 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_var(--color-shadow)]"
      onClick={handleNavigation}
    >
      {/* IMAGE */}
      <div className="relative aspect-square overflow-hidden bg-card-soft">
        {data.image ? (
          <Image
            src={data.image}
            alt={data.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-xs text-muted">{t("noImage")}</span>
          </div>
        )}

        {/* VIEW BUTTON */}
        <div className="absolute top-2 left-2 opacity-0 translate-y-2 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            variant="text"
            iconOnly
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigation();
            }}
          >
            <EyeIcon className="h-4.5 w-4.5" />
          </Button>
        </div>

        {/* DISCOUNT */}
        {data.discount && data.discount > 0 && (
          <div className="absolute top-2 right-2 rounded-md bg-(--color-destructive) px-2 py-1 text-[11px] font-semibold text-white">
            -{data.discount}%
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-3">
        {/* TITLE */}
        <h3 className="line-clamp-2 mt-1 text-sm font-medium leading-5 text-primary sm:text-base">
          {data.title}
        </h3>

        {/* PRICE */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-bold text-primary sm:text-lg">
            ${data.price.toFixed(2)}
          </span>

          {data.oldPrice && data.oldPrice > data.price && (
            <span className="text-xs text-destructive line-through">
              ${data.oldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
