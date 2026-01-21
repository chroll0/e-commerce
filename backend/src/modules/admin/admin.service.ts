import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [products, categories, users, orders] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.category.count(),
      this.prisma.user.count(),
      this.prisma.order.count(),
    ]);

    return { products, categories, users, orders };
  }
}
