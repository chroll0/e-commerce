"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/axios";
import { useTranslations } from "next-intl";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Users, ShoppingBag, CreditCard } from "lucide-react";

type StatsResponse = {
  users: { total: number; last30d: number };
  orders: { total: number; last30d: number };
  payments: { totalAmount: number; last30dAmount: number };
};

type DonutEntry = {
  name: string;
  value: number;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    name?: string | number;
    value?: number | string;
  }>;
};

const COLORS = {
  active: "hsl(var(--primary))",
  muted: "hsl(var(--muted))",
};

function clampNonNeg(n: number) {
  return n < 0 ? 0 : n;
}

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(n);
}

function pct(part: number, total: number) {
  if (!total) return "0%";

  return `${Math.round((part / total) * 100)}%`;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const firstEntry = payload[0];

  const name = String(firstEntry?.name ?? "");
  const value = firstEntry?.value ?? 0;

  return (
    <div
      className="relative z-100 min-w-[100px] rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-xl"
      style={{
        borderLeftColor: COLORS.active,
        borderLeftWidth: 3,
      }}
    >
      <p className="font-medium text-foreground">{name}</p>

      <p className="mt-0.5 text-muted-foreground">{String(value)}</p>
    </div>
  );
}

function DonutCard({
  title,
  total,
  data,
  icon: Icon,
  formatValue = String,
  t,
}: {
  title: string;
  total: string | number;
  data: DonutEntry[];
  icon: FC<{ className?: string }>;
  formatValue?: (v: number) => string;
  t: ReturnType<typeof useTranslations<"admin.dashboard">>;
}) {
  const activeValue = data[0]?.value ?? 0;

  const totalValue = data.reduce((sum, entry) => sum + entry.value, 0);

  const hasData = totalValue > 0;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>

          <p className="text-xs text-muted-foreground">
            {t("charts.total")}: {total}
          </p>
        </div>
      </div>

      {/* Chart */}
      {hasData ? (
        <div className="relative">
          <ResponsiveContainer
            width="100%"
            height={160}
            className="overflow-visible"
          >
            <PieChart
              margin={{
                top: 10,
                right: 20,
                bottom: 10,
                left: 20,
              }}
            >
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={52}
                outerRadius={68}
                strokeWidth={0}
                paddingAngle={3}
                startAngle={90}
                endAngle={-270}
              >
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === 0 ? COLORS.active : COLORS.muted}
                    opacity={i === 0 ? 1 : 0.4}
                    style={{
                      transition: "opacity 400ms ease",
                    }}
                  />
                ))}
              </Pie>

              <Tooltip
                content={<CustomTooltip />}
                allowEscapeViewBox={{
                  x: true,
                  y: true,
                }}
                wrapperStyle={{
                  zIndex: 100,
                  outline: "none",
                }}
                cursor={false}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-foreground">
              {pct(activeValue, totalValue)}
            </span>

            <span className="text-xs text-muted-foreground">
              {t("charts.last30d")}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          {t("charts.noData")}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />

          <span className="text-xs text-muted-foreground">
            {t("charts.last30d")}
          </span>
        </div>

        <span className="text-sm font-semibold text-foreground">
          {formatValue(activeValue)}
        </span>
      </div>
    </div>
  );
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

  const donutUsers = useMemo(
    () => [
      {
        name: t("charts.last30d"),
        value: clampNonNeg(users30d),
      },
      {
        name: t("charts.before"),
        value: clampNonNeg(usersTotal - users30d),
      },
    ],
    [t, users30d, usersTotal],
  );

  const donutOrders = useMemo(
    () => [
      {
        name: t("charts.last30d"),
        value: clampNonNeg(orders30d),
      },
      {
        name: t("charts.before"),
        value: clampNonNeg(ordersTotal - orders30d),
      },
    ],
    [t, orders30d, ordersTotal],
  );

  const donutPayments = useMemo(
    () => [
      {
        name: t("charts.last30d"),
        value: clampNonNeg(paid30d),
      },
      {
        name: t("charts.before"),
        value: clampNonNeg(paidTotal - paid30d),
      },
    ],
    [t, paid30d, paidTotal],
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <DonutCard
        title={t("charts.usersLast30d")}
        total={usersTotal}
        data={donutUsers}
        icon={Users}
        t={t}
      />

      <DonutCard
        title={t("charts.ordersLast30d")}
        total={ordersTotal}
        data={donutOrders}
        icon={ShoppingBag}
        t={t}
      />

      <DonutCard
        title={t("charts.paymentsLast30d")}
        total={`₾${formatMoney(paidTotal)}`}
        data={donutPayments}
        icon={CreditCard}
        t={t}
        formatValue={(v) => `₾${formatMoney(v)}`}
      />
    </div>
  );
};

export default AdminDonutStats;
