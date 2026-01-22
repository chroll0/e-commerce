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
