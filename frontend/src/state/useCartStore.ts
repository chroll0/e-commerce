import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: number;
  variantId?: number | string;
  name: string;
  slug: string;
  image: string | null;
  price: number;
  quantity: number;
  backendId?: number;
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

  setBackendId: (
    productId: number,
    variantId: number | string | undefined,
    backendId: number,
  ) => void;

  clearCart: () => void;

  subtotal: () => number;
  totalItems: () => number;
};

const createCartStore = (
  set: (
    partial: Partial<CartState> | ((state: CartState) => Partial<CartState>),
  ) => void,
  get: () => CartState,
): CartState => ({
  items: [],

  addItem: (incoming) => {
    const qty = Math.max(1, incoming.quantity ?? 1);

    set((state) => {
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
        items.push({
          ...incoming,
          quantity: qty,
        });
      }

      return { items };
    });
  },

  removeItem: (productId, variantId) => {
    set((state) => ({
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

    set((state) => {
      const items = [...state.items];

      const idx = items.findIndex(
        (it) =>
          it.productId === productId &&
          String(it.variantId ?? "") === String(variantId ?? ""),
      );

      if (idx === -1) {
        return { items };
      }

      items[idx] = {
        ...items[idx],
        quantity: q,
      };

      return { items };
    });
  },

  setBackendId: (productId, variantId, backendId) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId &&
        String(item.variantId ?? "") === String(variantId ?? "")
          ? {
              ...item,
              backendId,
            }
          : item,
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  subtotal: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
});

export const useCartStore = create<CartState>()(
  persist(createCartStore, {
    name: "cart",
    partialize: (state) => ({
      items: state.items,
    }),
  }),
);
