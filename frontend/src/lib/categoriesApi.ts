import { api } from "./axios";
import type { Category } from "@/types";

export async function getCategoriesClient(locale: string) {
  const res = await api.get("/categories", {
    params: { locale },
  });

  const categories = res.data as Category[];

  return categories.filter((cat) => cat.parentId === null);
}

export async function getCategoryBySlug(slug: string, locale: string) {
  const res = await api.get(`/categories/slug/${encodeURIComponent(slug)}`, {
    params: { locale },
  });

  return (res.data ?? null) as Category | null;
}
