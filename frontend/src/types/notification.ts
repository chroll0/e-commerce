export type NotificationType =
  | "ORDER_CREATED"
  | "ORDER_STATUS_CHANGED"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "ORDER_SHIPPED"
  | "ORDER_DELIVERED";

export type UserNotification = {
  id: string;
  userId: number;
  type: NotificationType;
  eventKey: string;
  entityType: string | null;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NotificationResponse = {
  notifications: UserNotification[];
  unreadCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
