"use client";

import { useTranslations } from "next-intl";
import { formatCurrency, getProductTitle } from "./orderFormatters";
import type { AdminOrderItem } from "@/types";

type Props = {
  items: AdminOrderItem[];
  locale: string;
};

const OrderItemsTable = ({ items, locale }: Props) => {
  const t = useTranslations("admin.orders.details.items");

  return (
    <section className="overflow-x-auto rounded-xl border border-border bg-card">
      <div className="border-b border-border p-5">
        <h2 className="font-semibold">{t("title")}</h2>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-card-soft text-left text-xs text-muted-foreground">
          <tr>
            <th className="px-5 py-3">{t("product")}</th>
            <th className="px-5 py-3">{t("variant")}</th>
            <th className="px-5 py-3">{t("unitPrice")}</th>
            <th className="px-5 py-3">{t("quantity")}</th>
            <th className="px-5 py-3 text-right">{t("itemTotal")}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-border">
              <td className="px-5 py-4 font-medium">
                {getProductTitle(item.product, locale)}
              </td>
              <td className="px-5 py-4 text-muted-foreground">
                {item.variant ?? t("none")}
              </td>
              <td className="px-5 py-4">
                {formatCurrency(item.price, locale)}
              </td>
              <td className="px-5 py-4">{item.quantity}</td>
              <td className="px-5 py-4 text-right font-medium">
                {formatCurrency(item.price * item.quantity, locale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default OrderItemsTable;
