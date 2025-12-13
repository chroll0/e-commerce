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
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  login: async (email, password) => {
    await api.post("/auth/login", { email, password });
    await useAuthStore.getState().fetchMe();
  },

  logout: async () => {
    await api.post("/auth/logout");
    set({ user: null });
  },
}));
