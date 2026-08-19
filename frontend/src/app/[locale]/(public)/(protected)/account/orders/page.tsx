"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { AccountHeader, Button } from "@/components";
import { api } from "@/lib/axios";
import { useNotificationStore } from "@/state/useNotificationStore";

type OrderItem = {
  id: number;
  quantity: number;
  price: number;
  product: {
    slug: string;
    images?: string[];
    translations?: { locale: string; title: string }[];
  };
};

type UserOrder = {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  address: string;
  city: string;
  zip?: string | null;
  phone: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const t = useTranslations("account.orders");
  const locale = useLocale();
  const notify = useNotificationStore((state) => state.push);
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("orderId");

  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(
    orderIdParam ? Number(orderIdParam) : null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderIdParam) {
      setSelectedOrderId(Number(orderIdParam));
    }
  }, [orderIdParam]);

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/orders");
        if (!isMounted) return;

        setOrders(data ?? []);
        setSelectedOrderId((current) => {
          if (
            current &&
            data?.some((order: UserOrder) => order.id === current)
          ) {
            return current;
          }
          return data?.[0]?.id ?? null;
        });
      } catch (error: unknown) {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || t("loadError");

        notify("error", message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [notify, t]);

  const selectedOrder = useMemo(
    () =>
      orders.find((order) => order.id === selectedOrderId) ?? orders[0] ?? null,
    [orders, selectedOrderId],
  );

  const formatStatus = (status: string) => {
    const normalized = status.toLowerCase();
    const labels: Record<string, string> = {
      pending: t("statuses.pending"),
      paid: t("statuses.paid"),
      payment_failed: t("statuses.paymentFailed"),
      shipped: t("statuses.shipped"),
      cancelled: t("statuses.cancelled"),
    };

    return labels[normalized] ?? status;
  };

  const getStatusStyles = (status: string) => {
    const normalized = status.toLowerCase();

    switch (normalized) {
      case "paid":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
      case "pending":
        return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300";
      case "payment_failed":
        return "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300";
      case "shipped":
        return "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300";
      case "cancelled":
        return "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300";
      default:
        return "border-border bg-card-soft text-secondary";
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getProductTitle = (product: UserOrder["items"][number]["product"]) => {
    const translation = product.translations?.find(
      (item) => item.locale === locale,
    );

    return translation?.title ?? product.translations?.[0]?.title ?? "Product";
  };

  const handleExport = () => {
    if (!selectedOrder) {
      notify("info", t("exportEmpty"));
      return;
    }

    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      notify("error", t("exportBlocked"));
      return;
    }

    const orderRows = selectedOrder.items
      .map(
        (item) => `
          <tr>
            <td>${getProductTitle(item.product)}</td>
            <td>${item.quantity}</td>
            <td>₾${Number(item.price).toFixed(2)}</td>
            <td>₾${Number(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `,
      )
      .join("");

    const html = `
      <html>
        <head>
          <title>Order #${selectedOrder.id}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; margin: 32px; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
            .badge { display: inline-block; padding: 6px 10px; border-radius: 999px; background: #f3f4f6; font-size: 12px; }
            .meta { margin-bottom: 24px; color: #4b5563; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border-bottom: 1px solid #e5e7eb; padding: 10px 8px; text-align: left; }
            .total { margin-top: 16px; text-align: right; font-weight: 700; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Order #${selectedOrder.id}</h1>
            </div>
            <span class="badge">${formatStatus(selectedOrder.status)}</span>
          </div>

          <div class="meta">
            <p><strong>Date:</strong> ${formatDate(selectedOrder.createdAt)}</p>
            <p><strong>Address:</strong> ${selectedOrder.address}, ${selectedOrder.city}</p>
            <p><strong>Phone:</strong> ${selectedOrder.phone}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderRows}
            </tbody>
          </table>

          <div class="total">Total: ₾${Number(selectedOrder.total).toFixed(2)}</div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();

    notify("success", t("exportMessage", { orderId: selectedOrder.id }));
  };

  return (
    <div className="mx-auto w-full max-w-6xl py-10">
      <AccountHeader
        title={t("title")}
        description={t("description")}
        action={
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={!selectedOrder}
          >
            {t("export")}
          </Button>
        }
      />

      {loading ? (
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-sm text-secondary">
          {t("loading")}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-lg font-medium text-primary">{t("empty")}</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {orders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => setSelectedOrderId(order.id)}
                className={`w-full rounded-2xl border p-5 text-left transition-all duration-200 ${
                  selectedOrder?.id === order.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:border-primary/40 hover:bg-muted/40"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground tracking-wide">
                      #{order.id}
                    </p>
                    <h2 className="mt-1 text-base font-semibold text-foreground">
                      {formatDate(order.createdAt)}
                    </h2>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyles(order.status)}`}
                  >
                    {formatStatus(order.status)}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">
                    {t("itemsCount", { count: order.items.length })}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    ₾{Number(order.total).toFixed(2)}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {selectedOrder ? (
            <aside className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <p className="text-sm text-secondary">{t("orderId")}</p>
                  <h3 className="text-xl font-bold text-primary">
                    #{selectedOrder.id}
                  </h3>
                </div>

                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyles(selectedOrder.status)}`}
                >
                  {formatStatus(selectedOrder.status)}
                </span>
              </div>

              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-sm text-secondary">{t("date")}</p>
                  <p className="mt-1 font-medium text-primary">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-secondary">{t("shipping")}</p>
                  <p className="mt-1 text-sm text-primary">
                    {selectedOrder.address}, {selectedOrder.city}
                  </p>
                  {selectedOrder.zip ? (
                    <p className="text-sm text-secondary">
                      {selectedOrder.zip}
                    </p>
                  ) : null}
                  <p className="text-sm text-secondary">
                    {selectedOrder.phone}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-secondary">{t("itemsLabel")}</p>
                  <div className="mt-3 space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card-soft p-3"
                      >
                        <div>
                          <p className="font-medium text-primary">
                            {getProductTitle(item.product)}
                          </p>
                          <p className="text-xs text-secondary">
                            {t("quantity")}: {item.quantity}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-medium text-primary">
                            ₾{Number(item.price).toFixed(2)}
                          </p>
                          <p className="text-xs text-secondary">
                            {t("subtotal")}: ₾
                            {Number(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card-soft p-4">
                  <div className="flex items-center justify-between text-sm text-secondary">
                    <span>{t("total")}</span>
                    <span className="text-lg font-bold text-primary">
                      ₾{Number(selectedOrder.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          ) : null}
        </div>
      )}
    </div>
  );
}
