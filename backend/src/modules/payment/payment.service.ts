import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  // 1) create fake payment (ensure order belongs to user)
  async createPayment(userId: number, orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new NotFoundException("Order not found");
    if (order.userId !== userId) throw new NotFoundException("Order not found");

    return {
      paymentId: "fake_" + Date.now(),
      amount: order.total,
      currency: "USD",
      status: "PENDING",
    };
  }

  // 2) confirm fake payment → update order (ensure user owns order)
  async confirmPayment(userId: number, paymentId: string, orderId: number) {
    if (!paymentId.startsWith("fake_"))
      throw new NotFoundException("Invalid payment");

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order || order.userId !== userId)
      throw new NotFoundException("Order not found");

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    });

    return {
      message: "Payment confirmed",
      order: updated,
    };
  }
}
