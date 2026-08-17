"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import OrderStatusBadge from "@/components/admin/orders/OrderStatusBadge";
import {
  formatCurrency,
  formatDate,
} from "@/components/admin/orders/orderFormatters";
import type { AdminPaymentRecord } from "@/types";

type Props = {
  payments: AdminPaymentRecord[];
  locale: string;
};

const PaymentsTable = ({ payments, locale }: Props) => {
  const t = useTranslations("admin.payments.table");

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-250 text-sm">
        <thead className="border-b border-border bg-card-soft text-left text-xs text-muted-foreground">
          <tr>
            <th className="px-4 py-3">{t("payment")}</th>
            <th className="px-4 py-3">{t("order")}</th>
            <th className="px-4 py-3">{t("customer")}</th>
            <th className="px-4 py-3">{t("amount")}</th>
            <th className="px-4 py-3">{t("provider")}</th>
            <th className="px-4 py-3">{t("transactionId")}</th>
            <th className="px-4 py-3">{t("status")}</th>
            <th className="px-4 py-3">{t("created")}</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr
              key={payment.id}
              className="border-b border-border last:border-0"
            >
              <td
                className="max-w-36 truncate px-4 py-3 font-mono text-xs"
                title={payment.id}
              >
                {payment.id}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/${locale}/admin/orders/${payment.orderId}`}
                  className="font-medium hover:underline"
                >
                  #{payment.orderId}
                </Link>
              </td>
              <td className="px-4 py-3">
                <div>{payment.order.user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {payment.order.user.email}
                </div>
              </td>
              <td className="px-4 py-3 font-medium whitespace-nowrap">
                {formatCurrency(payment.amount, locale)}
              </td>
              <td className="px-4 py-3">{payment.provider}</td>
              <td
                className="max-w-40 truncate px-4 py-3 font-mono text-xs"
                title={payment.transactionId ?? ""}
              >
                {payment.transactionId ?? t("notAssigned")}
              </td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={payment.status} kind="payment" />
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                {formatDate(payment.createdAt, locale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsTable;
