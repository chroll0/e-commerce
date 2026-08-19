import { Injectable, NotFoundException } from "@nestjs/common";
import { NotificationType, Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

export type CreateNotificationInput = {
  userId: number;
  type: NotificationType;
  eventKey: string;
  entityType?: string;
  entityId?: string;
  metadata?: Prisma.InputJsonValue;
};

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async createIfAbsent(
    client: PrismaService | Prisma.TransactionClient,
    input: CreateNotificationInput,
  ) {
    return client.notification.upsert({
      where: { eventKey: input.eventKey },
      update: {},
      create: {
        userId: input.userId,
        type: input.type,
        eventKey: input.eventKey,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: input.metadata,
      },
    });
  }

  async list(userId: number, page: number, limit: number, unread?: boolean) {
    const where = {
      userId,
      ...(unread === undefined ? {} : { isRead: unread }),
    };
    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return {
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async markAsRead(userId: number, id: string) {
    const result = await this.prisma.notification.updateMany({
      where: { id, userId, isRead: false },
      data: { isRead: true },
    });

    if (result.count === 0) {
      const notification = await this.prisma.notification.findFirst({
        where: { id, userId },
        select: { id: true },
      });

      if (!notification) {
        throw new NotFoundException("Notification not found");
      }
    }

    return this.prisma.notification.findFirstOrThrow({
      where: { id, userId },
    });
  }

  async markAllAsRead(userId: number) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return { updatedCount: result.count };
  }
}
