export type DashboardResponse = {
  recentOrders: {
    id: number;
    total: number;
    status: string;
    createdAt: string;
    user: { id: number; email: string } | null;
  }[];
  lowStock: { id: number; slug: string; title: string; stock: number }[];
  ordersByStatus30d: { status: string; count: number }[];
};

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PAYMENT_FAILED"
  | "SHIPPED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";

export type AdminOrderItem = {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  variant: string | null;
  product: {
    id: number;
    slug: string;
    images: string[];
    translations: { locale: string; title: string }[];
  };
};

export type AdminPayment = {
  id: string;
  orderId: number;
  amount: number;
  status: PaymentStatus;
  provider: string;
  transactionId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminOrder = {
  id: number;
  total: number;
  status: OrderStatus;
  address: string;
  city: string;
  zip: string | null;
  phone: string;
  createdAt: string;
  updatedAt: string;
  user: { id: number; name: string; email: string; phone: string | null };
  items: AdminOrderItem[];
  payment: AdminPayment | null;
};

export type AdminPaymentRecord = AdminPayment & {
  order: {
    id: number;
    status: OrderStatus;
    total: number;
    createdAt: string;
    user: { id: number; name: string; email: string; phone: string | null };
  };
};
