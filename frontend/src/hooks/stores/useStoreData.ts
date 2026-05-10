import { useMemo } from "react";
import type { StoreApi } from "@/types";

export interface StoreCardData {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  rating: number;
  sales: number;
  productsCount: number;
  isPopular: boolean;
}

export function useStoreData(store?: StoreApi): StoreCardData | null {
  return useMemo(() => {
    if (!store) return null;

    const rating = store.rating ?? 0;
    const sales = store.sales ?? 0;
    const productsCount = store._count?.products ?? 0;

    return {
      id: store.id,
      name: store.name,
      slug: store.slug,
      logo: store.logo ?? null,
      rating,
      sales,
      productsCount,
      isPopular: rating >= 4.5 || sales > 100,
    };
  }, [store]);
}
