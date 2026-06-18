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

type AuthState = {
  user: User | null;
  loading: boolean;
  fetchMe: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const getCart = () => useCartStore.getState();

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
  backendCart.forEach((item: any) =>
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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  fetchMe: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/auth/me");
      set({
        user: { ...data, createdAt: new Date(data.createdAt) },
        loading: false,
      });
    } catch {
      set({ user: null, loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    await api.post("/auth/login", { email, password });
    await useAuthStore.getState().fetchMe();
    await syncCartOnLogin();
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
