"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { ProductApi } from "@/types";
import { Button, ProductCardSkeleton } from "@/components";
import { useProductData } from "@/hooks";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import { useCartActions } from "@/state/useCartActions";

type Props = {
  product?: ProductApi;
};

export default function ProductCard({ product }: Props) {
  const t = useTranslations("productCard");
  const locale = useLocale();
  const router = useRouter();

  const data = useProductData(product);
  const { add } = useCartActions();

  const handleNavigation = () => {
    const target = data?.slug ?? String(product?.id ?? "");
    if (!target) return;
    router.push(`/${locale}/products/${target}`);
  };

  if (!data) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_2px_12px_var(--color-shadow)]">
        <ProductCardSkeleton className="h-44 w-full rounded-none sm:h-52" />
        <div className="space-y-3 p-3">
          <ProductCardSkeleton className="h-4 w-full rounded-md" />
          <ProductCardSkeleton className="h-4 w-2/3 rounded-md" />
        </div>
      </div>
    );
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!product?.id) return;

    add({
      productId: product.id,
      name: data.title,
      slug: data.slug ?? product.slug ?? String(product.id),
      image: data.image ?? null,
      price: data.price,
      quantity: 1,
    });
  };

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
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">
            {t("noImage")}
          </div>
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
        <div className="absolute bottom-3 right-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition">
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
            ${data.price.toFixed(2)}
          </span>

          {data.oldPrice && data.oldPrice > data.price && (
            <span className="text-xs line-through text-destructive">
              ${data.oldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
