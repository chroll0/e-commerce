import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: number;
  variantId?: number | string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];

  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: number, variantId?: number | string) => void;
  updateQuantity: (
    productId: number,
    variantId: number | string | undefined,
    quantity: number,
  ) => void;
  clearCart: () => void;

  subtotal: () => number;
  totalItems: () => number;
};

const createCartStore = (set: any, get: any): CartState => ({
  items: [],

  addItem: (incoming) => {
    const qty = Math.max(1, incoming.quantity ?? 1);

    set((state: CartState) => {
      const items = [...state.items];

      const idx = items.findIndex(
        (it) =>
          it.productId === incoming.productId &&
          String(it.variantId ?? "") === String(incoming.variantId ?? ""),
      );

      if (idx >= 0) {
        items[idx] = {
          ...items[idx],
          quantity: items[idx].quantity + qty,
        };
      } else {
        items.push({ ...incoming, quantity: qty });
      }

      return { items };
    });
  },

  removeItem: (productId, variantId) => {
    set((state: CartState) => ({
      items: state.items.filter(
        (it) =>
          !(
            it.productId === productId &&
            String(it.variantId ?? "") === String(variantId ?? "")
          ),
      ),
    }));
  },

  updateQuantity: (productId, variantId, quantity) => {
    const q = Math.max(1, Math.floor(quantity));

    set((state: CartState) => {
      const items = [...state.items];

      const idx = items.findIndex(
        (it) =>
          it.productId === productId &&
          String(it.variantId ?? "") === String(variantId ?? ""),
      );

      if (idx === -1) return { items };

      items[idx].quantity = q;

      return { items };
    });
  },

  clearCart: () => set({ items: [] }),

  subtotal: () =>
    get().items.reduce((s: number, i: CartItem) => s + i.price * i.quantity, 0),

  totalItems: () =>
    get().items.reduce((s: number, i: CartItem) => s + i.quantity, 0),
});

export const useCartStore = create<CartState>()(
  persist(createCartStore, {
    name: "cart",
    partialize: (state) => ({ items: state.items }),
  }),
);
