"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { useTranslations } from "next-intl";
import { ShoppingBag } from "lucide-react";

type Props = {
  data: { status: string; count: number }[];
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

const STATUS_COLORS: Record<string, string> = {
  PENDING: "hsl(var(--secondary))",
  PENDING_PAYMENT: "hsl(var(--secondary))",
  PAID: "hsl(var(--primary))",
  PROCESSING: "hsl(var(--primary))",
  SHIPPED: "hsl(var(--muted-foreground))",
  DELIVERED: "hsl(var(--muted-foreground))",
  COMPLETED: "hsl(var(--primary))",
  FAILED: "hsl(var(--destructive))",
  PAYMENT_FAILED: "hsl(var(--destructive))",
  CANCELLED: "hsl(var(--destructive))",
};

const FALLBACK_COLOR = "hsl(var(--muted-foreground))";

function getStatusColor(status: string) {
  return STATUS_COLORS[status.toUpperCase()] ?? FALLBACK_COLOR;
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
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
  const color = getStatusColor(name);

  return (
    <div
      className="relative z-100 min-w-[100px] rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-xl"
      style={{
        borderLeftColor: color,
        borderLeftWidth: 3,
      }}
    >
      <p className="font-medium text-foreground">{formatStatus(name)}</p>

      <p className="mt-0.5 text-muted-foreground">{String(value)} orders</p>
    </div>
  );
}

function getLocalizedStatus(
  status: string,
  t: ReturnType<typeof useTranslations<"admin.dashboard">>,
) {
  const normalized = status.toLowerCase().replace(/\s+/g, "_");

  const labels: Record<string, string> = {
    pending: t("charts.statuses.pending"),
    pending_payment: t("charts.statuses.pendingPayment"),
    paid: t("charts.statuses.paid"),
    processing: t("charts.statuses.processing"),
    shipped: t("charts.statuses.shipped"),
    delivered: t("charts.statuses.delivered"),
    completed: t("charts.statuses.completed"),
    failed: t("charts.statuses.failed"),
    payment_failed: t("charts.statuses.paymentFailed"),
    cancelled: t("charts.statuses.cancelled"),
  };

  return labels[normalized] ?? formatStatus(status);
}

const AdminOrdersStatusDonut: FC<Props> = ({ data }) => {
  const t = useTranslations("admin.dashboard");

  const donut = useMemo<DonutEntry[]>(
    () =>
      [...(data ?? [])]
        .map((item) => ({
          name: item.status,
          value: Math.max(0, item.count),
        }))
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value),
    [data],
  );

  const total = useMemo(
    () => donut.reduce((sum, item) => sum + item.value, 0),
    [donut],
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [donut.length]);

  useEffect(() => {
    if (donut.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % donut.length);
    }, 10_000);

    return () => window.clearInterval(interval);
  }, [donut.length]);

  const activeEntry = donut[activeIndex];
  const activeValue = activeEntry?.value ?? 0;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShoppingBag className="h-4 w-4" />
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">
            {t("widgets.ordersByStatus30d")}
          </p>

          <p className="text-xs text-muted-foreground">
            {t("charts.total")}: {total}
          </p>
        </div>
      </div>

      {/* Chart + animated center */}
      {total > 0 ? (
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
                data={donut}
                dataKey="value"
                nameKey="name"
                innerRadius={52}
                outerRadius={68}
                strokeWidth={0}
                paddingAngle={3}
                startAngle={90}
                endAngle={-270}
              >
                {donut.map((entry, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <Cell
                      key={entry.name}
                      fill={getStatusColor(entry.name)}
                      opacity={isActive ? 1 : 0.4}
                      style={{
                        transition: "opacity 500ms ease, filter 500ms ease",
                        filter: isActive
                          ? `drop-shadow(0 0 6px ${getStatusColor(entry.name)})`
                          : "none",
                      }}
                    />
                  );
                })}
              </Pie>

              <Tooltip
                content={<CustomTooltip />}
                allowEscapeViewBox={{
                  x: true,
                  y: true,
                }}
                wrapperStyle={{
                  zIndex: 9999,
                  outline: "none",
                }}
                cursor={false}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center content */}
          <div
            key={activeEntry?.name}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center">
                <span className="block text-xl font-bold text-foreground">
                  {pct(activeValue, total)}
                </span>

                <span className="block max-w-[110px] truncate text-xs text-muted-foreground">
                  {getLocalizedStatus(activeEntry?.name ?? "", t)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          {t("charts.noData")}
        </div>
      )}

      {/* Legend */}
      {donut.length > 0 && (
        <div className="space-y-2 rounded-xl bg-muted/40 px-4 py-3">
          {donut.map((entry, index) => {
            const color = getStatusColor(entry.name);
            const isActive = index === activeIndex;

            return (
              <div
                key={entry.name}
                className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-xs transition-all duration-500 ${
                  isActive ? "bg-primary/10" : "bg-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
                      isActive ? "scale-125" : "scale-100"
                    }`}
                    style={{
                      background: color,
                      boxShadow: isActive ? `0 0 6px ${color}` : "none",
                    }}
                  />

                  <span
                    className={`transition-colors duration-500 ${
                      isActive
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {getLocalizedStatus(entry.name, t)}
                  </span>
                </div>

                <span
                  className={`text-sm font-semibold transition-colors duration-500 ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {entry.value}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersStatusDonut;
