"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import type { UserNotification } from "@/types/notification";
import NotificationItem from "./NotificationItem";
import { Button } from "@/components";

type Props = {
  notifications: UserNotification[];
  unreadCount: number;
  loading: boolean;
  error: boolean;
  locale: string;
  onOpen: (notification: UserNotification) => void;
  onMarkAllAsRead: () => void;
};

export default function NotificationDropdown({
  notifications,
  unreadCount,
  loading,
  error,
  locale,
  onOpen,
  onMarkAllAsRead,
}: Props) {
  const t = useTranslations("notifications");

  return (
    <div className="absolute right-0 top-full z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            {t("title")}
          </h2>
          <p className="text-xs text-muted-foreground">
            {t("unreadCount", { count: unreadCount })}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="text"
          onClick={onMarkAllAsRead}
          disabled={!unreadCount || loading}
          className="text-xs font-medium text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("markAllAsRead")}
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3 p-4" aria-busy="true">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex gap-3">
              <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="px-4 py-8 text-center text-sm text-muted-foreground">
          {t("loadError")}
        </p>
      ) : notifications.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <div className="max-h-[min(28rem,70vh)] overflow-y-auto">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}

      <div className="border-t border-border px-4 py-3 text-center">
        <Link
          href={`/${locale}/account/notifications`}
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("viewAll")}
        </Link>
      </div>
    </div>
  );
}
