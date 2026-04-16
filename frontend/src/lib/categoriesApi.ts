import { api } from "./axios";

export async function getCategoriesClient(locale: string) {
  const res = await api.get("/categories", {
    params: { locale },
  });

  return res.data;
}
