import { create } from "zustand";

export type NotificationType = "success" | "error" | "info";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  message: string;
};

type NotificationState = {
  items: NotificationItem[];
  push: (type: NotificationType, message: string) => void;
  remove: (id: string) => void;
};

const createId = () =>
  `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const useNotificationStore = create<NotificationState>((set) => ({
  items: [],
  push: (type, message) => {
    const next: NotificationItem = { id: createId(), type, message };
    set((state) => ({ items: [...state.items, next] }));
  },
  remove: (id) => {
    set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
  },
}));
