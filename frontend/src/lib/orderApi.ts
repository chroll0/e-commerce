import { api } from "./axios";

export type CreateOrderPayload = {
  address: string;
  city: string;
  phone: string;
  zip?: string;
};

export const orderApi = {
  create: async (payload: CreateOrderPayload) => {
    const res = await api.post("/orders", payload);
    return res.data;
  },
};
