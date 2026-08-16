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

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    @Inject(PAYMENT_PROVIDER) private paymentProvider: PaymentProvider,
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

    if (order.payment) {
      return order.payment;
    }

    const payment = await this.prisma.payment.create({
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

    return this.prisma.payment.update({
      where: { id: payment.id },
      data: { transactionId },
    });
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

  async simulatePayment(
    userId: number,
    paymentId: string,
    dto: SimulatePaymentDto,
  ) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });

    if (!payment || payment.order.userId !== userId) {
      throw new NotFoundException("Payment not found");
    }

    if (payment.status !== "PENDING") {
      throw new BadRequestException("Payment is already finalized");
    }

    const nextPaymentStatus = this.paymentProvider.mapSimulationOutcome(
      dto.outcome,
    );
    const nextOrderStatus = this.mapOrderStatus(nextPaymentStatus);

    const [updatedPayment, updatedOrder] = await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: nextPaymentStatus },
      }),
      this.prisma.order.update({
        where: { id: payment.orderId },
        data: { status: nextOrderStatus },
      }),
    ]);

    return {
      message: "Payment processed",
      payment: updatedPayment,
      order: updatedOrder,
    };
  }

  private mapOrderStatus(paymentStatus: PaymentStatus): OrderStatus {
    if (paymentStatus === "SUCCESS") return "PAID";
    if (paymentStatus === "FAILED") return "PAYMENT_FAILED";
    return "CANCELLED";
  }
}
