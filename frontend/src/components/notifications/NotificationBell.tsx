"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Bell } from "lucide-react";
import { Button } from "@/components";
import { notificationApi } from "@/lib/notificationApi";
import { useAuthStore } from "@/state/useAuthStore";
import type { UserNotification } from "@/types/notification";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {
  const t = useTranslations("notifications");
  const locale = useLocale();
  const { user, loading: authLoading, fetchMe } = useAuthStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadNotifications = async () => {
    try {
      setError(false);
      const result = await notificationApi.list({ limit: 5 });
      setNotifications(result.notifications);
      setUnreadCount(result.unreadCount);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    void loadNotifications();
  }, [authLoading, user]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleOpen = async (notification: UserNotification) => {
    if (notification.isRead) return;

    try {
      await notificationApi.markAsRead(notification.id);
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, isRead: true } : item,
        ),
      );
      setUnreadCount((current) => Math.max(0, current - 1));
    } catch {
      return;
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!unreadCount) return;

    try {
      await notificationApi.markAllAsRead();
      setNotifications((current) =>
        current.map((item) => ({ ...item, isRead: true })),
      );
      setUnreadCount(0);
    } catch {
      setError(true);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="outline"
        size="sm"
        iconOnly
        className="relative"
        aria-label={t("open")}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          loading={loading}
          error={error}
          locale={locale}
          onOpen={handleOpen}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      )}
    </div>
  );
}
