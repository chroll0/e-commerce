import { api } from "@/lib/axios";
import type { ProductApi } from "@/types";

export type GetProductsParams = {
  search?: string;
  categoryId?: string | number;
  categorySlug?: string;
  locale?: string;
  limit?: number;
  labelId?: string | number;
};

export async function getProducts(params: GetProductsParams) {
  const search = (params.search ?? "").trim();

  const categoryId =
    params.categoryId == null || String(params.categoryId).trim() === ""
      ? undefined
      : Number(params.categoryId);

  const labelId =
    params.labelId == null || String(params.labelId).trim() === ""
      ? undefined
      : Number(params.labelId);

  const res = await api.get("/products", {
    params: {
      search: search || undefined,
      categoryId,
      categorySlug: params.categorySlug || undefined,
      locale: params.locale || undefined,
      limit: params.limit || undefined,
      labelId,
    },
  });

  return (res.data ?? []) as ProductApi[];
}
