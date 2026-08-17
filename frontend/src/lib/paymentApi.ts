import { api } from "./axios";
import type { AdminPaymentRecord } from "@/types";

export type PaymentOutcome = "SUCCESS" | "FAILED" | "CANCELLED";

export const paymentApi = {
  create: async (orderId: number) => {
    const res = await api.post(`/payments/${orderId}/create`);
    return res.data;
  },

  simulate: async (paymentId: string, outcome: PaymentOutcome) => {
    const res = await api.post(`/payments/${paymentId}/simulate`, { outcome });
    return res.data;
  },

  getById: async (paymentId: string) => {
    const res = await api.get(`/payments/${paymentId}`);
    return res.data;
  },

  getAllForAdmin: async (): Promise<AdminPaymentRecord[]> => {
    const res = await api.get("/payments/admin");
    return res.data;
  },
};
