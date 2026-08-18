"use client";

import { FC, useMemo } from "react";
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

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-foreground">{formatStatus(name)}</p>
      <p className="text-muted-foreground">{String(value)}</p>
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

  const primaryEntry = donut[0];
  const primaryValue = primaryEntry?.value ?? 0;

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

      {/* Chart + center label */}
      {total > 0 ? (
        <div className="relative">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
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
                {donut.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={getStatusColor(entry.name)}
                    opacity={0.9}
                  />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-foreground">
              {pct(primaryValue, total)}
            </span>

            <span className="max-w-[90px] truncate text-xs text-muted-foreground">
              {getLocalizedStatus(primaryEntry?.name ?? "", t)}
            </span>
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
          {donut.map((entry) => {
            const color = getStatusColor(entry.name);

            return (
              <div
                key={entry.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: color }}
                  />

                  <span className="text-muted-foreground">
                    {getLocalizedStatus(entry.name, t)}
                  </span>
                </div>

                <span className="text-sm font-semibold text-foreground">
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
