import { useLocale } from "next-intl";
import { useMemo } from "react";
import type { ProductApi } from "@/types";

export interface ProductCardData {
  title: string;
  price: number;
  oldPrice: number | null;
  discount: number | null;
  stock: number;
  image: string | undefined;
  slug?: string;
  sold: number;
  progress: number;
  isOutOfStock: boolean;
  isLowStock: boolean;
}

export function useProductData(product?: ProductApi): ProductCardData | null {
  const locale = useLocale();
  return useMemo(() => {
    if (!product) return null;
    const normalizedLocale = locale.split("-")[0];

    const translation =
      product.translations?.find((t) => t.locale === normalizedLocale) ??
      product.translations?.[0];

    const stock = product.stock;
    const sold = Math.max(0, Math.floor(stock * 0.4));
    const progress =
      stock > 0 ? Math.min(100, Math.round((sold / stock) * 100)) : 0;

    const isOutOfStock = stock === 0;
    const isLowStock = stock > 0 && stock <= 5;

    return {
      title: translation?.title ?? "Untitled Product",
      price: product.price,
      oldPrice: product.oldPrice,
      discount: product.discount,
      stock,
      image: product.images?.[0],
      slug: product.slug,
      sold,
      progress,
      isOutOfStock,
      isLowStock,
    };
  }, [product, locale]);
}
