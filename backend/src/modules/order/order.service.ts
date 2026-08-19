import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { OrderStatus } from "@prisma/client";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async createOrder(userId: number, dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      const cartItems = await tx.cartItem.findMany({
        where: { userId },
        include: { product: true },
      });

      if (cartItems.length === 0) {
        throw new BadRequestException("Your cart is empty");
      }

      const total = cartItems.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
      }, 0);

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
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
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
        user: true,
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
        select: { id: true, userId: true, status: true },
      });

      if (!existingOrder) {
        throw new NotFoundException("Order not found");
      }

      const order = await tx.order.update({
        where: { id: orderId },
        data: { status },
      });

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
        user: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
