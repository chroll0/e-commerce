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

export type GetStoreBySlugParams = {
  locale?: string;
  search?: string;
  categoryId?: string | number;
};

export async function getStoreBySlug(
  slug: string,
  params?: GetStoreBySlugParams,
) {
  const res = await api.get(`/stores/slug/${slug}`, {
    params: {
      locale: params?.locale || undefined,
      search: params?.search || undefined,
      categoryId: params?.categoryId || undefined,
    },
  });

  return res.data as StoreApi;
}
