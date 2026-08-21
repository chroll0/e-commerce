import { api } from "@/lib/axios";
import { create } from "zustand";
import { cartApi } from "@/lib/cartApi";
import { useCartStore } from "@/state/useCartStore";

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  createdAt: Date;
};

export type AuthError = Error & { code?: string };

type AuthState = {
  user: User | null;
  loading: boolean;
  fetchMe: (force?: boolean) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

type BackendCartItem = {
  productId: number;
  quantity: number;
  id: number;
  product: { name: string; slug: string; image?: string | null; price: number };
};

const getCart = () => useCartStore.getState();
let authRequestId = 0;

const syncCartOnLogin = async () => {
  const { items, clearCart, addItem } = getCart();

  if (items.length > 0) {
    await Promise.all(
      items.map((item) => cartApi.addToCart(item.productId, item.quantity)),
    ).catch((e) => console.error("Cart sync failed:", e));
  }

  const backendCart = await cartApi.getCart().catch((e) => {
    console.error("Cart fetch failed:", e);
    return [];
  });

  clearCart();
  (backendCart as BackendCartItem[]).forEach((item) =>
    addItem({
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      image: item.product.image ?? null,
      price: Number(item.product.price),
      quantity: item.quantity,
      backendId: item.id,
    }),
  );
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  fetchMe: async (force = false) => {
    void force;
    const requestId = ++authRequestId;
    const previousUser = get().user;

    set({ loading: true });
    try {
      const { data } = await api.get("/auth/me");
      if (requestId !== authRequestId) return;
      set({
        user: { ...data, createdAt: new Date(data.createdAt) },
      });

      if (!previousUser) {
        await syncCartOnLogin();
      }

      if (requestId === authRequestId) {
        set({ loading: false });
      }
    } catch {
      if (requestId !== authRequestId) return;
      set({ user: null, loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      await api.post("/auth/login", { email, password });
      await useAuthStore.getState().fetchMe(true);
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await api.post("/auth/logout");
    } finally {
      set({ user: null, loading: false });
      getCart().clearCart();
    }
  },
}));
