import { api } from "@/lib/axios";
import type { ProductApi } from "@/types";

export type GetProductsParams = {
  search?: string;
  categoryId?: string | number;
  categorySlug?: string;
  locale?: string;
  limit?: number;
};

export async function getProducts(params: GetProductsParams) {
  const search = (params.search ?? "").trim();

  const categoryId =
    params.categoryId == null || String(params.categoryId).trim() === ""
      ? undefined
      : Number(params.categoryId);

  const res = await api.get("/products", {
    params: {
      search: search || undefined,
      categoryId,
      categorySlug: params.categorySlug || undefined,
      locale: params.locale || undefined,
      limit: params.limit || undefined,
    },
  });

  return (res.data ?? []) as ProductApi[];
}
