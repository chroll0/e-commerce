import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { OrderStatus } from "@prisma/client";
import { NotificationService } from "../notification/notification.service";
import { safeUserSelect } from "../user/user.select";
import { OrderInventoryService } from "../inventory/order-inventory.service";

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly orderInventoryService: OrderInventoryService,
  ) {}

  async createOrder(userId: number, dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      const cartItems = await tx.cartItem.findMany({
        where: { userId },
        select: { productId: true, quantity: true },
      });

      if (cartItems.length === 0) {
        throw new BadRequestException("Your cart is empty");
      }

      const reservedItems = [];

      // Reserve products in a stable order to reduce deadlock risk for multi-item orders.
      for (const item of [...cartItems].sort(
        (first, second) => first.productId - second.productId,
      )) {
        const reservation = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: { gte: item.quantity },
          },
          data: { stock: { decrement: item.quantity } },
        });

        if (reservation.count !== 1) {
          throw new BadRequestException({
            code: "INSUFFICIENT_STOCK",
            message: `Insufficient stock for product ${item.productId}`,
            productId: item.productId,
          });
        }

        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { price: true },
        });

        if (!product) {
          throw new NotFoundException("Product not found");
        }

        reservedItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
      }

      const total = reservedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const order = await tx.order.create({
        data: {
          userId,
          total,
          status: "PENDING",
          address: dto.address,
          city: dto.city,
          phone: dto.phone,
          zip: dto.zip,
          items: {
            create: reservedItems,
          },
        },
        include: { items: true },
      });

      await this.notificationService.createIfAbsent(tx, {
        userId,
        type: "ORDER_CREATED",
        eventKey: `ORDER_CREATED:${order.id}`,
        entityType: "ORDER",
        entityId: String(order.id),
      });

      await tx.cartItem.deleteMany({ where: { userId } });

      return order;
    });
  }

  // Get all orders of the current user
  async getMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  // Get single order
  async getOrderById(userId: number, orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException("Order not found");
    }

    return order;
  }

  async getAdminOrderById(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: safeUserSelect },
        items: { include: { product: { include: { translations: true } } } },
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    return order;
  }

  // Admin only: Change order status
  async updateStatus(orderId: number, status: OrderStatus) {
    return this.prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          userId: true,
          status: true,
          payment: { select: { status: true } },
        },
      });

      if (!existingOrder) {
        throw new NotFoundException("Order not found");
      }

      const isAllowedTransition =
        status === existingOrder.status ||
        (existingOrder.status === "PENDING" &&
          ["PAID", "PAYMENT_FAILED", "CANCELLED"].includes(status)) ||
        (existingOrder.status === "PAID" && status === "SHIPPED") ||
        (["PENDING", "PAYMENT_FAILED", "PAID"].includes(existingOrder.status) &&
          status === "CANCELLED");

      if (!isAllowedTransition) {
        throw new BadRequestException("Invalid order status transition");
      }

      if (
        status === "PAID" &&
        (!existingOrder.payment ||
          !["PENDING", "SUCCESS"].includes(existingOrder.payment.status))
      ) {
        throw new BadRequestException("Order payment is not successful");
      }

      if (status === "SHIPPED" && existingOrder.status !== "PAID") {
        throw new BadRequestException("Only paid orders can be shipped");
      }

      if (
        status === "PAYMENT_FAILED" &&
        (!existingOrder.payment ||
          !["PENDING", "FAILED"].includes(existingOrder.payment.status))
      ) {
        throw new BadRequestException("Order payment cannot be marked failed");
      }

      const order = await tx.order.update({
        where: { id: orderId },
        data: { status },
      });

      if (existingOrder.payment?.status === "PENDING") {
        const paymentStatus =
          status === "PAID"
            ? "SUCCESS"
            : status === "PAYMENT_FAILED"
              ? "FAILED"
              : status === "CANCELLED"
                ? "CANCELLED"
                : null;

        if (paymentStatus) {
          await tx.payment.updateMany({
            where: { orderId, status: "PENDING" },
            data: { status: paymentStatus },
          });
        }
      }

      if (
        existingOrder.status === "PENDING" &&
        (status === "PAYMENT_FAILED" || status === "CANCELLED")
      ) {
        await this.orderInventoryService.restoreOrderStock(tx, orderId);
      }

      if (existingOrder.status === "PENDING" && status === "PAID") {
        await this.orderInventoryService.registerStoreSales(tx, orderId);
      }

      if (existingOrder.status !== status) {
        const type =
          status === "SHIPPED" ? "ORDER_SHIPPED" : "ORDER_STATUS_CHANGED";

        await this.notificationService.createIfAbsent(tx, {
          userId: existingOrder.userId,
          type,
          eventKey:
            type === "ORDER_STATUS_CHANGED"
              ? `ORDER_STATUS_CHANGED:${orderId}:${status}`
              : `${type}:${orderId}`,
          entityType: "ORDER",
          entityId: String(orderId),
          metadata: { status },
        });
      }

      return order;
    });
  }

  // Admin: get all orders
  async getAllOrders() {
    return this.prisma.order.findMany({
      include: {
        items: { include: { product: true } },
        user: { select: safeUserSelect },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
