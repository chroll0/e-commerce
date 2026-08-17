"use client";

import { useTranslations } from "next-intl";
import { formatCurrency } from "./orderFormatters";

type Props = {
  itemsTotal: number;
  total: number;
  locale: string;
};

const OrderFinancialSummary = ({ itemsTotal, total, locale }: Props) => {
  const t = useTranslations("admin.orders.details.financial");

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-semibold">{t("title")}</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt>{t("subtotal")}</dt>
          <dd>{formatCurrency(itemsTotal, locale)}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-3 font-semibold">
          <dt>{t("total")}</dt>
          <dd>{formatCurrency(total, locale)}</dd>
        </div>
        <p className="text-xs text-muted-foreground">{t("note")}</p>
      </dl>
    </section>
  );
};

export default OrderFinancialSummary;
