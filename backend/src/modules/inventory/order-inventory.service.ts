import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class OrderInventoryService {
  async restoreOrderStock(tx: Prisma.TransactionClient, orderId: number) {
    const items = await tx.orderItem.findMany({
      where: { orderId },
      select: { productId: true, quantity: true },
      orderBy: { productId: "asc" },
    });

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }
  }

  async registerStoreSales(tx: Prisma.TransactionClient, orderId: number) {
    const items = await tx.orderItem.findMany({
      where: { orderId },
      select: {
        quantity: true,
        product: { select: { storeId: true } },
      },
    });

    const salesByStore = new Map<number, number>();

    for (const item of items) {
      const storeId = item.product.storeId;
      if (storeId === null) continue;

      salesByStore.set(
        storeId,
        (salesByStore.get(storeId) ?? 0) + item.quantity,
      );
    }

    for (const [storeId, quantity] of salesByStore) {
      await tx.store.update({
        where: { id: storeId },
        data: { sales: { increment: quantity } },
      });
    }
  }
}
