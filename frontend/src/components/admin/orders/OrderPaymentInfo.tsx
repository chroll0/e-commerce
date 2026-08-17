"use client";

import { useTranslations } from "next-intl";
import OrderStatusBadge from "./OrderStatusBadge";
import { formatCurrency, formatDate } from "./orderFormatters";
import type { AdminPayment } from "@/types";

type Props = {
  payment: AdminPayment | null;
  locale: string;
};

const OrderPaymentInfo = ({ payment, locale }: Props) => {
  const t = useTranslations("admin.orders.details.payment");

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-semibold">{t("title")}</h2>
      {payment ? (
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-muted-foreground">{t("id")}</dt>
            <dd className="mt-1 break-all font-mono text-xs">{payment.id}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{t("provider")}</dt>
            <dd className="mt-1">{payment.provider}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{t("amount")}</dt>
            <dd className="mt-1">{formatCurrency(payment.amount, locale)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              {t("transactionId")}
            </dt>
            <dd className="mt-1 break-all">
              {payment.transactionId ?? t("notAssigned")}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{t("status")}</dt>
            <dd className="mt-1">
              <OrderStatusBadge status={payment.status} kind="payment" />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{t("created")}</dt>
            <dd className="mt-1">{formatDate(payment.createdAt, locale)}</dd>
          </div>
        </dl>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">{t("empty")}</p>
      )}
    </section>
  );
};

export default OrderPaymentInfo;
