"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/state/useNotificationStore";

const typeStyles = {
  success:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  error: "border-destructive/40 bg-destructive/10 text-destructive",
  info: "border-primary/30 bg-primary/10 text-primary",
} as const;

export default function NotificationCenter() {
  const items = useNotificationStore((s) => s.items);
  const remove = useNotificationStore((s) => s.remove);

  useEffect(() => {
    if (!items.length) return;

    const timers = items.map((item) =>
      setTimeout(() => {
        remove(item.id);
      }, 3500),
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [items, remove]);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-sm flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-md ${typeStyles[item.type]}`}
          role="status"
          aria-live="polite"
        >
          {item.message}
        </div>
      ))}
    </div>
  );
}
