"use client";

import { Locale } from "@/types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { api } from "@/lib/axios";
import {
  Package,
  FolderTree,
  Users,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react";

type Stats = {
  products: number;
  categories: number;
  users: { total: number; last7d: number; last30d: number };
  orders: { total: number; last7d: number; last30d: number };
  payments: {
    totalAmount: number;
    last7dAmount: number;
    last30dAmount: number;
  };
};

const AdminStatsGrid: FC<{ locale: Locale }> = ({ locale }) => {
  const t = useTranslations("admin.dashboard");
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.get<Stats>("/admin/stats");
      setStats(res.data);
    };

    load();
  }, []);

  const items = [
    {
      key: "products",
      title: t("stats.products"),
      value: stats?.products ?? "—",
      href: `/${locale}/admin/products`,
      icon: Package,
    },
    {
      key: "categories",
      title: t("stats.categories"),
      value: stats?.categories ?? "—",
      href: `/${locale}/admin/categories`,
      icon: FolderTree,
    },
    {
      key: "users",
      title: t("stats.users"),
      value: stats?.users?.total ?? "—",
      href: `/${locale}/admin/users`,
      icon: Users,
    },
    {
      key: "orders",
      title: t("stats.orders"),
      value: stats?.orders?.total ?? "—",
      href: `/${locale}/admin/orders`,
      icon: ShoppingBag,
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.key}
            href={item.href}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/20 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary/15">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground/70">
                    {t("view")}
                  </p>
                </div>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all duration-200 group-hover:bg-primary/10 group-hover:text-primary">
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </div>

            {/* Value */}
            <div className="mt-6">
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {item.value}
              </span>
            </div>

            {/* Bottom accent */}
            <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/3 rounded-full bg-primary/70 transition-all duration-300 group-hover:w-full" />
            </div>

            {/* Subtle hover glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-opacity duration-200 group-hover:bg-primary/10" />
          </Link>
        );
      })}
    </div>
  );
};

export default AdminStatsGrid;
