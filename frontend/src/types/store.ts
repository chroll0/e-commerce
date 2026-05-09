import type { ProductApi } from "./product";

export type StoreApi = {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  banner?: string;
  rating?: number;
  sales: number;
  createdAt: string;
  updatedAt: string;
  products?: ProductApi[];
  _count: {
    products: number;
  };
};

export type StoreOption = {
  id: number;
  name: string;
};

export type StoreProps = StoreApi;
