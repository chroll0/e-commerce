"use client";

import { FC, useMemo } from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { useTranslations } from "next-intl";

type Props = {
  data: { status: string; count: number }[];
};

const STATUS_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--muted-foreground))",
  "hsl(var(--destructive))",
];

const AdminOrdersStatusDonut: FC<Props> = ({ data }) => {
  const t = useTranslations("admin.dashboard");

  const donut = useMemo(
    () =>
      (data ?? []).map((x) => ({
        name: x.status,
        value: x.count,
      })),
    [data],
  );

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-sm font-medium">
        {t("widgets.ordersByStatus30d")}
      </div>
      <div className="mt-3 h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={donut}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={80}
            >
              {donut.map((_, i) => (
                <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 space-y-1">
        {donut.map((x, i) => (
          <div
            key={x.name}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: STATUS_COLORS[i % STATUS_COLORS.length] }}
              />
              <span className="text-muted-foreground">{x.name}</span>
            </div>
            <span className="font-medium">{x.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrdersStatusDonut;
