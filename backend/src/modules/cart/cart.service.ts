import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: number, dto: AddToCartDto) {
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { userId, productId: dto.productId },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + dto.quantity },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        userId,
        productId: dto.productId,
        quantity: dto.quantity,
      },
    });
  }

  async getCart(userId: number) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });
  }

  async updateCartItem(userId: number, itemId: number, dto: UpdateCartItemDto) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
    });
    if (!item || item.userId !== userId)
      throw new NotFoundException("Cart item not found");

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
    });
  }

  async removeCartItem(userId: number, itemId: number) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
    });
    if (!item || item.userId !== userId)
      throw new NotFoundException("Cart item not found");

    return this.prisma.cartItem.delete({ where: { id: itemId } });
  }
}
