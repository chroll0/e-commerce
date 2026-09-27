import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { calculateStoreRating } from "./store-rating.util";

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
      await this.recalculateStoreRating(tx, storeId);
    }
  }

  async recalculateStoreRating(tx: Prisma.TransactionClient, storeId: number) {
    const store = await tx.store.findUnique({
      where: { id: storeId },
      select: {
        sales: true,
        _count: { select: { products: true } },
      },
    });

    if (!store) return;

    const rating = calculateStoreRating(store._count.products, store.sales);

    await tx.store.update({
      where: { id: storeId },
      data: { rating },
    });
  }
}
