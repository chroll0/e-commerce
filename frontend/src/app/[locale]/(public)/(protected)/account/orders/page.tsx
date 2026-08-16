"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

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

  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/orders");
        if (!isMounted) return;

        setOrders(data ?? []);
        setSelectedOrderId((current) => current ?? data?.[0]?.id ?? null);
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

    notify("info", t("exportMessage", { orderId: selectedOrder.id }));
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
                className={`w-full rounded-2xl border p-5 text-left transition-all ${
                  selectedOrder?.id === order.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-secondary">#{order.id}</p>
                    <h2 className="mt-1 text-lg font-semibold text-primary">
                      {formatDate(order.createdAt)}
                    </h2>
                  </div>

                  <span className="inline-flex rounded-full border border-border bg-card-soft px-3 py-1 text-xs font-medium text-secondary">
                    {formatStatus(order.status)}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-secondary">
                  <span>{t("itemsCount", { count: order.items.length })}</span>
                  <span className="font-semibold text-primary">
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

                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
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
