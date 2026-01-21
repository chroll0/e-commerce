import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const since7 = daysAgo(7);
    const since30 = daysAgo(30);

    const [
      productsTotal,
      categoriesTotal,
      usersTotal,
      users7d,
      users30d,
      ordersTotal,
      orders7d,
      orders30d,
      paidTotalAgg,
      paid7dAgg,
      paid30dAgg,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.category.count(),

      this.prisma.user.count(),
      this.prisma.user.count({ where: { createdAt: { gte: since7 } } }),
      this.prisma.user.count({ where: { createdAt: { gte: since30 } } }),

      this.prisma.order.count(),
      this.prisma.order.count({ where: { createdAt: { gte: since7 } } }),
      this.prisma.order.count({ where: { createdAt: { gte: since30 } } }),

      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { status: "PAID" },
      }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { status: "PAID", createdAt: { gte: since7 } },
      }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { status: "PAID", createdAt: { gte: since30 } },
      }),
    ]);

    const totalAmount = Number(paidTotalAgg?._sum?.total ?? 0);
    const last7dAmount = Number(paid7dAgg?._sum?.total ?? 0);
    const last30dAmount = Number(paid30dAgg?._sum?.total ?? 0);

    return {
      products: productsTotal,
      categories: categoriesTotal,

      users: {
        total: usersTotal,
        last7d: users7d,
        last30d: users30d,
      },

      orders: {
        total: ordersTotal,
        last7d: orders7d,
        last30d: orders30d,
      },

      payments: {
        totalAmount,
        last7dAmount,
        last30dAmount,
      },
    };
  }
}
