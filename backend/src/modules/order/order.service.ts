import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { OrderStatus } from "@prisma/client";

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: number, dto: CreateOrderDto) {
    // 1. Take cart items
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException("Your cart is empty");
    }

    // 2. Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // 3. Create order
    const order = await this.prisma.order.create({
      data: {
        userId,
        total,
        address: dto.address,
        city: dto.city,
        phone: dto.phone,
        zip: dto.zip,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price, // price snapshot
          })),
        },
      },
      include: { items: true },
    });

    // 4. Clear cart
    await this.prisma.cartItem.deleteMany({ where: { userId } });

    return order;
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

  // Admin only: Change order status
  async updateStatus(orderId: number, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
