"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ImageIcon, PackageOpen } from "lucide-react";

import { AccountHeader, Button } from "@/components";
import { api } from "@/lib/axios";
import { getStatusPresentation } from "@/lib/orderStatus";
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

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

function OrdersSkeleton() {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-3 w-12 rounded bg-muted" />
                <div className="h-4 w-28 rounded bg-muted" />
              </div>
              <div className="h-6 w-20 rounded-full bg-muted" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="h-3 w-16 rounded bg-muted" />
              <div className="h-4 w-14 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
      <div className="animate-pulse rounded-2xl border border-border bg-card p-5">
        <div className="h-5 w-24 rounded bg-muted" />
        <div className="mt-6 space-y-4">
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-2/3 rounded bg-muted" />
          <div className="h-16 w-full rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

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
  const [loadError, setLoadError] = useState(false);

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
        setLoadError(false);
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
        if (!isMounted) return;

        const message =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || t("loadError");

        setLoadError(true);
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

  const getOrderStatus = (status: string) => {
    const presentation = getStatusPresentation(status);
    return {
      ...presentation,
      label: t(`statuses.${presentation.key}`),
    };
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
            <td>${escapeHtml(getProductTitle(item.product))}</td>
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
            <span class="badge">${escapeHtml(getOrderStatus(selectedOrder.status).label)}</span>
          </div>

          <div class="meta">
            <p><strong>Date:</strong> ${escapeHtml(formatDate(selectedOrder.createdAt))}</p>
            <p><strong>Address:</strong> ${escapeHtml(selectedOrder.address)}, ${escapeHtml(selectedOrder.city)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(selectedOrder.phone)}</p>
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
        <OrdersSkeleton />
      ) : loadError ? (
        <div className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center text-destructive">
          {t("loadError")}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <PackageOpen className="h-10 w-10 text-muted-foreground" />
          <p className="text-lg font-medium text-primary">{t("empty")}</p>
          <p className="max-w-sm text-sm text-secondary">
            {t("emptyDescription")}
          </p>
          <Button asChild size="sm">
            <Link href={`/${locale}/products`}>{t("browseProducts")}</Link>
          </Button>
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
                    className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium ${getOrderStatus(order.status).classes}`}
                  >
                    {getOrderStatus(order.status).label}
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
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getOrderStatus(selectedOrder.status).classes}`}
                >
                  {getOrderStatus(selectedOrder.status).label}
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
                        className="flex items-center gap-3 rounded-xl border border-border bg-card-soft p-3"
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-card">
                          {item.product.images?.[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={getProductTitle(item.product)}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/${locale}/products/${item.product.slug}`}
                            className="block truncate font-medium text-primary hover:underline"
                          >
                            {getProductTitle(item.product)}
                          </Link>
                          <p className="text-xs text-secondary">
                            {t("quantity")}: {item.quantity}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
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
