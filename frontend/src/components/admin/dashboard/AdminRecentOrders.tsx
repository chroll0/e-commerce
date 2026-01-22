"use client";

import { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Locale } from "@/types";

type Props = {
  locale: Locale;
  orders: {
    id: number;
    total: number;
    status: string;
    createdAt: string;
    user: { email: string } | null;
  }[];
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}

function statusBadgeClass(status: string) {
  const s = status.toUpperCase();
  if (s === "PAID")
    return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  if (s === "PENDING")
    return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  if (s === "CANCELED" || s === "CANCELLED")
    return "bg-zinc-500/10 text-zinc-600 border-zinc-500/20";
  return "bg-destructive/10 text-destructive border-destructive/20";
}

const AdminRecentOrders: FC<Props> = ({ locale, orders }) => {
  const t = useTranslations("admin.dashboard");

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{t("widgets.recentOrders")}</div>
        <Link
          href={`/${locale}/admin/orders`}
          className="text-xs text-muted-foreground hover:underline"
        >
          {t("view")}
        </Link>
      </div>

      <div className="mt-3 space-y-2">
        {orders.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            {t("widgets.empty")}
          </div>
        ) : (
          orders.map((o) => (
            <div
              key={o.id}
              className="rounded-lg border border-border/60 bg-background/40 px-3 py-2"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">
                    #{o.id} • {o.user?.email ?? "—"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(o.createdAt)}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${statusBadgeClass(
                      o.status,
                    )}`}
                  >
                    {o.status}
                  </span>
                  <span className="text-sm font-semibold">{o.total}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminRecentOrders;
