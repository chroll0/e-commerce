"use client";

import { useCartStore } from "@/state/useCartStore";
import { useAuthStore } from "@/state/useAuthStore";

export function useAddToCart() {
  const addItem = useCartStore((s) => s.addItem);

  return (item: any) => {
    addItem(item);

    const user = useAuthStore.getState().user;
    // if (user) {
    //   void useCartStore.getState().syncLocalCartToServer?.();
    // }
  };
}
