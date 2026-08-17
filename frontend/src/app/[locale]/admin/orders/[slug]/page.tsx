"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
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

  return (
    <>
      <AdminPageHeader
        title={t("details.title", { id: order.id })}
        description={t("details.createdAt", {
          date: formatDate(order.createdAt, locale),
        })}
        actions={
          <Button
            asChild
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            <Link href={`/${locale}/admin/orders`}>
              {t("actions.allOrders")}
            </Link>
          </Button>
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
