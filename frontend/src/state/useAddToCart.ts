import { cartApi } from "@/lib/cartApi";
import { useCartStore } from "@/state/useCartStore";
import { useAuthStore } from "@/state/useAuthStore";

export function useCartActions() {
  const addItem = useCartStore((s) => s.addItem);

  return async (item: any) => {
    addItem(item);
    const user = useAuthStore.getState().user;

    if (!user) return;

    try {
      await cartApi.addToCart(item.productId, item.quantity ?? 1);
    } catch (e) {
      console.error("Cart sync failed", e);
    }
  };
}
