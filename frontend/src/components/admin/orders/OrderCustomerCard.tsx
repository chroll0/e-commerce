"use client";

import { useTranslations } from "next-intl";
import type { AdminOrder } from "@/types";

type Props = {
  order: AdminOrder;
};

const OrderCustomerCard = ({ order }: Props) => {
  const t = useTranslations("admin.orders.details.customer");

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-semibold">{t("title")}</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">{t("name")}</dt>
          <dd>{order.user.name}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">{t("email")}</dt>
          <dd className="break-all">{order.user.email}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">{t("phone")}</dt>
          <dd>{order.user.phone ?? order.phone}</dd>
        </div>
      </dl>
    </section>
  );
};

export default OrderCustomerCard;
