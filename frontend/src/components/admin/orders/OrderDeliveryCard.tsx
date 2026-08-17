"use client";

import { useTranslations } from "next-intl";
import type { AdminOrder } from "@/types";

type Props = {
  order: AdminOrder;
};

const OrderDeliveryCard = ({ order }: Props) => {
  const t = useTranslations("admin.orders.details.delivery");

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-semibold">{t("title")}</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {order.address}
        <br />
        {order.city}
        {order.zip ? `, ${order.zip}` : ""}
        <br />
        {order.phone}
      </p>
    </section>
  );
};

export default OrderDeliveryCard;
