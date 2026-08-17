"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Eye } from "lucide-react";
import { Button } from "@/components";
import OrderStatusBadge from "./OrderStatusBadge";
import { formatCurrency, formatDate } from "./orderFormatters";
import type { AdminOrder, OrderStatus } from "@/types";

const orderStatusOptions: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PAYMENT_FAILED",
  "SHIPPED",
  "CANCELLED",
];

type Props = {
  orders: AdminOrder[];
  locale: string;
  updatingId: number | null;
  onUpdateStatus: (order: AdminOrder, status: OrderStatus) => void;
};

const OrdersTable = ({ orders, locale, updatingId, onUpdateStatus }: Props) => {
  const t = useTranslations("admin.orders.table");

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-card-soft text-left text-xs text-muted-foreground">
          <tr>
            <th className="px-4 py-3">{t("order")}</th>
            <th className="px-4 py-3">{t("customer")}</th>
            <th className="px-4 py-3">{t("date")}</th>
            <th className="px-4 py-3">{t("items")}</th>
            <th className="px-4 py-3">{t("total")}</th>
            <th className="px-4 py-3">{t("payment")}</th>
            <th className="px-4 py-3">{t("status")}</th>
            <th className="px-4 py-3 text-right">{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3 font-medium">#{order.id}</td>
              <td className="px-4 py-3">
                <div>{order.user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {order.user.email}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                {formatDate(order.createdAt, locale)}
              </td>
              <td className="px-4 py-3">{order.items.length}</td>
              <td className="px-4 py-3 font-medium whitespace-nowrap">
                {formatCurrency(order.total, locale)}
              </td>
              <td className="px-4 py-3">
                {order.payment ? (
                  <OrderStatusBadge
                    status={order.payment.status}
                    kind="payment"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {t("notCreated")}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <select
                  aria-label={`Update order ${order.id} status`}
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={(event) =>
                    onUpdateStatus(order, event.target.value as OrderStatus)
                  }
                  className="rounded border border-border bg-background px-2 py-1 text-xs"
                >
                  {orderStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-right">
                <Button
                  asChild
                  variant="outline"
                  size="xs"
                  leftIcon={<Eye className="h-3.5 w-3.5" />}
                >
                  <Link href={`/${locale}/admin/orders/${order.id}`}>
                    {t("details")}
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
