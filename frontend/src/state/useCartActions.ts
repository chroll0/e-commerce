import { cartApi } from "@/lib/cartApi";
import { useCartStore } from "@/state/useCartStore";
import { useAuthStore } from "@/state/useAuthStore";
import { CartItem } from "@/state/useCartStore";

export function useCartActions() {
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const items = useCartStore((s) => s.items);

  const isLoggedIn = () => !!useAuthStore.getState().user;

  const add = async (
    item: Omit<CartItem, "quantity"> & { quantity?: number },
  ) => {
    addItem(item);

    if (!isLoggedIn()) return;

    try {
      const res = await cartApi.addToCart(item.productId, item.quantity ?? 1);
      addItem({ ...item, quantity: 0, backendId: res.id });
    } catch (e) {
      console.error("Cart sync failed", e);
    }
  };

  const remove = async (productId: number, variantId?: number | string) => {
    const item = items.find(
      (it) =>
        it.productId === productId &&
        String(it.variantId ?? "") === String(variantId ?? ""),
    );

    removeItem(productId, variantId);

    if (!isLoggedIn() || !item?.backendId) return;

    try {
      await cartApi.removeItem(item.backendId);
    } catch (e) {
      console.error("Cart remove failed", e);
    }
  };

  const update = async (
    productId: number,
    variantId: number | string | undefined,
    quantity: number,
  ) => {
    const item = items.find(
      (it) =>
        it.productId === productId &&
        String(it.variantId ?? "") === String(variantId ?? ""),
    );

    updateQuantity(productId, variantId, quantity);

    if (!isLoggedIn() || !item?.backendId) return;

    try {
      await cartApi.updateItem(item.backendId, quantity);
    } catch (e) {
      console.error("Cart update failed", e);
    }
  };

  return { add, remove, update };
}
