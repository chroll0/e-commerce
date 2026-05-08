import { useMemo } from "react";
import type { ProductApi } from "@/types";

export interface ProductCardData {
  title: string;
  price: number;
  oldPrice: number | null;
  discount: number | null;
  stock: number;
  image: string | undefined;
  sold: number;
  progress: number;
  isOutOfStock: boolean;
  isLowStock: boolean;
}

export function useProductData(product?: ProductApi): ProductCardData | null {
  return useMemo(() => {
    if (!product) return null;

    const stock = product.stock;
    const sold = Math.max(0, Math.floor(stock * 0.4)); // 40% of stock is sold
    const progress =
      stock > 0 ? Math.min(100, Math.round((sold / stock) * 100)) : 0;
    const isOutOfStock = stock === 0;
    const isLowStock = stock > 0 && stock <= 5;

    return {
      title: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      discount: product.discount,
      stock,
      image: product.images?.[0],
      sold,
      progress,
      isOutOfStock,
      isLowStock,
    };
  }, [product]);
}
