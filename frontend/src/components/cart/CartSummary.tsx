"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components";
import { useCartStore } from "@/state/useCartStore";
import { useCartActions } from "@/state/useCartActions";
import { ShieldCheckIcon, TruckIcon, CreditCardIcon } from "lucide-react";

export default function CartSummary() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const { clear } = useCartActions();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const shipping = items.length ? 9.99 : 0;
  const tax = subtotal * 0.1;
  const discount = 0;
  const total = subtotal + shipping + tax - discount;

  return (
    <div className="sticky top-4 h-fit rounded-2xl border border-border bg-card p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary">{t("summary")}</h2>

        <p className="mt-1 text-sm text-secondary">
          {itemCount} {t("totalItems")}
        </p>
      </div>

      {/* BREAKDOWN */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-secondary">{t("subtotal")}</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-secondary">{t("shipping")}</span>
          <span className="font-medium">${shipping.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-secondary">{t("tax")}</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>{t("discount")}</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* TOTAL */}
      <div className="mt-5 border-t border-border pt-5 flex justify-between">
        <span className="text-base font-semibold">{t("total")}</span>

        <span className="text-2xl font-bold text-primary">
          ${total.toFixed(2)}
        </span>
      </div>

      {/* TRUST */}
      <div className="mt-5 rounded-xl border border-border bg-card-soft p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <ShieldCheckIcon className="h-4 w-4" />
          <span>{t("secureCheckout")}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <CreditCardIcon className="h-4 w-4" />
          <span>{t("encryptedPayments")}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <TruckIcon className="h-4 w-4" />
          <span>{t("fastDelivery")}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-6 space-y-3">
        <Button
          size="lg"
          fullWidth
          onClick={() => router.push(`/${locale}/checkout`)}
        >
          {t("checkout")}
        </Button>

        <Button
          variant="outline"
          fullWidth
          onClick={() => router.push(`/${locale}/products`)}
        >
          {t("continueShopping")}
        </Button>

        <Button variant="text" fullWidth onClick={clear}>
          {t("clearCart")}
        </Button>
      </div>
    </div>
  );
}
