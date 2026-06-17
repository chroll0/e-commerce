import { api } from "./axios";

export const cartApi = {
  getCart: async () => {
    const res = await api.get("/cart");
    return res.data;
  },

  addToCart: async (productId: number, quantity: number = 1) => {
    const res = await api.post("/cart", { productId, quantity });
    return res.data;
  },

  updateItem: async (id: number, quantity: number) => {
    const res = await api.patch(`/cart/${id}`, { quantity });
    return res.data;
  },

  removeItem: async (id: number) => {
    const res = await api.delete(`/cart/${id}`);
    return res.data;
  },

  syncCart: async (items: { productId: number; quantity: number }[]) => {
    const results = await Promise.all(
      items.map((item) => cartApi.addToCart(item.productId, item.quantity)),
    );
    return results;
  },
};
