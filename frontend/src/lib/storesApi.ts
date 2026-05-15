import { api } from "./axios";
import type { StoreApi } from "@/types";

export type GetStoresParams = {
  search?: string;
  limit?: number;
  sort?: "sales" | "rating" | "newest";
};

export async function getStores(params?: GetStoresParams) {
  const res = await api.get("/stores", {
    params: {
      search: params?.search || undefined,
      limit: params?.limit || undefined,
      sort: params?.sort || undefined,
    },
  });

  return (res.data ?? []) as StoreApi[];
}

export async function getBestStores(limit: number = 10) {
  const res = await api.get("/stores/best", {
    params: { limit },
  });
  return (res.data ?? []) as StoreApi[];
}

export async function getStoreBySlug(slug: string) {
  const res = await api.get(`/stores/slug/${slug}`);
  return res.data as StoreApi;
}
