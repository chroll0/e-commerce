import { api } from "@/lib/axios";
import { create } from "zustand";

export type User = {
  name: string;
  id: number;
  email: string;
  role: string;
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
      set({ user: data, loading: false });
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
    try {
      await api.post("/auth/logout");
    } finally {
      set({ user: null, loading: false });
    }
  },
}));
