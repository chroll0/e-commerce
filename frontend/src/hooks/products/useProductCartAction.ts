"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCartActions, type AddToCartResult } from "@/state/useCartActions";
import { useNotificationStore } from "@/state/useNotificationStore";
import type { ProductApi } from "@/types";
import type { ProductCardData } from "@/hooks/products/useProductData";

// Shared "add to cart" / "buy now" behavior for ProductCard and ProductDetails.
export function useProductCartAction(
  product: ProductApi | undefined,
  data: ProductCardData | null,
) {
  const t = useTranslations("productCard");
  const locale = useLocale();
  const router = useRouter();
  const { add } = useCartActions();
  const notify = useNotificationStore((s) => s.push);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const addToCart = async (quantity = 1): Promise<AddToCartResult> => {
    if (!product?.id || !data) {
      return { success: false, reason: "OUT_OF_STOCK" };
    }

    setIsAddingToCart(true);
    try {
      const result = await add({
        productId: product.id,
        name: data.title,
        slug: data.slug ?? String(product.id),
        image: data.image ?? null,
        price: data.price,
        quantity,
        availableStock: data.stock,
      });

      if (!result.success) {
        notify("error", t(`errors.${result.reason}`));
      }

      return result;
    } finally {
      setIsAddingToCart(false);
    }
  };

  const buyNow = async (quantity = 1) => {
    const result = await addToCart(quantity);
    if (result.success) {
      router.push(`/${locale}/checkout`);
    }
    return result;
  };

  return { addToCart, buyNow, isAddingToCart };
}
