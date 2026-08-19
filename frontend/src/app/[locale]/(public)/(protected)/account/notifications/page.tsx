"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Bell, CheckCheck } from "lucide-react";
import { AccountHeader, Button } from "@/components";
import { notificationApi } from "@/lib/notificationApi";
import type { UserNotification } from "@/types/notification";
import NotificationItem from "@/components/notifications/NotificationItem";

export default function NotificationsPage() {
  const t = useTranslations("notifications");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(false);
        const result = await notificationApi.list({
          page,
          limit: 20,
          unread: filter === "unread" ? true : undefined,
        });
        if (!active) return;
        setNotifications(result.notifications);
        setUnreadCount(result.unreadCount);
        setTotalPages(result.pagination.totalPages || 1);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [filter, page]);

  const handleFilterChange = (nextFilter: "all" | "unread") => {
    setFilter(nextFilter);
    setPage(1);
  };

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
      setError(true);
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
    <div className="mx-auto w-full max-w-6xl py-10">
      <AccountHeader
        title={t("title")}
        description={t("description")}
        action={
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            disabled={!unreadCount || loading}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            {t("markAllAsRead")}
          </Button>
        }
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-lg border border-border p-1">
          {(["all", "unread"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleFilterChange(value)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                filter === value
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {t(`filters.${value}`)}
            </button>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {t("unreadCount", { count: unreadCount })}
        </span>
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        {loading ? (
          <div className="space-y-4 p-6" aria-busy="true">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            <p>{t("loadError")}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Bell className="h-5 w-5" />
            </span>
            <p className="text-lg font-medium text-foreground">
              {filter === "unread" ? t("caughtUp") : t("empty")}
            </p>
          </div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onOpen={handleOpen}
              />
            ))}
          </div>
        )}
      </section>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setPage((current) => current - 1)}
            disabled={page === 1 || loading}
          >
            {t("previous")}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t("page", { page, totalPages })}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((current) => current + 1)}
            disabled={page >= totalPages || loading}
          >
            {t("next")}
          </Button>
        </div>
      )}
    </div>
  );
}
