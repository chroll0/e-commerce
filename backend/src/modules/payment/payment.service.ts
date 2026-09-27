import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { SimulatePaymentDto } from "./dto/simulate-payment.dto";
import {
  PAYMENT_PROVIDER,
  PaymentProvider,
} from "./providers/payment-provider.interface";
import { NotificationService } from "../notification/notification.service";
import { OrderInventoryService } from "../inventory/order-inventory.service";
import { safeUserSelect } from "../user/user.select";

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    @Inject(PAYMENT_PROVIDER) private paymentProvider: PaymentProvider,
    private readonly notificationService: NotificationService,
    private readonly orderInventoryService: OrderInventoryService,
  ) {}

  async createPayment(userId: number, orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) throw new NotFoundException("Order not found");
    if (order.userId !== userId) throw new NotFoundException("Order not found");
    if (order.status === "PAID") {
      throw new BadRequestException("Order is already paid");
    }

    if (order.status !== "PENDING") {
      throw new BadRequestException("Order is not awaiting payment");
    }

    if (order.payment) {
      return order.payment;
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const payment = await tx.payment.create({
          data: {
            orderId: order.id,
            amount: order.total,
            provider: this.paymentProvider.providerName,
            status: "PENDING",
          },
        });

        const transactionId = await this.paymentProvider.createTransactionId(
          payment.id,
        );

        return tx.payment.update({
          where: { id: payment.id },
          data: { transactionId },
        });
      });
    } catch (error) {
      await this.cancelPendingOrderAndRestoreStock(userId, orderId);
      throw error;
    }
  }

  async getPayment(userId: number, paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });

    if (!payment || payment.order.userId !== userId) {
      throw new NotFoundException("Payment not found");
    }

    return payment;
  }

  async getAllPayments() {
    return this.prisma.payment.findMany({
      include: {
        order: {
          include: {
            user: { select: safeUserSelect },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async simulatePayment(
    userId: number,
    paymentId: string,
    dto: SimulatePaymentDto,
  ) {
    const nextPaymentStatus = this.paymentProvider.mapSimulationOutcome(
      dto.outcome,
    );
    const nextOrderStatus = this.mapOrderStatus(nextPaymentStatus);

    const result = await this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: { order: true },
      });

      if (!payment || payment.order.userId !== userId) {
        throw new NotFoundException("Payment not found");
      }

      if (payment.status !== "PENDING" || payment.order.status !== "PENDING") {
        throw new BadRequestException("Payment is already finalized");
      }

      const paymentUpdate = await tx.payment.updateMany({
        where: { id: payment.id, status: "PENDING" },
        data: { status: nextPaymentStatus },
      });

      if (paymentUpdate.count !== 1) {
        throw new BadRequestException("Payment is already finalized");
      }

      const orderUpdate = await tx.order.updateMany({
        where: {
          id: payment.orderId,
          userId,
          status: "PENDING",
        },
        data: { status: nextOrderStatus },
      });

      if (orderUpdate.count !== 1) {
        throw new BadRequestException("Order is no longer awaiting payment");
      }

      if (nextPaymentStatus === "SUCCESS") {
        await this.orderInventoryService.registerStoreSales(
          tx,
          payment.orderId,
        );
      } else {
        await this.orderInventoryService.restoreOrderStock(tx, payment.orderId);
      }

      const updatedPayment = await tx.payment.findUniqueOrThrow({
        where: { id: payment.id },
      });
      const updatedOrder = await tx.order.findUniqueOrThrow({
        where: { id: payment.orderId },
      });

      const notificationType =
        nextPaymentStatus === "SUCCESS"
          ? "PAYMENT_SUCCESS"
          : nextPaymentStatus === "FAILED"
            ? "PAYMENT_FAILED"
            : null;

      if (notificationType) {
        await this.notificationService.createIfAbsent(tx, {
          userId,
          type: notificationType,
          eventKey: `${notificationType}:${payment.id}`,
          entityType: "ORDER",
          entityId: String(payment.orderId),
          metadata: { paymentId: payment.id },
        });
      }

      return { updatedPayment, updatedOrder };
    });

    return {
      message: "Payment processed",
      payment: result.updatedPayment,
      order: result.updatedOrder,
    };
  }

  private async cancelPendingOrderAndRestoreStock(
    userId: number,
    orderId: number,
  ) {
    await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { id: orderId, userId, status: "PENDING", payment: null },
        select: { id: true },
      });

      if (!order) return;

      await tx.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" },
      });
      await this.orderInventoryService.restoreOrderStock(tx, order.id);
    });
  }

  private mapOrderStatus(paymentStatus: PaymentStatus): OrderStatus {
    if (paymentStatus === "SUCCESS") return "PAID";
    if (paymentStatus === "FAILED") return "PAYMENT_FAILED";
    return "CANCELLED";
  }
}
