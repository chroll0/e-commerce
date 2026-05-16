import { api } from "@/lib/axios";
import { create } from "zustand";

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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  fetchMe: async () => {
    set({ loading: true });

    try {
      const { data } = await api.get("/auth/me");

      set({
        user: {
          ...data,
          createdAt: new Date(data.createdAt),
        },
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
  },

  logout: async () => {
    set({ loading: true });

    try {
      await api.post("/auth/logout");
    } finally {
      set({ user: null, loading: false });
    }
  },
}));
