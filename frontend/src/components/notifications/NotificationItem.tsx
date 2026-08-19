"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import {
  Bell,
  CheckCircle2,
  CircleAlert,
  CircleDollarSign,
  Package,
  ShoppingBag,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { UserNotification } from "@/types/notification";
import {
  formatRelativeTime,
  getNotificationCopy,
  getNotificationHref,
  getRelativeTimeValues,
} from "./notificationUtils";

const icons = {
  ORDER_CREATED: ShoppingBag,
  ORDER_STATUS_CHANGED: Bell,
  PAYMENT_SUCCESS: CircleDollarSign,
  PAYMENT_FAILED: CircleAlert,
  ORDER_SHIPPED: Package,
  ORDER_DELIVERED: CheckCircle2,
} as const;

type Props = {
  notification: UserNotification;
  onOpen?: (notification: UserNotification) => Promise<void> | void;
};

export default function NotificationItem({ notification, onOpen }: Props) {
  const t = useTranslations("notifications");
  const translate = t as unknown as (
    key: string,
    values?: Record<string, string | number>,
  ) => string;
  const locale = useLocale();
  const router = useRouter();
  const Icon = icons[notification.type] ?? Bell;
  const copy = getNotificationCopy(
    notification.type,
    translate,
    notification.entityId,
  );
  const timeKey = formatRelativeTime(notification.createdAt);
  const time = translate(
    `time.${timeKey}`,
    getRelativeTimeValues(notification.createdAt),
  );
  const href = getNotificationHref(
    notification.entityType,
    notification.entityId,
    locale,
  );

  const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    await onOpen?.(notification);
    router.push(href);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`flex gap-3 border-b border-border px-4 py-4 transition-colors last:border-b-0 hover:bg-muted/50 ${
        notification.isRead ? "bg-card" : "bg-primary/5"
      }`}
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-3">
          <span
            className={`text-sm ${notification.isRead ? "font-medium" : "font-semibold"}`}
          >
            {copy.title}
          </span>
          {!notification.isRead && (
            <span
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
              aria-label={t("unread")}
            />
          )}
        </span>
        <span className="mt-1 block text-sm text-muted-foreground">
          {copy.message}
        </span>
        <span className="mt-2 block text-xs text-muted-foreground">{time}</span>
      </span>
    </Link>
  );
}
