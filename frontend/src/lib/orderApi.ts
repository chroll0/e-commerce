import { api } from "./axios";
import type { AdminOrder, OrderStatus } from "@/types";

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

  getAllForAdmin: async (): Promise<AdminOrder[]> => {
    const res = await api.get("/orders/admin");
    return res.data;
  },

  getByIdForAdmin: async (orderId: number): Promise<AdminOrder> => {
    const res = await api.get(`/orders/admin/${orderId}`);
    return res.data;
  },

  updateStatus: async (
    orderId: number,
    status: OrderStatus,
  ): Promise<AdminOrder> => {
    const res = await api.patch(`/orders/${orderId}/status`, { status });
    return res.data;
  },
};
