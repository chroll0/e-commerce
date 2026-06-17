import { cartApi } from "@/lib/cartApi";
import { useCartStore } from "@/state/useCartStore";
import { useAuthStore } from "@/state/useAuthStore";
import { CartItem } from "@/state/useCartStore";

export function useCartActions() {
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const setBackendId = useCartStore((s) => s.setBackendId);
  const clearCart = useCartStore((s) => s.clearCart);

  const isLoggedIn = () => !!useAuthStore.getState().user;

  const add = async (
    item: Omit<CartItem, "quantity"> & { quantity?: number },
  ) => {
    addItem(item);

    if (!isLoggedIn()) return;

    try {
      const res = await cartApi.addToCart(item.productId, item.quantity ?? 1);

      setBackendId(item.productId, item.variantId, res.id);
    } catch (e) {
      console.error("Cart sync failed", e);
    }
  };

  const remove = async (productId: number, variantId?: number | string) => {
    const item = useCartStore
      .getState()
      .items.find(
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
    const item = useCartStore
      .getState()
      .items.find(
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

  const clear = async () => {
    const items = useCartStore.getState().items;

    clearCart();

    if (!isLoggedIn()) return;

    try {
      await Promise.all(
        items
          .filter((item) => item.backendId)
          .map((item) => cartApi.removeItem(item.backendId!)),
      );
    } catch (e) {
      console.error("Cart clear failed", e);
    }
  };

  return {
    add,
    remove,
    update,
    clear,
  };
}
