import { cartApi } from "@/lib/cartApi";
import { useCartStore } from "@/state/useCartStore";
import { useAuthStore } from "@/state/useAuthStore";
import { CartItem } from "@/state/useCartStore";

// Frontend-only UX guard; the backend remains the authoritative stock check.
export const MAX_CART_QUANTITY = 5;

export type AddToCartFailureReason =
  | "OUT_OF_STOCK"
  | "INSUFFICIENT_STOCK"
  | "MAX_CART_QUANTITY_REACHED";

export type AddToCartResult =
  | { success: true }
  | { success: false; reason: AddToCartFailureReason };

export function getMaxCartQuantity(availableStock: number) {
  return Math.max(0, Math.min(availableStock, MAX_CART_QUANTITY));
}

export function useCartActions() {
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const setBackendId = useCartStore((s) => s.setBackendId);
  const clearCart = useCartStore((s) => s.clearCart);

  const isLoggedIn = () => !!useAuthStore.getState().user;

  const add = async (
    item: Omit<CartItem, "quantity"> & { quantity?: number },
  ): Promise<AddToCartResult> => {
    const requestedQuantity = Math.max(1, item.quantity ?? 1);
    const availableStock = item.availableStock ?? Infinity;

    if (availableStock <= 0) {
      return { success: false, reason: "OUT_OF_STOCK" };
    }

    const existingQuantity =
      useCartStore
        .getState()
        .items.find(
          (it) =>
            it.productId === item.productId &&
            String(it.variantId ?? "") === String(item.variantId ?? ""),
        )?.quantity ?? 0;

    const effectiveMax = getMaxCartQuantity(availableStock);

    if (existingQuantity + requestedQuantity > effectiveMax) {
      const reason: AddToCartFailureReason =
        effectiveMax >= MAX_CART_QUANTITY
          ? "MAX_CART_QUANTITY_REACHED"
          : "INSUFFICIENT_STOCK";
      return { success: false, reason };
    }

    addItem({ ...item, quantity: requestedQuantity });

    if (isLoggedIn()) {
      try {
        const res = await cartApi.addToCart(item.productId, requestedQuantity);
        setBackendId(item.productId, item.variantId, res.id);
      } catch (e) {
        console.error("Cart sync failed", e);
      }
    }

    return { success: true };
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
