import { api } from "@/lib/axios";
import type { StoreApi } from "@/types";

export async function getStores() {
  const res = await api.get("/stores");
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
