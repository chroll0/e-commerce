"use client";

import { useTranslations } from "next-intl";
import OrderStatusBadge from "./OrderStatusBadge";
import { formatCurrency } from "./orderFormatters";
import type { AdminOrder } from "@/types";

type Props = {
  order: AdminOrder;
  locale: string;
};

const OrderOverviewCard = ({ order, locale }: Props) => {
  const t = useTranslations("admin.orders.details.overview");

  return (
    <section className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
      <h2 className="font-semibold">{t("title")}</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-muted-foreground">{t("orderStatus")}</dt>
          <dd className="mt-1">
            <OrderStatusBadge status={order.status} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">
            {t("paymentStatus")}
          </dt>
          <dd className="mt-1">
            {order.payment ? (
              <OrderStatusBadge status={order.payment.status} kind="payment" />
            ) : (
              t("notCreated")
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">{t("total")}</dt>
          <dd className="mt-1 font-semibold">
            {formatCurrency(order.total, locale)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">{t("items")}</dt>
          <dd className="mt-1 font-semibold">{order.items.length}</dd>
        </div>
      </dl>
    </section>
  );
};

export default OrderOverviewCard;
