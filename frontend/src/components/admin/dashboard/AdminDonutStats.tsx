"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/axios";
import { useTranslations } from "next-intl";
import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts";

type StatsResponse = {
  users: { total: number; last30d: number };
  orders: { total: number; last30d: number };
  payments: { totalAmount: number; last30dAmount: number };
};

function clampNonNeg(n: number) {
  return n < 0 ? 0 : n;
}

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
}

const AdminDonutStats: FC = () => {
  const t = useTranslations("admin.dashboard");
  const [stats, setStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.get<StatsResponse>("/admin/stats");
      setStats(res.data);
    };
    load();
  }, []);

  const usersTotal = stats?.users?.total ?? 0;
  const users30d = stats?.users?.last30d ?? 0;

  const ordersTotal = stats?.orders?.total ?? 0;
  const orders30d = stats?.orders?.last30d ?? 0;

  const paidTotal = stats?.payments?.totalAmount ?? 0;
  const paid30d = stats?.payments?.last30dAmount ?? 0;

  const donutUsers30d = useMemo(
    () => [
      { name: t("charts.last30d"), value: clampNonNeg(users30d) },
      { name: t("charts.before"), value: clampNonNeg(usersTotal - users30d) },
    ],
    [t, users30d, usersTotal],
  );

  const donutOrders30d = useMemo(
    () => [
      { name: t("charts.last30d"), value: clampNonNeg(orders30d) },
      { name: t("charts.before"), value: clampNonNeg(ordersTotal - orders30d) },
    ],
    [t, orders30d, ordersTotal],
  );

  const donutPayments30d = useMemo(
    () => [
      { name: t("charts.last30d"), value: clampNonNeg(paid30d) },
      { name: t("charts.before"), value: clampNonNeg(paidTotal - paid30d) },
    ],
    [t, paid30d, paidTotal],
  );

  const renderDonut = (data: { name: string; value: number }[]) => (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={75}
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-sm font-medium">{t("charts.usersLast30d")}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          {t("charts.total")}: {usersTotal}
        </div>
        <div className="mt-3">{renderDonut(donutUsers30d)}</div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-sm font-medium">{t("charts.ordersLast30d")}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          {t("charts.total")}: {ordersTotal}
        </div>
        <div className="mt-3">{renderDonut(donutOrders30d)}</div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-sm font-medium">{t("charts.paymentsLast30d")}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          {t("charts.total")}: {formatMoney(paidTotal)}
        </div>
        <div className="mt-3">{renderDonut(donutPayments30d)}</div>
      </div>
    </div>
  );
};

export default AdminDonutStats;
