import { api } from "./axios";
import type {
  NotificationResponse,
  UserNotification,
} from "@/types/notification";

export const notificationApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
    unread?: boolean;
  }) => {
    const { data } = await api.get<NotificationResponse>("/notifications", {
      params,
    });
    return data;
  },

  markAsRead: async (id: string) => {
    const { data } = await api.patch<UserNotification>(
      `/notifications/${id}/read`,
    );
    return data;
  },

  markAllAsRead: async () => {
    const { data } = await api.patch<{ updatedCount: number }>(
      "/notifications/read-all",
    );
    return data;
  },
};
