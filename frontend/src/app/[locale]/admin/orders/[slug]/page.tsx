"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Download, ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import {
  AdminPageHeader,
  Button,
  OrderCustomerCard,
  OrderDeliveryCard,
  OrderFinancialSummary,
  OrderItemsTable,
  OrderOverviewCard,
  OrderPaymentInfo,
  Spinner,
} from "@/components";
import { formatDate } from "@/components/admin/orders/orderFormatters";
import { orderApi } from "@/lib/orderApi";
import type { AdminOrder } from "@/types";

const AdminOrderDetailsPage = () => {
  const locale = useLocale();
  const t = useTranslations("admin.orders");
  const params = useParams<{ slug: string }>();
  const orderId = Number(params.slug);
  const hasInvalidOrderId = !Number.isInteger(orderId);
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hasInvalidOrderId) return;

    void orderApi
      .getByIdForAdmin(orderId)
      .then(setOrder)
      .catch(() => setError(t("details.loadError")));
  }, [hasInvalidOrderId, orderId, t]);

  if (hasInvalidOrderId || error)
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
        {hasInvalidOrderId ? t("details.invalidId") : error}
      </div>
    );
  if (!order)
    return (
      <div className="flex min-h-64 items-center justify-center rounded-xl border border-border">
        <Spinner size="lg" />
      </div>
    );
  const itemsTotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleExportPdf = () => {
    const printWindow = window.open("", "_blank", "width=980,height=820");

    if (!printWindow) {
      return;
    }

    const itemRows = order.items
      .map(
        (item) => `
          <tr>
            <td>${item.product.translations[0]?.title ?? item.product.slug}</td>
            <td>${item.variant ?? "-"}</td>
            <td>₾${Number(item.price).toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>₾${Number(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `,
      )
      .join("");

    const paymentInfo = order.payment
      ? `
        <div class="meta-row">
          <span>${t("details.payment.provider")}</span>
          <strong>${order.payment.provider}</strong>
        </div>
        <div class="meta-row">
          <span>${t("details.payment.transactionId")}</span>
          <strong>${order.payment.transactionId ?? t("details.payment.notAssigned")}</strong>
        </div>
        <div class="meta-row">
          <span>${t("details.payment.status")}</span>
          <strong>${order.payment.status}</strong>
        </div>
      `
      : `<p>${t("details.payment.empty")}</p>`;

    const html = `
      <html>
        <head>
          <title>${t("details.title", { id: order.id })}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; margin: 32px; }
            h1 { margin: 0 0 12px; font-size: 28px; }
            .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
            .badge { display: inline-block; padding: 6px 10px; border-radius: 999px; background: #f3f4f6; font-size: 12px; }
            .meta { display: grid; grid-template-columns: repeat(2, minmax(220px, 1fr)); gap: 12px 24px; margin-bottom: 28px; }
            .meta-row { display: flex; justify-content: space-between; gap: 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
            .meta-row span { color: #4b5563; }
            .section { margin-top: 30px; }
            .section h2 { margin-bottom: 12px; font-size: 18px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border-bottom: 1px solid #e5e7eb; padding: 10px 8px; text-align: left; }
            th { background: #f9fafb; }
            .total-box { margin-top: 16px; text-align: right; font-weight: 700; font-size: 18px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="topbar">
            <div>
              <h1>${t("details.title", { id: order.id })}</h1>
              <div>${t("details.createdAt", { date: formatDate(order.createdAt, locale) })}</div>
            </div>
            <span class="badge">${order.status}</span>
          </div>

          <div class="meta">
            <div class="meta-row"><span>${t("details.customer.name")}</span><strong>${order.user.name}</strong></div>
            <div class="meta-row"><span>${t("details.customer.email")}</span><strong>${order.user.email}</strong></div>
            <div class="meta-row"><span>${t("details.customer.phone")}</span><strong>${order.user.phone ?? "-"}</strong></div>
            <div class="meta-row"><span>${t("details.overview.total")}</span><strong>₾${Number(order.total).toFixed(2)}</strong></div>
            <div class="meta-row"><span>${t("details.delivery.title")}</span><strong>${order.address}, ${order.city}${order.zip ? `, ${order.zip}` : ""}</strong></div>
            <div class="meta-row"><span>${t("details.overview.orderStatus")}</span><strong>${order.status}</strong></div>
          </div>

          <div class="section">
            <h2>${t("details.items.title")}</h2>
            <table>
              <thead>
                <tr>
                  <th>${t("details.items.product")}</th>
                  <th>${t("details.items.variant")}</th>
                  <th>${t("details.items.unitPrice")}</th>
                  <th>${t("details.items.quantity")}</th>
                  <th>${t("details.items.itemTotal")}</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
            </table>
            <div class="total-box">${t("details.financial.total")}: ₾${Number(order.total).toFixed(2)}</div>
          </div>

          <div class="section">
            <h2>${t("details.payment.title")}</h2>
            ${paymentInfo}
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <>
      <AdminPageHeader
        title={t("details.title", { id: order.id })}
        description={t("details.createdAt", {
          date: formatDate(order.createdAt, locale),
        })}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="h-4 w-4" />}
              onClick={handleExportPdf}
            >
              {t("details.export")}
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              <Link href={`/${locale}/admin/orders`}>
                {t("actions.allOrders")}
              </Link>
            </Button>
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <OrderOverviewCard order={order} locale={locale} />
        <OrderCustomerCard order={order} />
      </div>
      <OrderItemsTable items={order.items} locale={locale} />
      <div className="grid gap-6 lg:grid-cols-2">
        <OrderDeliveryCard order={order} />
        <OrderFinancialSummary
          itemsTotal={itemsTotal}
          total={order.total}
          locale={locale}
        />
      </div>
      <OrderPaymentInfo payment={order.payment} locale={locale} />
    </>
  );
};

export default AdminOrderDetailsPage;
