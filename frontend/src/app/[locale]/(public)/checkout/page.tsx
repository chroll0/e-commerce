"use client";

import { FormEvent, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { AuthGuard, Breadcrumbs, Button, Input } from "@/components";
import { orderApi } from "@/lib/orderApi";
import { paymentApi, PaymentOutcome } from "@/lib/paymentApi";
import { useNotificationStore } from "@/state/useNotificationStore";
import { useCartStore } from "@/state/useCartStore";

type CreatedOrder = {
  id: number;
  status: string;
  total: number;
};

type CreatedPayment = {
  id: string;
  status: string;
  amount: number;
  provider: string;
  transactionId?: string | null;
};

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const navT = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();

  const cartItems = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const notify = useNotificationStore((s) => s.push);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");

  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const [order, setOrder] = useState<CreatedOrder | null>(null);
  const [payment, setPayment] = useState<CreatedPayment | null>(null);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  const handleCreateOrder = async (e: FormEvent) => {
    e.preventDefault();

    if (!cartItems.length) {
      notify("error", t("errors.emptyCart"));
      return;
    }

    if (isCreatingOrder) return;

    setIsCreatingOrder(true);

    try {
      const createdOrder = (await orderApi.create({
        address,
        city,
        phone,
        zip: zip || undefined,
      })) as CreatedOrder;

      setOrder(createdOrder);
      clearCart();

      notify(
        "success",
        t("notifications.orderCreated", { orderId: createdOrder.id }),
      );

      const createdPayment = (await paymentApi.create(
        createdOrder.id,
      )) as CreatedPayment;
      setPayment(createdPayment);
    } catch (error: any) {
      notify(
        "error",
        error?.response?.data?.message || t("errors.createOrder"),
      );
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleSimulatePayment = async (outcome: PaymentOutcome) => {
    if (!payment || isSimulating) return;

    setIsSimulating(true);

    try {
      const res = await paymentApi.simulate(payment.id, outcome);
      const updatedPayment = res?.payment as CreatedPayment;
      const updatedOrder = res?.order as CreatedOrder;

      setPayment(updatedPayment);
      setOrder(updatedOrder);

      if (outcome === "SUCCESS") {
        notify(
          "success",
          t("notifications.paymentSuccess", { orderId: updatedOrder.id }),
        );
      } else if (outcome === "FAILED") {
        notify(
          "error",
          t("notifications.paymentFailed", { orderId: updatedOrder.id }),
        );
      } else {
        notify(
          "info",
          t("notifications.paymentCancelled", { orderId: updatedOrder.id }),
        );
      }
    } catch (error: any) {
      notify(
        "error",
        error?.response?.data?.message || t("errors.simulatePayment"),
      );
    } finally {
      setIsSimulating(false);
    }
  };

  const showPaymentActions = Boolean(
    order && payment && payment.status === "PENDING",
  );
  const showResult = Boolean(order && payment && payment.status !== "PENDING");

  return (
    <AuthGuard>
      <main className="mx-auto mt-10 w-full max-w-7xl px-4 space-y-8">
        <Breadcrumbs
          items={[
            { label: "eShop", href: `/${locale}` },
            { label: navT("cart"), href: `/${locale}/cart` },
            { label: t("title") },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-3">
          <section className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
            <h1 className="text-2xl font-bold text-primary">{t("title")}</h1>
            <p className="mt-1 text-sm text-secondary">{t("subtitle")}</p>

            {!order && (
              <form className="mt-6 space-y-4" onSubmit={handleCreateOrder}>
                <Input
                  label={t("form.address")}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  fullWidth
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label={t("form.city")}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    fullWidth
                  />

                  <Input
                    label={t("form.phone")}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    fullWidth
                  />
                </div>

                <Input
                  label={t("form.zip")}
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  fullWidth
                />

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={isCreatingOrder}
                  disabled={isCreatingOrder || !cartItems.length}
                >
                  {t("actions.placeOrder")}
                </Button>
              </form>
            )}

            {showPaymentActions && (
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-border bg-card-soft p-4 text-sm text-secondary">
                  {t("payment.pendingHint")}
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Button
                    fullWidth
                    loading={isSimulating}
                    disabled={isSimulating}
                    onClick={() => handleSimulatePayment("SUCCESS")}
                  >
                    {t("actions.simulateSuccess")}
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    loading={isSimulating}
                    disabled={isSimulating}
                    onClick={() => handleSimulatePayment("FAILED")}
                  >
                    {t("actions.simulateFailed")}
                  </Button>
                  <Button
                    variant="secondary"
                    fullWidth
                    loading={isSimulating}
                    disabled={isSimulating}
                    onClick={() => handleSimulatePayment("CANCELLED")}
                  >
                    {t("actions.simulateCancelled")}
                  </Button>
                </div>
              </div>
            )}

            {showResult && order && payment && (
              <div className="mt-6 space-y-4 rounded-xl border border-border bg-card-soft p-5">
                <h2 className="text-lg font-semibold text-primary">
                  {t("result.title")}
                </h2>
                <p className="text-sm text-secondary">
                  {t("result.orderId", { orderId: order.id })}
                </p>
                <p className="text-sm text-secondary">
                  {t("result.orderStatus", { status: order.status })}
                </p>
                <p className="text-sm text-secondary">
                  {t("result.paymentStatus", { status: payment.status })}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => router.push(`/${locale}/account/orders`)}
                  >
                    {t("actions.goToOrders")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/${locale}/products`)}
                  >
                    {t("actions.continueShopping")}
                  </Button>
                </div>
              </div>
            )}
          </section>

          <aside className="rounded-2xl border border-border bg-card p-6 h-fit">
            <h2 className="text-lg font-semibold text-primary">
              {t("summary.title")}
            </h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">{t("summary.items")}</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">{t("summary.total")}</span>
                <span className="font-semibold">₾{subtotal.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </AuthGuard>
  );
}
