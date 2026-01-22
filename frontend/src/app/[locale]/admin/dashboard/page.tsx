"use client";

import {
  AdminDonutStats,
  AdminPageHeader,
  AdminQuickActions,
  AdminStatsGrid,
  AdminRecentOrders,
  AdminLowStock,
  AdminOrdersStatusDonut,
} from "@/components";

import { DashboardResponse, Locale } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

const AdminDashboard = () => {
  const locale = useLocale() as Locale;
  const t = useTranslations("admin.dashboard");

  const [dash, setDash] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.get<DashboardResponse>("/admin/dashboard", {
        params: { locale },
      });
      setDash(res.data);
    };
    load();
  }, [locale]);

  return (
    <>
      <AdminPageHeader title={t("welcome")} description={t("overview")} />

      <div className="mt-6 space-y-6">
        <AdminStatsGrid locale={locale} />
        <AdminDonutStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <AdminRecentOrders
            locale={locale}
            orders={dash?.recentOrders ?? []}
          />
          <AdminLowStock locale={locale} items={dash?.lowStock ?? []} />
          <AdminOrdersStatusDonut data={dash?.ordersByStatus30d ?? []} />
        </div>

        <AdminQuickActions locale={locale} />
      </div>
    </>
  );
};

export default AdminDashboard;
