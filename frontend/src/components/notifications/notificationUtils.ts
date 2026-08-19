import type { NotificationType } from "@/types/notification";

export function getNotificationCopy(
  type: NotificationType,
  t: (key: string, values?: Record<string, string | number>) => string,
  entityId?: string | null,
) {
  const orderId = entityId ?? "";

  return {
    title: t(`types.${type}.title`),
    message: t(`types.${type}.message`, { orderId }),
  };
}

export function getNotificationHref(
  entityType: string | null,
  entityId: string | null,
  locale: string,
) {
  if (entityType === "ORDER" && entityId) {
    return `/${locale}/account/orders?orderId=${entityId}`;
  }

  return `/${locale}/account/notifications`;
}

export function formatRelativeTime(dateString: string, now = Date.now()) {
  const timestamp = new Date(dateString).getTime();
  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000));

  if (seconds < 60) return "justNow";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return "minutes";
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return "hours";
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  return "days";
}

export function getRelativeTimeValues(
  dateString: string,
  now = Date.now(),
): Record<string, string | number> {
  const timestamp = new Date(dateString).getTime();
  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000));
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return {};
  if (minutes < 60) return { count: minutes };
  if (hours < 24) return { count: hours };
  if (days === 1) return {};
  return { count: days };
}
