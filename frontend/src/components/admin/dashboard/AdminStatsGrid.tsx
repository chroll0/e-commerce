"use client";

import { Locale } from "@/types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { api } from "@/lib/axios";

type Stats = {
  products: number;
  categories: number;
  users: number;
  orders: number;
};

const AdminStatsGrid: FC<{ locale: Locale }> = ({ locale }) => {
  const t = useTranslations("admin.dashboard");
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/admin/stats");
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
    },
    {
      key: "categories",
      title: t("stats.categories"),
      value: stats?.categories ?? "—",
      href: `/${locale}/admin/categories`,
    },
    {
      key: "users",
      title: t("stats.users"),
      value: stats?.users ?? "—",
      href: `/${locale}/admin/users`,
    },
    {
      key: "orders",
      title: t("stats.orders"),
      value: stats?.orders ?? "—",
      href: `/${locale}/admin/orders`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((x) => (
        <Link
          key={x.key}
          href={x.href}
          className="rounded-xl border border-border bg-card p-4 hover:bg-muted/30 transition"
        >
          <div className="text-xs text-muted-foreground">{x.title}</div>
          <div className="mt-2 text-2xl font-semibold">{x.value}</div>
          <div className="mt-3 text-xs text-muted-foreground text-end">
            {t("view")}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default AdminStatsGrid;
