import { api } from "@/lib/axios";
import type { ProductLabelApi } from "@/types";

export async function getLabels() {
  const res = await api.get("/labels");
  return (res.data ?? []) as ProductLabelApi[];
}

export type CreateLabelPayload = {
  slug: string;
  nameEn: string;
  nameKa: string;
};

export async function createLabel(payload: CreateLabelPayload) {
  const res = await api.post("/admin/labels", payload);
  return res.data as ProductLabelApi;
}

export async function deleteLabel(id: number) {
  await api.delete(`/admin/labels/${id}`);
}

export async function setProductLabels(productId: number, labelIds: number[]) {
  const res = await api.patch(`/admin/products/${productId}/labels`, {
    labelIds,
  });
  return res.data;
}
